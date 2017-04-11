(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('CostCenterController', CostCenterController);

    CostCenterController.$inject = ['$scope', '$state', 'CostCenter', 'ParseLinks', 'AlertService', 'pagingParams', 'paginationConstants', 'descriptionsList'];

    function CostCenterController ($scope, $state, CostCenter, ParseLinks, AlertService, pagingParams, paginationConstants, descriptionsList) {
        var vm = this;

        vm.descriptions = descriptionsList;
        vm.loadPage = loadPage;
        vm.predicate = pagingParams.predicate;
        vm.reverse = pagingParams.ascending;
        vm.transition = transition;
        vm.itemsPerPage = paginationConstants.itemsPerPage;
        vm.patternNumbers = '^[0-9]+$';
        vm.cancel = cancel;
        vm.clear = clear;
        vm.searchByFilters = searchByFilters;

        initializeVariables(false);
        loadAll();

        function initializeVariables(clean) {
            if(clean){
                vm.code = '';
                vm.description = '';
            }else{
                vm.code = pagingParams.search.code;
                vm.description = pagingParams.search.description;
            }
        }

        function loadAll () {
            CostCenter.search({
                page: pagingParams.page - 1,
                size: vm.itemsPerPage,
                code: vm.code,
                description: vm.description === undefined ? '' : vm.description,
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
                vm.costCenters = data;
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
                code: vm.code,
                description: vm.description === undefined ? '' : vm.description
            });
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
            transition();
        }
    }
})();
