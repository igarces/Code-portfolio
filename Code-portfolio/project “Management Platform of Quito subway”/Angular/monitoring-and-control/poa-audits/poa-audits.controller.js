(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('PoaAuditsController', PoaAuditsController);

    PoaAuditsController.$inject = ['$scope', '$state', 'PoaAudits', 'ParseLinks', 'AlertService', 'pagingParams', 'paginationConstants'];

    function PoaAuditsController ($scope, $state, PoaAudits, ParseLinks, AlertService, pagingParams, paginationConstants) {
        var vm = this;

        vm.loadPage = loadPage;
        vm.predicate = pagingParams.predicate;
        vm.reverse = pagingParams.ascending;
        vm.transition = transition;
        vm.itemsPerPage = paginationConstants.itemsPerPage;
        vm.dateformat = 'dd/MM/yyyy';
        vm.dateHourFormat = 'dd/MM/yyyy H:mm';
        vm.searchByFilters = searchByFilters;
        vm.clear = clear;
        vm.cancel = cancel;

        initializeVariables(false);
        loadAll();

        function initializeVariables(clean) {
            if(clean){
                vm.fromDate = '';
                vm.toDate = '';
            }else{
                vm.fromDate = pagingParams.search.fromDate;
                vm.toDate = pagingParams.search.toDate;
            }
        }

        function loadAll () {
            PoaAudits.query({
                page: pagingParams.page - 1,
                size: vm.itemsPerPage,
                sort: sort(),
                fromDate: vm.fromDate,
                toDate: vm.toDate
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
                vm.poaAudits = data;
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
                fromDate: vm.fromDate,
                toDate: vm.toDate
            });
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
