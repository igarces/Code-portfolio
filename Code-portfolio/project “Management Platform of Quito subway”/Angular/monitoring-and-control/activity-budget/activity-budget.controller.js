(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('ActivityBudgetController', ActivityBudgetController);

    ActivityBudgetController.$inject = ['$scope', '$state', 'ActivityBudget', 'ParseLinks', 'AlertService', 'pagingParams', 'paginationConstants',
                                    'AdministrativeUnit', 'ProductAU', 'nomenclatorsConstants'];

    function ActivityBudgetController ($scope, $state, ActivityBudget, ParseLinks, AlertService, pagingParams, paginationConstants,
                                       AdministrativeUnit, ProductAU, nomenclatorsConstants) {
        var vm = this;

        vm.loadPage = loadPage;
        vm.predicate = pagingParams.predicate;
        vm.reverse = pagingParams.ascending;
        vm.transition = transition;
        vm.itemsPerPage = paginationConstants.itemsPerPage;
        vm.administrativeUnitList = AdministrativeUnit.search({'name': '', 'acronym':''});
        vm.productList = [];
        vm.productBudgetsList = [];
        vm.productFilter = productFilter;
        vm.cancel = cancel;
        vm.clear = clear;
        vm.searchByFilters = searchByFilters;
        vm.poaStateRevisedId = nomenclatorsConstants.poaStateRevisedId;

        initializeVariables(false);
        initData();
        loadAll();

        function initializeVariables(clean) {
            if(clean){
                vm.administrativeUnitId = '';
                vm.productId = '';
            }else{
                vm.administrativeUnitId = pagingParams.search.administrativeUnit;
                vm.productId = pagingParams.search.product;
            }
        }

        function initData(){
            ProductAU.search(
                {
                    page: 0,
                    size: 10000,
                    productId: '',
                    product: '',
                    year: '' ,
                    administrativeUnit: '',
                    sort: 'product,asc'
                },
                function (productList) {
                    vm.productList = productList;
                }
            );
        }

        function loadAll () {
            ProductAU.getProductBudget({
                page: pagingParams.page - 1,
                size: vm.itemsPerPage,
                productId: vm.productId === undefined ? '' : vm.productId,
                administrativeUnit: vm.administrativeUnitId === undefined ? '' : vm.administrativeUnitId,
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
                vm.productBudgetsList = data;
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
                product: vm.productId === undefined ? '' : vm.productId,
                administrativeUnit: vm.administrativeUnitId === undefined ? '' : vm.administrativeUnitId
            });
        }

        function productFilter ($item) {
            if(vm.administrativeUnitId === '' || vm.administrativeUnitId === null || vm.administrativeUnitId === undefined){
                return true;
            }else{
                if($item.administrativeUnits.length > 0){

                    for(var index in $item.administrativeUnits){
                        if($item.administrativeUnits[index] && $item.administrativeUnits[index].id === vm.administrativeUnitId){
                            return true;
                        }
                    }
                }
                return false;
            }
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
