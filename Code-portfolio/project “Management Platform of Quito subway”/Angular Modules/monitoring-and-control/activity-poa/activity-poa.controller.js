(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('ActivityPoaController', ActivityPoaController);

    ActivityPoaController.$inject = ['$scope', '$state', 'ActivityPoa', 'ParseLinks', 'AlertService', 'pagingParams', 'paginationConstants', 'User',
                                    'AdministrativeUnit', 'nomenclatorsConstants', 'AdminUnitDirection'];

    function ActivityPoaController ($scope, $state, ActivityPoa, ParseLinks, AlertService, pagingParams, paginationConstants, User,
                                    AdministrativeUnit, nomenclatorsConstants, AdminUnitDirection) {
        var vm = this;

        vm.directions = AdminUnitDirection.query();
        vm.loadPage = loadPage;
        vm.predicate = pagingParams.predicate;
        vm.reverse = pagingParams.ascending;
        vm.transition = transition;
        vm.itemsPerPage = paginationConstants.itemsPerPage;
        vm.dateformat = 'dd/MM/yyyy';
        vm.idAdministrativeUnitDPGI = nomenclatorsConstants.adminUnitDPGIId;
        vm.adminUnitGRSAId = nomenclatorsConstants.adminUnitGRSAId;
        vm.poaStateActivedId = nomenclatorsConstants.poaStateActivedId;
        vm.poaStateReformedId = nomenclatorsConstants.poaStateReformedId;
        vm.poaStateClosedId = nomenclatorsConstants.poaStateClosedId;
        vm.administrativeUnitList = [];
        vm.searchByFilters = searchByFilters;
        vm.clear = clear;
        vm.cancel = cancel;
        vm.onlyOneAdminUnit = false;

        initializeVariables(false);
        initData();

        function initializeVariables(clean) {
            if(clean){
                vm.description = '';
                vm.fromDate = '';
                vm.toDate = '';
                vm.responsible = '';
                vm.administrativeUnit = '';
                vm.adminUnitDirection = '';
            }else{
                vm.description = pagingParams.search.description;
                vm.fromDate = pagingParams.search.fromDate;
                vm.toDate = pagingParams.search.toDate;
                vm.responsible = pagingParams.search.responsible;
                vm.administrativeUnit = pagingParams.search.administrativeUnit;
                vm.adminUnitDirection = pagingParams.search.adminUnitDirection;
            }
        }


        function initData() {
            User.getLoggedUser(function (userLogged) {
                if(userLogged.administrativeUnitId === vm.idAdministrativeUnitDPGI){
                    loadAll();
                    vm.administrativeUnitList = AdministrativeUnit.search({'name': '', 'acronym':''});
                }else{
                    AdministrativeUnit.get({'id': userLogged.administrativeUnitId}, function (adminUnit) {
                        vm.administrativeUnitList.push(adminUnit);
                        vm.onlyOneAdminUnit = true;
                        loadAll();
                    });
                }
            });
        }

        function loadAll () {
            var adminUnitSearch = vm.administrativeUnit;
            if(vm.administrativeUnit === null || vm.administrativeUnit === undefined){
                adminUnitSearch = '';
            }

            if(vm.onlyOneAdminUnit){
                adminUnitSearch = vm.administrativeUnitList[0].id;
            }

            if(adminUnitSearch !== vm.adminUnitGRSAId || vm.adminUnitDirection === null || vm.adminUnitDirection === undefined){
                vm.adminUnitDirection = '';
            }

            ActivityPoa.search({
                page: pagingParams.page - 1,
                size: vm.itemsPerPage,
                description: vm.description,
                fromDate: vm.fromDate,
                toDate: vm.toDate,
                responsible: vm.responsible,
                administrativeUnit: adminUnitSearch,
                productId: null,
                adminUnitDirection: vm.adminUnitDirection,
                sort: sort()
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
                vm.activityPoas = data;
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
                description: vm.description,
                fromDate: vm.fromDate,
                toDate: vm.toDate,
                responsible: vm.responsible,
                administrativeUnit: vm.administrativeUnit,
                adminUnitDirection: vm.adminUnitDirection
            });
        }

        function searchByFilters() {
            pagingParams.page = 1;
            vm.page = 1;
            transition();
        }

        function cancel(){
            $state.go('operating-plan', null, {reload: true});
        }

        function clear(){
            initializeVariables(true);
            vm.page = 1;
            transition();
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
            maxDate: vm.toDate
        };

        vm.toDateOption = {
            minDate: vm.fromDate
        };

        $scope.$watch('vm.toDate', updateAsync);
        $scope.$watch('vm.fromDate', updateAsync);

        function updateAsync(){
            vm.fromDateOption = {
                maxDate: vm.toDate
            };

            vm.toDateOption = {
                minDate: vm.fromDate
            };
            $scope.$evalAsync();
        }
        //end date configurations

    }
})();
