(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('PoaPlmqReportController', PoaPlmqReportController);

    PoaPlmqReportController.$inject = ['$scope', '$state', '$sce', 'ValuedSchedule'];

    function PoaPlmqReportController($scope, $state, $sce, ValuedSchedule) {
        var vm = this;

        //variables
        vm.dateformat = 'MM/yyyy';

        //initial methods
        initializeVariables();

        //functions
        vm.clear = clear;
        vm.cancel = cancel;
        vm.generateReport = generateReport;

        //date configurations
        vm.openCalendar = openCalendar;
        vm.datePickerOpenStatus = {};
        vm.datePickerOpenStatus.fromDate = false;
        vm.datePickerOpenStatus.toDate = false;

        function openCalendar(date) {
            vm.datePickerOpenStatus[date] = true;
        }

        vm.fromDateOption = {
            minMode: 'month',
            minDate: new Date(new Date().getFullYear(),0,1),
            maxDate: vm.toDate == null ? new Date(new Date().getFullYear(),11,31) : vm.toDate
        };

        vm.toDateOption = {
            minMode: 'month',
            minDate: vm.fromDate == null ? new Date(new Date().getFullYear(),0,1) : vm.fromDate,
            maxDate: new Date(new Date().getFullYear(),11,31)
        };

        $scope.$watch('vm.toDate', updateAsync);
        $scope.$watch('vm.fromDate', updateAsync);

        function updateAsync(){
            vm.fromDateOption = {
                minMode: 'month',
                minDate: new Date(new Date().getFullYear(),0,1),
                maxDate: (vm.toDate == null || vm.toDate == '') ? new Date(new Date().getFullYear(),11,31) : vm.toDate
            };

            vm.toDateOption = {
                minMode: 'month',
                minDate: (vm.fromDate == null || vm.fromDate == '') ? new Date(new Date().getFullYear(),0,1) : vm.fromDate,
                maxDate: new Date(new Date().getFullYear(),11,31)
            };
            $scope.$evalAsync();
        }

        function initializeVariables() {
            vm.fromDate = '';
            vm.toDate = '';
        }

        function clear() {
            initializeVariables();
        }

        function cancel() {
            $state.go('monitoring-and-control-reports', null, {reload: true});
        }

        function generateReport() {
            ValuedSchedule.generatePoaPlmqReport({fromDate: vm.fromDate, toDate: vm.toDate}, function (data) {
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
