(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('ProductAUController', ProductAUController);

    ProductAUController.$inject = ['$scope', '$state', 'ProductAU', 'ParseLinks', 'AlertService', 'pagingParams', 'paginationConstants',
                                'AdministrativeUnit', 'Principal', 'User', 'nomenclatorsConstants'];

    function ProductAUController ($scope, $state, ProductAU, ParseLinks, AlertService, pagingParams, paginationConstants,
                                  AdministrativeUnit, Principal, User, nomenclatorsConstants) {
        var vm = this;

        vm.loadPage = loadPage;
        vm.predicate = pagingParams.predicate;
        vm.reverse = pagingParams.ascending;
        vm.transition = transition;
        vm.itemsPerPage = paginationConstants.itemsPerPage;
        vm.idAdministrativeUnitDPGI = nomenclatorsConstants.adminUnitDPGIId;
        vm.patternLettersNumbers = '^[a-zA-Zá-úÁ-Ú0-9 \\s]+$';
        vm.administrativeUnitList = [];
        vm.openCalendar = openCalendar;
        vm.datePickerOpenStatus = {};
        vm.datePickerOpenStatus.year = false;
        vm.searchByFilters = searchByFilters;
        vm.clear = clear;
        vm.cancel = cancel;
        vm.showAddButton = false;
        vm.poaStateActivedId = nomenclatorsConstants.poaStateActivedId;
        vm.poaStateReformedId = nomenclatorsConstants.poaStateReformedId;

        initializeVariables(false);
        initData();

        function initializeVariables(clean) {
            if(clean){
                vm.product = '';
                vm.administrativeUnit = '';
                vm.year = '';
            }else{
                vm.product = pagingParams.search.product;
                vm.administrativeUnit = pagingParams.search.administrativeUnit;
                vm.year = pagingParams.search.year;
            }
        }

        function initData() {
            User.getLoggedUser(function (userLogged) {
                if(userLogged.administrativeUnitId === vm.idAdministrativeUnitDPGI){
                    vm.showAddButton = true;
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

            ProductAU.search({
                page: pagingParams.page - 1,
                size: vm.itemsPerPage,
                productId: '',
                product: vm.product,
                year: vm.year !== undefined && vm.year !== '' && vm.year !== null ? vm.year.getFullYear() : '' ,
                administrativeUnit: adminUnitSearch,
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
                vm.productAUS = data;
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
                administrativeUnit: vm.administrativeUnit,
                product: vm.product,
                year: vm.year
            });
        }

        function openCalendar(date) {
            vm.datePickerOpenStatus[date] = true;
        }

        vm.yearOption = {
            minMode: 'year',
            minDate: new Date(2017,0,1)
        };

        $scope.$watch('vm.year', updateAsync);
        function updateAsync() {
            vm.yearOption = {
                minMode: 'year',
                minDate: new Date(2017,0,1)
            };

            $scope.$evalAsync();
        }

        function searchByFilters() {
            pagingParams.page = 1;
            vm.page = 1;
            transition();
        }

        function cancel(){
            $state.go('monitoring-configuration', null, {reload: true});
        }

        function clear(){
            initializeVariables(true);
           vm.page = 1;
           transition ();
        }
    }
})();
