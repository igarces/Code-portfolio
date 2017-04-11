(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('HeadingSubheadingController', HeadingSubheadingController);

    HeadingSubheadingController.$inject = ['$scope', '$state', 'HeadingSubheading', 'ParseLinks', 'AlertService', 'pagingParams', 'paginationConstants'];

    function HeadingSubheadingController ($scope, $state, HeadingSubheading, ParseLinks, AlertService, pagingParams, paginationConstants) {
        var vm = this;

        vm.loadPage = loadPage;
        vm.predicate = pagingParams.predicate;
        vm.reverse = pagingParams.ascending;
        vm.transition = transition;
        vm.itemsPerPage = paginationConstants.itemsPerPage;
        vm.patternNumbers = '^[0-9]+$';
        vm.cancel = cancel;
        vm.clear = clear;
        vm.searchByFilters = searchByFilters;
        vm.headingList = HeadingSubheading.query();
        vm.headingFilter = headingFilter;
        vm.subheadingFilter = subheadingFilter;

        initializeVariables(false);
        loadAll();

        function initializeVariables(clean) {
            if(clean){
                vm.code = '';
                vm.heading = '';
                vm.subheading = '';
            }else{
                vm.code = pagingParams.search.code;
                vm.heading = pagingParams.search.heading;
                vm.subheading = pagingParams.search.subheading;
            }
        }

        function loadAll () {
            HeadingSubheading.search({
                page: pagingParams.page - 1,
                size: vm.itemsPerPage,
                code: vm.code,
                heading: vm.heading === undefined ? '' : vm.heading,
                subheading: vm.subheading === undefined ? '' : vm.subheading,
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
                vm.headingSubheadings = data;
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
                heading: vm.heading === undefined ? '' : vm.heading,
                subheading: vm.subheading === undefined ? '' : vm.subheading
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
            transition ();
        }

        function headingFilter($select) {
            var headingList = [];

            for(var index in $select.items){
                if($select.items[index].heading){
                    headingList.push($select.items[index]);
                }
            }
            $select.items = headingList;
        }

        function subheadingFilter($item) {
            if(vm.heading === undefined){
                vm.subheading = '';
            }

            if(vm.heading !== '' && vm.heading !== undefined){
                if($item.heading === false && vm.heading === $item.associatedHeadingId){
                    return true;
                }
            }

            return false;
        }
    }
})();
