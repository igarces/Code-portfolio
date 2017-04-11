(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('ReportDetailController', ReportDetailController);

    ReportDetailController.$inject = ['$scope', '$rootScope', 'entity', 'Report', 'IncidenceTechnical', 'AttachedDocument',
                                    'User', 'Site', '$state', 'nomenclatorsConstants', 'DataUtils', 'IncidenceStateNom',
                                    'Principal', '$http', 'NgMap'];

    function ReportDetailController($scope, $rootScope, entity, Report, IncidenceTechnical, AttachedDocument,
                                    User, Site, $state, nomenclatorsConstants, DataUtils, IncidenceStateNom,
                                    Principal, $http, NgMap) {
        var vm = this;

        vm.report = entity;

        var unsubscribe = $rootScope.$on('metroquitoApp:reportUpdate', function(event, result) {
            vm.report = result;
        });
        $scope.$on('$destroy', unsubscribe);

        vm.incidencestatenoms = IncidenceStateNom.query();

        //variables
        vm.byteSize = DataUtils.byteSize;
        vm.openFile = DataUtils.openFile;
        vm.dateformat = 'dd/MM/yyyy';
        vm.hourformat = 'H:mm';
        vm.attacheddocuments = [];
        vm.incidenceTechnicals = [];
        vm.defaultLatitude = -0.1936;
        vm.defaultLongitude = -78.4899;
        getMapCoordinates();

        //Visit Site Nom
        vm.visitSiteStationId = nomenclatorsConstants.visitSiteStationId;
        vm.visitSiteTunnelSectionId = nomenclatorsConstants.visitSiteTunnelSectionId;

        //functions
        initListIncidence();
        getSiteObject();
        searchPhotos();
        getUserLogged();
        vm.detailIncidenceTechnical = detailIncidenceTechnical;
        vm.back = back;
        vm.exportReport = exportReport;
        vm.getIncidenceState = getIncidenceState;

        function initListIncidence() {
            if(vm.report.id !== null && vm.report.hasIncidences){
                IncidenceTechnical.query({
                    sort: 'id,desc',
                    reportId: ''+ vm.report.id +'',
                    incidenceNumber: '',
                    fromDate: '',
                    toDate: '',
                    state: '',
                    responsible: '',
                    administrativeUnitId: ''
                }, onSuccess, onError);

                function onSuccess(data) {
                    vm.incidenceTechnicals = data;
                }
                function onError() {
                    console.log("error");
                }
            }
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

        function detailIncidenceTechnical (incidence) {
            $state.go('incidence-technical-detail', {id: incidence.id, reportId: vm.report.id, action: 'view'}, {reload: true});
        }

        function exportReport() {
            Report.export({reportId: vm.report.id, userName: vm.userLoggedName}, function (data) {
                var url = window.URL.createObjectURL(data.response);
                window.open(url, '_blank');
            });
        }

        function back() {
            $state.go('report', null, {reload: true});
        }

        function getSiteObject(){
            if(vm.report.visitSiteId === vm.visitSiteStationId && vm.report.stationId !== null){
                Site.get({id: vm.report.stationId}, function (station) {
                   vm.station = station;
                    if(vm.map){
                        moveMap();
                    }
                });
            }

            if(vm.report.visitSiteId === vm.visitSiteTunnelSectionId){
                if(vm.report.stretchTunnelId !== null){
                    Site.get({id: vm.report.stretchTunnelId}, function (stretchTunnel) {
                        vm.stretchTunnel = stretchTunnel;
                        if(vm.map){
                            moveMap();
                        }
                    });
                }
                if(vm.report.specialSiteId !== null){
                    Site.get({id: vm.report.specialSiteId}, function (specialSite) {
                        vm.specialSite = specialSite;
                        if(vm.map){
                            moveMap();
                        }
                    });
                }
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

        function getUserLogged() {
            Principal.identity().then(function (account) {
                User.get({login: account.login}, function (result) {
                    vm.userLoggedName = result.firstName + ' ' + result.lastName;
                });
            });
        }

        //Mapas configuration
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

                moveMap();
            });
        }, function errorCallback(response) {
            console.log('Error');
        });

        function moveMap() {
            if(vm.station !== undefined && vm.station !== null){
                moveMapGeoId(vm.station.geoid);
            }else if(vm.stretchTunnel !== undefined && vm.stretchTunnel !== null ){
                if(vm.specialSite !== undefined && vm.specialSite !== null ){
                    moveMapGeoId(vm.specialSite.geoid);
                }else{
                    moveMapGeoId(vm.stretchTunnel.geoid);
                }
            }
        }

        function getMapCoordinates(){
            vm.mapLatitude = vm.defaultLatitude;
            vm.mapLongitude = vm.defaultLongitude;
        }

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
                                };
                            }
                            break;
                        }
                    }
                }
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
