(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('VisitReportController', VisitReportController);

    VisitReportController.$inject = ['$scope', '$state', 'User', 'Activity', 'AdministrativeUnit', 'nomenclatorsConstants', 'Site', 'VisitSiteNom'];

    function VisitReportController($scope, $state, User, Activity, AdministrativeUnit, nomenclatorsConstants, Site, VisitSiteNom) {
        var vm = this;

        //Nomenclators
        vm.activities = Activity.getAll();
        vm.adminUnitGIFId = nomenclatorsConstants.adminUnitGIFId;
        vm.adminUnitEEIId = nomenclatorsConstants.adminUnitEEIId;
        vm.visitsitenoms = VisitSiteNom.query();
        vm.differentSites = Site.getAll();
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

        //initial methods
        initializeVariables();

        //variables
        vm.dateformat = 'dd/MM/yyyy';
        vm.defaultOption = '<Seleccione>';
        vm.patternWords = '^[a-zA-Zá-úÁ-Ú \\s]+$';
        vm.rolFuncionarioId = nomenclatorsConstants.rolFuncionarioId;

        //Activity Classification
        vm.classificationActivityId = nomenclatorsConstants.classificationActivityId;
        vm.classificationSubactivityId = nomenclatorsConstants.classificationSubactivityId;

        //Visit Site nomenclators
        vm.visitSiteStationId = nomenclatorsConstants.visitSiteStationId;
        vm.visitSiteTunnelSectionId = nomenclatorsConstants.visitSiteTunnelSectionId;
        vm.visitSiteSpecialSite = nomenclatorsConstants.visitSiteSpecialSite;

        //functions
        vm.clear = clear;
        vm.cancel = cancel;
        vm.generateReport = generateReport;
        vm.filterUserAdministrativeUnit = filterUserAdministrativeUnit;
        vm.filterActivityByAdminUnit = filterActivityByAdminUnit;
        vm.filterSubActivity = filterSubActivity;
        vm.filterStation = filterStation;
        vm.filterBetweenTunnel = filterBetweenTunnel;
        vm.filterSpecialSite = filterSpecialSite;

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
            vm.functionary = '';
            vm.activityId = '';
            vm.subactivityId = '';
            vm.visitSiteId = '';
            vm.stationId = '';
            vm.stretchTunnelId = '';
            vm.specialSiteId = '';
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
                reportUrl: 'api/report/visit-report',
                pdfUrl: 'api/report/visit-report',
                xlsUrl: null,
                moduleuiref: 'incidences',
                backuiref: 'visit-report',
                reportParams: {
                    fromDate: vm.fromDate,
                    toDate: vm.toDate,
                    administrativeUnitId: vm.administrativeUnitId === null ? '' : vm.administrativeUnitId,
                    functionary: vm.functionary === null ? '' : vm.functionary,
                    activityId: vm.activityId === null ? '' : vm.activityId,
                    subactivityId: vm.subactivityId === null ? '' : vm.subactivityId,
                    visitSiteId: vm.visitSiteId === null ? '' : vm.visitSiteId,
                    stationId: vm.stationId === null ? '' : vm.stationId,
                    stretchTunnelId: vm.stretchTunnelId === null ? '' : vm.stretchTunnelId,
                    specialSiteId: vm.specialSiteId === null ? '' : vm.specialSiteId
                }
            });
        }

        function filterUserAdministrativeUnit(item) {
            if(vm.administrativeUnitId === '' || vm.administrativeUnitId === null || vm.administrativeUnitId === undefined){
                if(item.adminUnitId === vm.adminUnitGIFId || item.adminUnitId === vm.adminUnitEEIId){
                    return userRolFuncionario(item);
                }
            }else{
                if(item.adminUnitId === vm.administrativeUnitId){
                    return userRolFuncionario(item);
                }
            }
            return false;
        }

        function userRolFuncionario(user){
            for(var index in user.roles){
                if(user.roles[index].id === vm.rolFuncionarioId){
                    return true;
                }
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
    }
})();
