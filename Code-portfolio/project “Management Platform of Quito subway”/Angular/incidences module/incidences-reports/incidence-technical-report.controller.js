(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('IncidenceTechnicalReportController', IncidenceTechnicalReportController);

    IncidenceTechnicalReportController.$inject = ['$scope', '$state', 'nomenclatorsConstants', 'User', 'Site', 'Activity',
                                                'AdministrativeUnit', 'IncidenceStateNom', 'VisitSiteNom'];

    function IncidenceTechnicalReportController($scope, $state, nomenclatorsConstants, User, Site, Activity,
                                                AdministrativeUnit, IncidenceStateNom, VisitSiteNom) {
        var vm = this;

        //Nomenclators
        vm.adminUnitGIFId = nomenclatorsConstants.adminUnitGIFId;
        vm.adminUnitEEIId = nomenclatorsConstants.adminUnitEEIId;

        AdministrativeUnit.query({'name': '', 'acronym':''}, function (list) {
            vm.administrativeunits = [];

            for(var index in list){
                if(list[index] && (list[index].id === vm.adminUnitGIFId || list[index].id === vm.adminUnitEEIId)){
                    vm.administrativeunits.push(list[index]);
                }
            }
        });

        User.query({
            page: 0,
            size: 100000,
            sort: 'firstName,asc'
        }, function (users) {
            vm.users = users;
        });

        vm.differentSites = Site.getAll();
        vm.activities = Activity.search();
        vm.visitsitenoms = VisitSiteNom.query();
        vm.states = IncidenceStateNom.query();

        //initial methods
        initializeVariables();

        //variables
        vm.dateformat = 'dd/MM/yyyy';
        vm.defaultOption = '<Seleccione>';
        vm.patternWords = '^[a-zA-Zá-úÁ-Ú \\s]+$';

        //Visit Site Nom
        vm.visitSiteStationId = nomenclatorsConstants.visitSiteStationId;
        vm.visitSiteTunnelSectionId = nomenclatorsConstants.visitSiteTunnelSectionId;
        vm.visitSiteSpecialSite = nomenclatorsConstants.visitSiteSpecialSite;

        //Incidence State Nom
        vm.incidenceStateOpenId = nomenclatorsConstants.incidenceStateOpenId;
        vm.incidenceStateAssignedId = nomenclatorsConstants.incidenceStateAssignedId;
        vm.incidenceStateProcessingId = nomenclatorsConstants.incidenceStateProcessingId;
        vm.incidenceStateCloseId = nomenclatorsConstants.incidenceStateCloseId;

        //Activity Classification
        vm.classificationActivityId = nomenclatorsConstants.classificationActivityId;
        vm.classificationSubactivityId = nomenclatorsConstants.classificationSubactivityId;

        //functions
        vm.clear = clear;
        vm.cancel = cancel;
        vm.generateReport = generateReport;
        vm.filterStation = filterStation;
        vm.filterStateIncidenceTechnical = filterStateIncidenceTechnical;
        vm.filterActivityByAdminUnit = filterActivityByAdminUnit;
        vm.filterSubActivity = filterSubActivity;
        vm.filterBetweenTunnel = filterBetweenTunnel;
        vm.filterSpecialSite = filterSpecialSite;
        vm.filterUserAdministrativeUnit = filterUserAdministrativeUnit;

        //date configurations
        vm.openCalendar = openCalendar;
        vm.datePickerOpenStatus = {};
        vm.datePickerOpenStatus.fromDate = false;
        vm.datePickerOpenStatus.toDate = false;

        function openCalendar(date) {
            vm.datePickerOpenStatus[date] = true;
        }

        vm.fromDateOption = {
            maxDate: (vm.toDate !== '') ? vm.toDate : new Date()
        };

        vm.toDateOption = {
            minDate: vm.fromDate,
            maxDate: new Date()
        };

        $scope.$watch('vm.toDate', updateAsync);
        $scope.$watch('vm.fromDate', updateAsync);

        function updateAsync(){
            vm.fromDateOption = {
                maxDate: (vm.toDate !== '') ? vm.toDate : new Date()
            };

            vm.toDateOption = {
                minDate: vm.fromDate,
                maxDate: new Date()
            };
            $scope.$evalAsync();
        }

        function initializeVariables() {
            vm.fromDate = '';
            vm.toDate = '';
            vm.administrativeUnitId = '';
            vm.responsible = '';
            vm.stationId = '';
            vm.stretchTunnelId = '';
            vm.specialSiteId = '';
            vm.activityId = '';
            vm.subactivityId = '';
            vm.stateId = '';
            vm.visitSiteId = '';
        }

        function clear() {
            initializeVariables();
        }

        function cancel() {
            $state.go('incidences-report', null, {reload: true});
        }

        function generateReport() {
            if(vm.visitSiteId === vm.visitSiteStationId){
                vm.stretchTunnelId = '';
                vm.specialSiteId = '';
            }else if(vm.visitSiteId === vm.visitSiteTunnelSectionId){
                vm.stationId = '';
            }else{
                vm.visitSiteId = '';
                vm.stationId = '';
                vm.stretchTunnelId = '';
                vm.specialSiteId = '';
            }

            $state.go('report-viewer', {
                pdfExport: true,
                xlsExport: false,
                reportUrl: 'api/report/incidence-technical-report',
                pdfUrl: 'api/report/incidence-technical-report',
                xlsUrl: null,
                moduleuiref: 'incidences',
                backuiref: 'incidence-technical-report',
                reportParams: {
                    fromDate: vm.fromDate,
                    toDate: vm.toDate,
                    administrativeUnitId: vm.administrativeUnitId === null ? '' : vm.administrativeUnitId,
                    responsible: vm.responsible,
                    activityId: vm.activityId === null ? '' : vm.activityId,
                    subactivityId: vm.subactivityId === null ? '' : vm.subactivityId,
                    stateId: vm.stateId === null ? '' : vm.stateId,
                    visitSiteId: vm.visitSiteId === null ? '' : vm.visitSiteId,
                    stationId: vm.stationId === null ? '' : vm.stationId,
                    stretchTunnelId: vm.stretchTunnelId === null ? '' : vm.stretchTunnelId,
                    specialSiteId: vm.specialSiteId === null ? '' : vm.specialSiteId
                }
            });
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
            if(item.typeId === vm.visitSiteSpecialSite && item.stretchTunnelId === vm.stretchTunnelId){
                return true;
            }
            return false;
        }

        function filterStateIncidenceTechnical(item) {
            if(item.id === vm.incidenceStateOpenId || item.id === vm.incidenceStateAssignedId ||
                item.id === vm.incidenceStateProcessingId || item.id === vm.incidenceStateCloseId){
                return true;
            }
            return false;
        }

        function filterActivityByAdminUnit(item) {
            if(item.classificationId === vm.classificationActivityId){

                if(vm.administrativeUnitId !== '' && vm.administrativeUnitId !== null && vm.administrativeUnitId !== undefined){
                    if(item.administrativeUnitId === vm.administrativeUnitId){
                        return true;
                    }
                }else{
                    return true;
                }
            }
            return false;
        }

        function filterSubActivity(item){
            if(item.classificationId === vm.classificationSubactivityId && item.activityFatherId === vm.activityId){
                return true;
            }
            return false;
        }

        function filterUserAdministrativeUnit(item) {
            if(vm.administrativeUnitId === '' || vm.administrativeUnitId === null || vm.administrativeUnitId === undefined){
                if(item.adminUnitId === vm.adminUnitGIFId || item.adminUnitId === vm.adminUnitEEIId){
                    return true;
                }
            }else{
                if(item.adminUnitId === vm.administrativeUnitId){
                    return true;
                }
            }
            return false;
        }
    }
})();
