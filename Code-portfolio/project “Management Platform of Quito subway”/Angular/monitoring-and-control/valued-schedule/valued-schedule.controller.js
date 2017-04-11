(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('ValuedScheduleController', ValuedScheduleController);

    ValuedScheduleController.$inject = ['$scope', '$state', 'DataUtils', 'ValuedSchedule', 'ParseLinks', 'AlertService', 'pagingParams', 'paginationConstants', '$sce'];

    function ValuedScheduleController ($scope, $state, DataUtils, ValuedSchedule, ParseLinks, AlertService, pagingParams, paginationConstants, $sce) {
        var vm = this;

        vm.loadPage = loadPage;
        vm.predicate = pagingParams.predicate;
        vm.reverse = pagingParams.ascending;
        vm.transition = transition;
        vm.itemsPerPage = paginationConstants.itemsPerPage;
        vm.dateformat = 'dd/MM/yyyy';
        vm.hourFormat = 'H:mm';
        vm.searchByFilters = searchByFilters;
        vm.clear = clear;
        vm.cancel = cancel;
        vm.exportSchedule = exportSchedule;
        vm.exportFinancialExecution = exportFinancialExecution;

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
            ValuedSchedule.query({
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
                vm.valuedSchedules = data;
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

        function searchByFilters() {
            pagingParams.page = 1;
            vm.page = 1;
            transition();
        }

        function cancel(){
            $state.go('monitoring-and-control', null, {reload: true});
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

        function exportSchedule(scheduleId) {
            ValuedSchedule.export({scheduleId: scheduleId}, function (data) {
                var fileUrl = window.URL.createObjectURL(data.response);
                var xlsDL = $sce.trustAsResourceUrl(fileUrl);
                var filenameXLS = "reporte.xls";

                var a = document.createElement("a");
                a.href = fileUrl;
                a.download = filenameXLS;
                a.target = '_blank';
                a.click();
            });
        }

        function exportFinancialExecution(scheduleId) {
            ValuedSchedule.exportFinancialExecution({scheduleId: scheduleId}, function (data) {
                var fileUrl = window.URL.createObjectURL(data.response);
                var xlsDL = $sce.trustAsResourceUrl(fileUrl);
                var filenameXLS = "reporte.xls";

                var a = document.createElement("a");
                a.href = fileUrl;
                a.download = filenameXLS;
                a.target = '_blank';
                a.click();
            });
        }
    }
})();
