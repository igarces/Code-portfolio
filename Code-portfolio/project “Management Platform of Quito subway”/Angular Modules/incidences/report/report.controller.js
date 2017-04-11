(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('ReportController', ReportController);

    ReportController.$inject = ['$scope', '$state', 'Report', 'ParseLinks', 'AlertService', 'pagingParams', 'paginationConstants',
        'Activity', 'nomenclatorsConstants', 'VisitSiteNom', 'Site', 'AdministrativeUnit', 'User'];

    function ReportController ($scope, $state, Report, ParseLinks, AlertService, pagingParams, paginationConstants,
                               Activity, nomenclatorsConstants, VisitSiteNom, Site, AdministrativeUnit, User) {
        var vm = this;

        vm.loadPage = loadPage;
        vm.predicate = pagingParams.predicate;
        vm.reverse = pagingParams.ascending;
        vm.transition = transition;
        vm.itemsPerPage = paginationConstants.itemsPerPage;

        //nomenclators
        vm.activities = Activity.search();
        vm.visitsitenoms = VisitSiteNom.query();
        vm.differentSites = Site.getAll();
        vm.adminUnitGIFId = nomenclatorsConstants.adminUnitGIFId;
        vm.adminUnitEEIId = nomenclatorsConstants.adminUnitEEIId;
        //Roles
        vm.rolFuncionarioId = nomenclatorsConstants.rolFuncionarioId;
        vm.adminUserLogin = nomenclatorsConstants.adminUserLogin;

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
            vm.users = [];

            for(var index in users){
                if(users[index] && users[index].login !==  vm.adminUserLogin){
                    var user = users[index];

                    for(var index in user.roles){
                        if(user.roles[index].id === vm.rolFuncionarioId){
                            vm.users.push(user);
                            break;
                        }
                    }
                }
            }
        });

        //variables
        vm.patternWords = '^[a-zA-Zá-úÁ-Ú \\s]+$';
        vm.patternReportNumber = '^[a-z A-Z 0-9 \-]+$';
        vm.dateformat = 'dd/MM/yyyy';
        vm.defaultOption = '<Seleccione>';
        vm.visitSiteStationId = nomenclatorsConstants.visitSiteStationId;
        vm.visitSiteTunnelSectionId = nomenclatorsConstants.visitSiteTunnelSectionId;
        vm.visitSiteSpecialSite = nomenclatorsConstants.visitSiteSpecialSite;

        //Activity Classification
        vm.classificationActivityId = nomenclatorsConstants.classificationActivityId;
        vm.classificationSubactivityId = nomenclatorsConstants.classificationSubactivityId;

        //functions
        initializeVariables(false);
        vm.searchByFilters = searchByFilters;
        vm.clear = clear;
        vm.cancel = cancel;
        vm.filterActivity = filterActivity;
        vm.filterSubActivity = filterSubActivity;
        vm.filterStation = filterStation;
        vm.filterBetweenTunnel = filterBetweenTunnel;
        vm.filterSpecialSite = filterSpecialSite;
        vm.filterUserAdministrativeUnit = filterUserAdministrativeUnit;

        loadAll();

        function loadAll () {
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

            Report.query({
                page: pagingParams.page - 1,
                size: vm.itemsPerPage,
                sort: sort(),
                reportNumber: vm.reportNumber,
                fromDate: vm.fromDate,
                toDate: vm.toDate,
                activity: vm.activityId === null ? '' : vm.activityId,
                subactivity: vm.subactivityId === null ? '' : vm.subactivityId,
                responsible: vm.responsible === null ? '' : vm.responsible,
                visitSiteId: vm.visitSiteId === null ? '' : vm.visitSiteId,
                stationId: vm.stationId === null ? '' : vm.stationId,
                stretchTunnelId: vm.stretchTunnelId === null ? '' : vm.stretchTunnelId,
                specialSiteId: vm.specialSiteId === null ? '' : vm.specialSiteId,
                administrativeUnitId: vm.administrativeUnitId === null ? '' : vm.administrativeUnitId
            }, onSuccess, onError);
            function sort() {
                var result = [vm.predicate + ',' + (vm.reverse ? 'asc' : 'desc')];
                if (vm.predicate !== 'id') {
                    result.push('id');
                }
                return result;
            }
            function onSuccess(data, headers) {
                vm.links = ParseLinks.parse(headers('link'));
                vm.totalItems = headers('X-Total-Count');
                vm.queryCount = vm.totalItems;
                vm.reports = data;
                vm.page = pagingParams.page;
            }
            function onError(error) {
                AlertService.error(error.data.message);
            }
        }

        function loadPage (page) {
            vm.page = page;
            vm.transition();
        }

        function transition () {
            $state.transitionTo($state.$current, {
                page: vm.page,
                sort: vm.predicate + ',' + (vm.reverse ? 'asc' : 'desc'),
                search: vm.currentSearch,
                reportNumber: vm.reportNumber,
                fromDate: vm.fromDate,
                toDate: vm.toDate,
                activity: vm.activityId,
                subactivity: vm.subactivityId,
                responsible: vm.responsible,
                visitSiteId: vm.visitSiteId,
                stationId: vm.stationId,
                stretchTunnelId: vm.stretchTunnelId,
                specialSiteId: vm.specialSiteId,
                administrativeUnitId: vm.administrativeUnitId
            });
        }

        function initializeVariables(clean) {
            if(clean){
                vm.reportNumber = '';
                vm.fromDate = '';
                vm.toDate = '';
                vm.activityId = '';
                vm.subactivityId = '';
                vm.responsible = '';
                vm.visitSiteId = '';
                vm.stationId = '';
                vm.stretchTunnelId = '';
                vm.specialSiteId = '';
                vm.administrativeUnitId = '';
            }else{
                vm.reportNumber = pagingParams.search.reportNumber;
                vm.fromDate = pagingParams.search.fromDate;
                vm.toDate = pagingParams.search.toDate;
                vm.activityId = pagingParams.search.activity;
                vm.subactivityId = pagingParams.search.subactivity;
                vm.responsible = pagingParams.search.responsible;
                vm.visitSiteId = pagingParams.search.visitSiteId;
                vm.stationId = pagingParams.search.stationId;
                vm.stretchTunnelId = pagingParams.search.stretchTunnelId;
                vm.specialSiteId = pagingParams.search.specialSiteId;
                vm.administrativeUnitId = pagingParams.search.administrativeUnitId;
            }
        }

        function searchByFilters() {
            pagingParams.page = 1;
            transition();
        }

        function clear() {
            initializeVariables(true);
            vm.page = 1;
            transition();
        }

        function cancel() {
            $state.go('incidences', null, {reload: true});
        }

        //date configurations
        vm.openCalendar = openCalendar;
        vm.datePickerOpenStatus = {};
        vm.datePickerOpenStatus.fromDate = false;
        vm.datePickerOpenStatus.toDate = false;

        function openCalendar(date) {
            vm.datePickerOpenStatus[date] = true;
        }

        vm.fromDateOption = {
            // minDate: IncidenceSocialResp.initSystemDate,
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
                // minDate: IncidenceSocialResp.initSystemDate,
                maxDate: (vm.toDate !== '') ? vm.toDate : new Date()
            };

            vm.toDateOption = {
                minDate: vm.fromDate,
                maxDate: new Date()
            };
            $scope.$evalAsync();
        }
        //end date configurations

        function filterActivity(item) {
            if(item.classificationId === vm.classificationActivityId){
                return true;
            }
            return false;
        }

        function filterSubActivity(item){
            if(vm.activityId !== null && vm.activityId !== ''){
                if(item.classificationId === vm.classificationSubactivityId && item.activityFatherId === vm.activityId){
                    return true;
                }
            }else{
                if(item.classificationId === vm.classificationSubactivityId){
                    return true;
                }
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

        function filterUserAdministrativeUnit(item) {
            if(vm.administrativeUnitId === '' || vm.administrativeUnitId === null || vm.administrativeUnitId === undefined){
                return true;
            }else{
                if(item.adminUnitId === vm.administrativeUnitId){
                    return true;
                }
            }
            return false;
        }
    }
})();
