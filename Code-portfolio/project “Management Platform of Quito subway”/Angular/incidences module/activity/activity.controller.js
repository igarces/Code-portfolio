(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('ActivityController', ActivityController);

    ActivityController.$inject = ['$scope', '$state', 'Activity', 'ParseLinks', 'AlertService', 'pagingParams', 'paginationConstants'];

    function ActivityController ($scope, $state, Activity, ParseLinks, AlertService, pagingParams, paginationConstants) {

        var vm = this;

        vm.loadPage = loadPage;
        vm.predicate = pagingParams.predicate;
        vm.reverse = pagingParams.ascending;
        vm.transition = transition;
        vm.itemsPerPage = paginationConstants.itemsPerPage;

        vm.toggle = function (vm) {
            vm.collapsed=!vm.collapsed;
            vm.toggle();
        };

        vm.colapse=true;
        vm.colapsePanel=colapsePanel;
        vm.searchByName = searchByName;
        vm.classificationChanged = classificationChanged;
        vm.clear = clear;
        vm.cancel = cancel;

        initializeVariables(false);
        loadAll();

        function initializeVariables(clean) {
            if(clean){
                vm.name_activity = '';
            }else{
                vm.name_activity = pagingParams.search.name;
            }
        }

        function loadAll () {
            Activity.search({
                page: pagingParams.page - 1,
                size: vm.itemsPerPage,
                name: vm.name_activity,
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
                vm.activities = data;
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
                name: vm.name_activity
            });
        }

        function colapsePanel(){
            vm.colapse=!vm.colapse;
        }

        function clear(){
            initializeVariables(true);
            vm.page = 1;
            transition();
        }

        function searchByName() {
            pagingParams.page = 1;
            transition();
        }

        function classificationChanged() {
            loadAll();
        }

        function cancel() {
            $state.go('incidences', null, {reload: true});
        }
    }
})();
