(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('IncidenceTechnicalController', IncidenceTechnicalController);

    IncidenceTechnicalController.$inject = ['$scope', '$state', 'DataUtils', 'IncidenceTechnical', 'ParseLinks', 'AlertService',
        'pagingParams', 'paginationConstants', 'IncidenceStateNom', 'Principal', 'User', 'nomenclatorsConstants', 'AdministrativeUnit'];

    function IncidenceTechnicalController ($scope, $state, DataUtils, IncidenceTechnical, ParseLinks, AlertService,
         pagingParams, paginationConstants, IncidenceStateNom, Principal, User, nomenclatorsConstants, AdministrativeUnit) {

        var vm = this;

        vm.loadPage = loadPage;
        vm.predicate = pagingParams.predicate;
        vm.reverse = pagingParams.ascending;
        vm.transition = transition;
        vm.itemsPerPage = paginationConstants.itemsPerPage;
        vm.openFile = DataUtils.openFile;
        vm.byteSize = DataUtils.byteSize;
        vm.states = IncidenceStateNom.query();
        //vm.users = User.query();

        vm.patternWords = '^[a-zA-Zá-úÁ-Ú \\s]+$';
        vm.patternNumbers = '^[0-9]+$';
        vm.dateformat = 'dd/MM/yyyy';
        vm.showCompleteIncidences = true;
        vm.userLogged = null;
        vm.defaultOption = '<Seleccione>';

        //Incidence State Nom
        vm.incidenceStateOpenId = nomenclatorsConstants.incidenceStateOpenId;
        vm.incidenceStateAssignedId = nomenclatorsConstants.incidenceStateAssignedId;
        vm.incidenceStateProcessingId = nomenclatorsConstants.incidenceStateProcessingId;
        vm.incidenceStateCloseId = nomenclatorsConstants.incidenceStateCloseId;

        vm.searchByFilters = searchByFilters;
        vm.showAssignOption = showAssignOption;
        vm.getIncidenceState = getIncidenceState;
        vm.clear = clear;
        vm.cancel = cancel;
        vm.filterStateIncidenceTechnical = filterStateIncidenceTechnical;
        vm.filterUserAdministrativeUnit = filterUserAdministrativeUnit;

        //initial methods
        getUserLogged();
        initSearch(false);

        //date configurations
        vm.openCalendar = openCalendar;
        vm.datePickerOpenStatus = {};
        vm.datePickerOpenStatus.fromDate = false;
        vm.datePickerOpenStatus.toDate = false;

        function openCalendar(date) {
            vm.datePickerOpenStatus[date] = true;
        }

        vm.fromDateOption = {
            maxDate: vm.toDate
        };

        vm.toDateOption = {
            minDate: vm.fromDate,
            maxDate: new Date()
        };

        $scope.$watch('vm.toDate', updateAsync);
        $scope.$watch('vm.fromDate', updateAsync);

        function updateAsync(){
            vm.fromDateOption = {
                maxDate: vm.toDate
            };

            vm.toDateOption = {
                minDate: vm.fromDate,
                maxDate: new Date()
            };
            $scope.$evalAsync();
        }
        //end date configurations

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

        function initSearch(clean) {
            if(clean){
                vm.incidenceNumber = '';
                vm.fromDate = '';
                vm.toDate = '';
                vm.incidenceStateId = '';
                vm.responsible = '';
                vm.administrativeUnitId = '';
            }else{
                vm.incidenceNumber = pagingParams.search.incidenceNumber;
                vm.fromDate = pagingParams.search.fromDate;
                vm.toDate = pagingParams.search.toDate;
                vm.incidenceStateId = pagingParams.search.state;
                vm.responsible = pagingParams.search.responsible;
                vm.administrativeUnitId = pagingParams.search.administrativeUnitId;
            }
        }

        function searchByFilters() {
            pagingParams.page = 1;
            transition();
        }

        loadAll();

        function clear() {
            initSearch(true);
            vm.page = 1;
            transition();
        }
        function cancel() {
            $state.go('incidences', null, {reload: true});
        }

        function loadAll () {

            IncidenceTechnical.query({
                page: pagingParams.page - 1,
                size: vm.itemsPerPage,
                sort: sort(),
                reportId: '',
                incidenceNumber: vm.incidenceNumber,
                fromDate: vm.fromDate,
                toDate: vm.toDate,
                state: vm.incidenceStateId === null ? '' : vm.incidenceStateId,
                responsible: vm.responsible,
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
                vm.incidenceTechnicals = data;
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
                incidenceNumber: vm.incidenceNumber,
                fromDate: vm.fromDate,
                toDate: vm.toDate,
                state: vm.incidenceStateId,
                responsible: vm.responsible,
                administrativeUnitId: vm.administrativeUnitId
            });
        }

        function getUserLogged() {
            Principal.identity().then(function (account) {
                User.get({login: account.login}, function (result) {
                    vm.userLogged = result;
                });
            });
        }

        function showAssignOption(incidenceTechnical) {
            if(vm.userLogged && vm.userLogged.responsible && vm.userLogged.adminUnitId === incidenceTechnical.administrativeUnitResponsibleId
                && (incidenceTechnical.incidenceStateId === vm.incidenceStateAssignedId || incidenceTechnical.incidenceStateId === vm.incidenceStateProcessingId)){

                return true;
            }
            return false;
        }

        function getFunctionary(userId) {
            for(var index in vm.users){
                if(vm.users[index] && vm.users[index].id === userId){
                    return vm.users[index];
                }
            }
        }

        function getIncidenceState(incidenceStateId) {
            if(incidenceStateId !== null){
                for(var index in vm.states){
                    if(vm.states[index].id === incidenceStateId){
                        return vm.states[index].value;
                    }
                }
            }
            return '';
        }

        function filterStateIncidenceTechnical(item) {
            if(item.id === vm.incidenceStateOpenId || item.id === vm.incidenceStateAssignedId ||
                item.id === vm.incidenceStateProcessingId || item.id === vm.incidenceStateCloseId){
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
