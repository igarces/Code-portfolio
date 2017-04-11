(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('ScheduleController', ScheduleController);
    ScheduleController.$inject = ['$scope', '$state', 'DataUtils', 'Schedule', 'ParseLinks', 'AlertService', 'pagingParams', 'paginationConstants'];

    function ScheduleController ($scope, $state, DataUtils, Schedule, ParseLinks, AlertService, pagingParams, paginationConstants) {
        var vm = this;


        vm.dateformat = 'dd/MM/yyyy';

        vm.loadPage = loadPage;
        vm.predicate = pagingParams.predicate;
        vm.reverse = pagingParams.ascending;
        vm.transition = transition;
        vm.itemsPerPage = paginationConstants.itemsPerPage;
        vm.openFile = DataUtils.openFile;
        vm.byteSize = DataUtils.byteSize;

        vm.searchByFilters = searchByFilters;
        vm.clear = clear;
        vm.cancel = cancel;
        vm.downloadFile = downloadFile;

        initializeVariables();
        loadAll();
        getLast();

        //date configurations
        vm.openCalendar = openCalendar;
        vm.datePickerOpenStatus = {};
        vm.datePickerOpenStatus.fromDate = false;
        vm.datePickerOpenStatus.toDate = false;

        function getLast() {
            Schedule.last(onSuccess, onError);
            function onSuccess(data) {
                vm.lastSchedule = data;
            }
            function onError(error) {
                AlertService.error(error.data.message);
            }
        }

        function downloadFile(scheduleId) {
            Schedule.download({scheduleId: scheduleId},
                function (result) {
                    if(result.success){
                        DataUtils.downloadFile(result.data.fileScheduleContentType, result.data.fileSchedule, result.data.fileScheduleName);
                    }
                    else {
                        AlertService.error(result.message);
                    }
                });
        }

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

        function initializeVariables() {
            vm.fromDate = '';
            vm.toDate = '';
        }

        function loadAll () {
            Schedule.search({
                dateFrom: vm.fromDate,
                dateTo: vm.toDate,
                page: pagingParams.page - 1,
                size: vm.itemsPerPage,
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
                vm.schedules = data;
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
                search: vm.currentSearch
            });
        }

        function searchByFilters() {
            pagingParams.page = 1;
            vm.page = 1;
            loadAll();
        }

        function cancel(){
            $state.go('project-schedule', null, {reload: true});
        }

        function clear(){
            initializeVariables();
            loadAll();
        }

    }


})();
