
(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('PoaMonthlyUpdateController', PoaMonthlyUpdateController);

    PoaMonthlyUpdateController.$inject = ['$scope', '$state', 'Poa', 'AlertService', 'User', 'AdministrativeUnit', 'ActivityPoa', 'ParseLinks',
    'pagingParams', 'paginationConstants'];

    function PoaMonthlyUpdateController ($scope, $state, Poa, AlertService, User, AdministrativeUnit, ActivityPoa, ParseLinks,
                                         pagingParams, paginationConstants) {
        var vm = this;

        vm.loadPage = loadPage;
        vm.predicate = pagingParams.predicate;
        vm.reverse = pagingParams.ascending;
        vm.transition = transition;
        vm.itemsPerPage = paginationConstants.itemsPerPage;
        vm.openCalendar = openCalendar;
        vm.datePickerOpenStatus = {};
        vm.datePickerOpenStatus.month = false;
        vm.searchByFilters = searchByFilters;
        vm.clear = clear;
        vm.cancel = cancel;
        vm.idAdministrativeUnitDPGI = 8;
        vm.administrativeUnitList = [];
        vm.resultList = [];

        initializeVariables(false);
        initData();

        function initializeVariables(clean) {
            if(clean){
                vm.month = '';
                vm.administrativeUnit = '';
            }else{
                vm.month = pagingParams.search.month;
                vm.administrativeUnit = pagingParams.search.administrativeUnit;
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

            if(vm.showAddButton === false){
                adminUnitSearch = vm.administrativeUnitList[0].id;
            }

            ActivityPoa.activityForUpdates({
                page: pagingParams.page - 1,
                size: vm.itemsPerPage,
                sort: 'id,asc',
                date: vm.month,
                administrativeUnit: adminUnitSearch
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
                vm.resultList = data;
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
                date: vm.month,
                administrativeUnit: vm.administrativeUnit
            });
        }

        function openCalendar(date) {
            vm.datePickerOpenStatus[date] = true;
        }

        vm.monthOption = {
            minMode: 'month',
            minDate: new Date(2017,0,1)
        };

        $scope.$watch('vm.month', updateAsync);
        function updateAsync() {
            vm.monthOption = {
                minMode: 'month',
                minDate: new Date(2017,0,1),
                maxDate: new Date(new Date().getFullYear(),11,31)
            };

            $scope.$evalAsync();
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
    }
})();
