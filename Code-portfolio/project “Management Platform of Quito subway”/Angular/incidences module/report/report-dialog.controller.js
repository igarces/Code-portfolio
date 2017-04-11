(function () {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('ReportDialogController', ReportDialogController);

    ReportDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$state', '$uibModal', 'entity', 'Report', 'IncidenceTechnical',
        'AttachedDocument', 'User', 'AdministrativeUnit', 'VisitSiteNom', 'StationsNom', 'BetweenTunnelNom', 'SpecialSiteNom', 'Activity',
        'DataUtils', 'Principal', 'nomenclatorsConstants', 'IncidenceStateNom', 'Site', '$http', 'NgMap', 'AlertService'];

    function ReportDialogController($timeout, $scope, $stateParams, $state, $uibModal, entity, Report, IncidenceTechnical,
           AttachedDocument, User, AdministrativeUnit, VisitSiteNom, StationsNom, BetweenTunnelNom, SpecialSiteNom, Activity,
           DataUtils, Principal, nomenclatorsConstants, IncidenceStateNom, Site, $http, NgMap, AlertService) {

        var vm = this;
        vm.incidenceTechnicals = [];
        vm.attacheddocuments = [];

        //initials methods
        getReport();

        //Nommenclators
        vm.incidencestatenoms = IncidenceStateNom.query();
        vm.visitsitenoms = VisitSiteNom.query();
        Site.getAll(function(sites){
            vm.differentSites = sites;
            if(vm.map){
                changeVisitSite();
            }
        });
        vm.activities = Activity.getAll();

        //variables
        vm.pattern = '[\\S \-()]+';
        vm.patternNewLine = '[\\S \\n \-()]+';
        vm.patternWords = '^[a-zA-Zá-úÁ-Ú \\s]+$';
        vm.patternNumbers = '^[0-9]{1,3}$';
        vm.defaultOption = '<Seleccione>';
        vm.userLoggedId = null;
        vm.byteSize = DataUtils.byteSize;
        vm.openFile = DataUtils.openFile;
        vm.currentUser = null;
        vm.showVisitReportData = true;
        vm.showIncidenceTechnical = true;
        vm.showCompleteIncidences = false;
        vm.showErrorDocMessage = false;

        //Incidence State Nom
        vm.incidenceStateOpenId = nomenclatorsConstants.incidenceStateOpenId;
        vm.incidenceStateAssignedId = nomenclatorsConstants.incidenceStateAssignedId;

        //Visit Site Nom
        vm.visitSiteStationId = nomenclatorsConstants.visitSiteStationId;
        vm.visitSiteTunnelSectionId = nomenclatorsConstants.visitSiteTunnelSectionId;
        vm.visitSiteSpecialSite = nomenclatorsConstants.visitSiteSpecialSite;

        //Activity Classification
        vm.classificationActivityId = nomenclatorsConstants.classificationActivityId;
        vm.classificationSubactivityId = nomenclatorsConstants.classificationSubactivityId;


        //Date configuration
        vm.datePickerOpenStatus = {};
        vm.datePickerOpenStatus.visitStartDate = false;
        vm.datePickerOpenStatus.startTime = false;
        vm.datePickerOpenStatus.endTime = false;

        function openCalendar(date) {
            vm.datePickerOpenStatus[date] = true;
        }
        vm.visitDateOption = {
            maxDate: new Date()
        };
        $scope.$watch('vm.report.visitStartDate', updateAsync);
        function updateAsync(){
            vm.visitDateOption = {
                maxDate: new Date()
            };
            $scope.$evalAsync();
        }

        //Functions
        vm.addPhoto = addPhoto;
        vm.deletePhoto = deletePhoto;
        vm.clear = clear;
        vm.openCalendar = openCalendar;
        vm.save = save;
        vm.filterStation = filterStation;
        vm.filterBetweenTunnel = filterBetweenTunnel;
        vm.filterSpecialSite = filterSpecialSite;
        vm.filterActivityByAdminUnit = filterActivityByAdminUnit;
        vm.filterSubActivity = filterSubActivity;
        vm.getIncidenceState = getIncidenceState;
        vm.definitive = definitive;
        vm.showHidePanel = showHidePanel;
        vm.changeStation = changeStation;
        vm.changeStretchTunnel = changeStretchTunnel;
        vm.changeSpecialSite = changeSpecialSite;
        vm.changeVisitSite = changeVisitSite;
        vm.closeErrorDocMessage = closeErrorDocMessage;
        initTime();
        initPhotoObject();
        getCurrentUser();

        function getReport() {
            if (Report.reportSaved !== undefined && Report.reportSaved !== null) {
                vm.report = Report.reportSaved;
                Report.reportSaved = null;
                vm.incidenceTechnicals = vm.report.incidenceTechnicals;
                vm.attacheddocuments = vm.report.photographicRecords;

                if(vm.report.id === null && Report.incidenceTechnical !== null && Report.incidenceTechnical !== undefined){
                    if(Report.incidenceTechnicalIndex === undefined || Report.incidenceTechnicalIndex === null){
                        vm.incidenceTechnicals.push(Report.incidenceTechnical);
                    }else{
                        vm.incidenceTechnicals[Report.incidenceTechnicalIndex] = Report.incidenceTechnical;
                    }
                }

                Report.incidenceTechnicalIndex = null;
                Report.incidenceTechnical = null;

            } else {
                vm.report = entity;
                searchPhotos();
            }

            initListIncidence(vm.report.id);
            if(vm.report.hasIncidences === null){
                vm.report.hasIncidences = false;
            }

            vm.showEditLabel = false;
            if($stateParams.id){
                vm.showEditLabel = true;
            }

            if(vm.report.reportDate === null){
                vm.report.reportDate = new Date();
            }
        }

        function clear() {
            $state.go('report', null, {reload: true});
        }

        function definitive (definitiveFlag) {
            if(definitiveFlag){
                for(var index in  vm.incidenceTechnicals){
                    if(vm.incidenceTechnicals[index] && Number(index) >= 0){
                        vm.incidenceTechnicals[index].addHistory = true;
                        vm.incidenceTechnicals[index].incidenceStateId = vm.incidenceStateAssignedId;
                        vm.incidenceTechnicals[index].userLoggedId = vm.userLoggedId;
                    }
                }
                vm.report.isComplete = true;
            }else{
                vm.report.isComplete = false;
            }
        }

        function save() {
            vm.isSaving = true;
            vm.report.incidenceTechnicals = vm.incidenceTechnicals;
            vm.report.photographicRecords =  vm.attacheddocuments;

            if(vm.report.reportNumber === null){
                vm.report.reportNumber = '0';
            }

            if(vm.report.hasIncidences === null){
                vm.report.hasIncidences = false;
            }

            if(vm.report.visitSiteId === null){
                vm.report.stationId = null;
                vm.report.stretchTunnelId = null;
                vm.specialSiteId = null;
            }

            if(vm.report.visitSiteId === vm.visitSiteStationId){
                vm.report.stretchTunnelId = null;
                vm.specialSiteId = null;
            }

            if(vm.report.visitSiteId === vm.visitSiteTunnelSectionId){
                vm.report.stationId = null;
            }

            if (vm.report.id !== null) {
                Report.update(vm.report, onSaveSuccess, onSaveError);
            } else {
                Report.save(vm.report, onSaveSuccessNew, onSaveError);
            }
        }

        function onSaveSuccess(result) {
            $scope.$emit('metroquitoApp:reportUpdate', result);
            searchPhotos();
            vm.isSaving = false;

            if(vm.report.isComplete){
                clear();
            }

            if(result.hasIncidences === false){
                vm.incidenceTechnicals = [];
            }
        }

        function onSaveSuccessNew(result) {
            vm.report.id = result.id;
            searchPhotos();
            vm.report.reportNumber = result.reportNumber;
            initListIncidence(result.id);
            onSaveSuccess(result);
        }

        function onSaveError() {
            vm.isSaving = false;
        }

        function initTime() {
            if ( vm.report.visitStartDate === null ||  vm.report.visitStartDate === undefined) {
                var d = new Date();
                d.setMilliseconds(0);
                d.setSeconds(0);
                d.setTime(d.getTime());
                vm.report.visitStartDate = d;
                vm.report.startTime = d;
                vm.report.endTime = d;
            }
        }

        function initPhotoObject() {
            vm.photo = null;
            vm.photoContentType = null;
            vm.photoDescription = null;
            vm.photoName = null;
        }

        function getCurrentUser() {
            Principal.identity().then(function (account) {
                User.get({login: account.login}, function (result) {
                    vm.userLoggedId = result.id;

                    if(vm.report.visitorId === null){
                        vm.report.visitorId = result.id;
                        vm.report.visitor = result;
                        vm.currentUser = result.firstName + ' ' + result.lastName;
                    }else{
                        vm.currentUser = vm.report.visitor.firstName + ' ' + vm.report.visitor.lastName;
                    }

                    if(vm.report.administrativeUnitId === null){
                        vm.report.administrativeUnitId = result.adminUnitId;
                        if(result.adminUnitId){
                            AdministrativeUnit.get({id: result.adminUnitId},function (adminUnit) {
                                vm.report.administrativeUnitName = adminUnit.name;
                            });
                        }
                    }
                });
            });
        }

        function searchPhotos() {
            if(vm.report.id !== null){
                AttachedDocument.query({
                    reportId: vm.report.id
                }, onSuccess, onError);
                function onSuccess(data, headers) {
                    vm.attacheddocuments = data;
                }
                function onError() {
                    console.log("error");
                }
            }
        }

        function addPhoto() {

            if(validatePhoto()){
                var filePhoto = {
                    id: null,
                    description: vm.photoDescription,
                    contentFile: vm.photo,
                    contentFileContentType: vm.photoContentType,
                    fileName: vm.photoName
                }
                vm.attacheddocuments.push(filePhoto);
                initPhotoObject();

                $scope.editForm.attachedDescripcion.$setPristine();
            }else{
                vm.showErrorDocMessage = true;
                $timeout(function () {
                    closeErrorDocMessage();
                }, 5000);
            }
        }

        function closeErrorDocMessage() {
            vm.showErrorDocMessage = false;
        }

        function validatePhoto(){
            for(var index in vm.attacheddocuments){
                if(vm.attacheddocuments[index]){
                    if(vm.photoName === vm.attacheddocuments[index].fileName){
                        return false;
                    }
                }
            }
            return true;
        }


        function deletePhoto(index) {
           if(vm.attacheddocuments[index].id !== null && vm.attacheddocuments[index].id !== undefined){
               AttachedDocument.delete({id: vm.attacheddocuments[index].id});
           }
            vm.attacheddocuments.splice(index, 1);
        }

        vm.setPhoto = function ($file) {
            if ($file && $file.$error === 'pattern') {
                return;
            }
            if ($file) {
                DataUtils.toBase64($file, function(base64Data) {
                    $scope.$apply(function() {
                        vm.photo = base64Data;
                        vm.photoContentType = $file.type;
                        vm.photoName = $file.name;
                    });
                });
            }
        };

        vm.addIncidenceTechnical = function () {
            vm.report.incidenceTechnicals = vm.incidenceTechnicals;
            vm.report.photographicRecords = vm.attacheddocuments;
            Report.reportSaved = vm.report;

            if(vm.report.id !== null){
                $state.go('incidence-technical.new', {reportId: vm.report.id}, {reload: true});
            }else{
                $state.go('incidence-technical.new', {reportId: '-1'}, {reload: true});
            }
        }

        vm.editIncidenceTechnical = function (incidence, index) {
            vm.report.incidenceTechnicals = vm.incidenceTechnicals;
            vm.report.photographicRecords = vm.attacheddocuments;
            Report.reportSaved = vm.report;
            Report.incidenceTechnical = incidence;
            Report.incidenceTechnicalIndex = index;

            if(vm.report.id !== null){
                $state.go('incidence-technical.edit', {id: incidence.id, reportId: vm.report.id}, {reload: true});
            }else{
                $state.go('incidence-technical.edit', {id: 0, reportId: '-1'}, {reload: true});
            }
        }

        vm.detailIncidenceTechnical = function (incidence, index) {
            vm.report.incidenceTechnicals = vm.incidenceTechnicals;
            vm.report.photographicRecords = vm.attacheddocuments;
            Report.reportSaved = vm.report;
            Report.incidenceTechnical = incidence;

            if(vm.report.id !== null){
                $state.go('incidence-technical-detail', {id: incidence.id, reportId: vm.report.id}, {reload: true});
            }else{
                $state.go('incidence-technical-detail', {id: 0, reportId: '-1'}, {reload: true});
            }
        }

        function initListIncidence(reportId) {
            if(reportId != null){
                searchIncidences(reportId);
            }
        }

        function searchIncidences(reportId) {
            IncidenceTechnical.query({
                sort: 'id,desc',
                reportId: ''+reportId+'',
                incidenceNumber: '',
                fromDate: '',
                toDate: '',
                state: '',
                responsible: '',
                administrativeUnitId: ''
            }, onSuccess, onError);
            function onSuccess(data, headers) {
                vm.incidenceTechnicals = data;
                vm.report.incidenceTechnicals = data;
            }
            function onError() {
                console.log("error");
            }
        }

        function getIncidenceState(incidenceStateId) {
            if(incidenceStateId !== null){
                for(var index in vm.incidencestatenoms){
                    if(vm.incidencestatenoms[index].id === incidenceStateId){
                        return vm.incidencestatenoms[index].value;
                    }
                }
            }
            return '';
        }

        function showHidePanel(flagPanel) {
            switch (flagPanel){
                case 1:
                    vm.showVisitReportData = (vm.showVisitReportData)? false: true;
                    break;

                case 2:
                    vm.showIncidenceTechnical = (vm.showIncidenceTechnical)? false: true;
                    break;
            }
        }

        function filterStation(item) {
            if(item.typeId === vm.visitSiteStationId){
                return true;
            }
            return false;
        }

        function filterBetweenTunnel(item) {
            if(item.typeId === vm.visitSiteTunnelSectionId){
                return true;
            }
            return false;
        }

        function filterSpecialSite(item) {
            if(item.typeId === vm.visitSiteSpecialSite && item.stretchTunnelId === vm.report.stretchTunnelId){
                return true;
            }
            return false;
        }

        function filterActivityByAdminUnit(item) {
            if(item.classificationId === vm.classificationActivityId && item.administrativeUnitId === vm.report.administrativeUnitId){
                return true;
            }
            return false;
        }

        function filterSubActivity(item){
            if(item.classificationId === vm.classificationSubactivityId && item.activityFatherId === vm.report.activityId){
                return true;
            }
            return false;
        }

        //Maps configuration
        vm.kmlURL = "/content/images/trazado.kml";
        vm.kmlData = '';
        vm.parserMap = null;

        $http({
            method: 'GET',
            url: vm.kmlURL
        }).then(function successCallback(response) {
            vm.kmlData = response.data;
            NgMap.getMap().then(function(map) {
                vm.map = map;
                var myParser = new geoXML3.parser({ map: vm.map });
                myParser.parseKmlString(vm.kmlData);
                vm.parserMap = myParser;
                changeVisitSite();
            });
        }, function errorCallback(response) {
            console.log('Error');
        });

        function moveMapGeoId(geoId){
            if(vm.parserMap && vm.parserMap.docs && vm.parserMap.docs.length > 0 && vm.parserMap.docs[0]){
                var placemarks = vm.parserMap.docs[0].placemarks;
                for(var index in placemarks){
                    if (placemarks[index] && placemarks[index].description) {
                        var geoIdKml = getGeoid(placemarks[index]);

                        if(geoId && geoId == geoIdKml){
                            if(vm.map && placemarks[index].polygon){
                                var polygon = new google.maps.Polygon(placemarks[index].polygon);
                                var polygonBounds = polygon.getPath().getArray();
                                var firstPoint = polygonBounds[0];

                                vm.map.setCenter(new google.maps.LatLng(firstPoint.lat(), firstPoint.lng()));
                                vm.map.setZoom(16);
                                vm.pos = {
                                    lat: firstPoint.lat(),
                                    lng: firstPoint.lng()
                                }
                            }
                            break;
                        }
                    }
                }
            }
        }

        function changeVisitSite() {
            if(vm.report.visitSiteId === vm.visitSiteStationId){
                changeStation();
            }
            if(vm.report.visitSiteId === vm.visitSiteTunnelSectionId){
                changeStretchTunnel();
            }
        }

        function changeStation() {
            if(vm.report.stationId !== null){
                for(var index in vm.differentSites){
                    if(vm.differentSites[index] && vm.differentSites[index].id === vm.report.stationId){
                        moveMapGeoId(vm.differentSites[index].geoid);
                        break;
                    }
                }
            }
        }

        function changeStretchTunnel() {
            if(vm.report.stretchTunnelId !== null && vm.report.specialSiteId === null){
                for(var index in vm.differentSites){
                    if(vm.differentSites[index] && vm.differentSites[index].id === vm.report.stretchTunnelId){
                        moveMapGeoId(vm.differentSites[index].geoid);
                        break;
                    }
                }
            }else{
                if(vm.report.specialSiteId !== null){
                    changeSpecialSite();
                }
            }
        }

        function changeSpecialSite() {
            if(vm.report.specialSiteId !== null){
                for(var index in vm.differentSites){
                    if(vm.differentSites[index] && vm.differentSites[index].id === vm.report.specialSiteId){
                        moveMapGeoId(vm.differentSites[index].geoid);
                        break;
                    }
                }
            }else{
                changeStretchTunnel();
            }
        }

        function getGeoid(placemarks) {
            var xmlString = placemarks.description;
            var parser = new DOMParser();
            var document = parser.parseFromString(xmlString, "text/html");
            var tdElements = document.getElementsByTagName("td");
            for(var jindex in tdElements){
                if(tdElements[jindex] && tdElements[jindex].innerText === 'GeoId'){
                    return tdElements[Number(jindex) + 1].innerText;
                }
            }
        }
    }
})();
