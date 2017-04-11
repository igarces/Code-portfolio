(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('PepReportController', PepReportController);

    PepReportController.$inject = ['$scope', '$state', '$sce', 'ValuedSchedule'];

    function PepReportController($scope, $state, $sce, ValuedSchedule) {
        var vm = this;

        //variables
        vm.yearformat = 'yyyy';

        //initial methods
        initializeVariables();

        //functions
        vm.clear = clear;
        vm.cancel = cancel;
        vm.generateReport = generateReport;

        //date configurations
        vm.openCalendar = openCalendar;
        vm.datePickerOpenStatus = {};
        vm.datePickerOpenStatus.initYear = false;
        vm.datePickerOpenStatus.finalYear = false;

        function openCalendar(date) {
            vm.datePickerOpenStatus[date] = true;
        }

        vm.yearDateOption = {
            minMode: 'year',
            minDate: new Date(2012,1,1),
            maxDate: new Date(2019,1,1)
        };

        vm.yearFinalDateOption = {
            minMode: 'year',
            minDate: new Date(2012,1,1),
            maxDate: new Date(2019,1,1)
        };

        $scope.$watch('vm.date', updateAsync);
        $scope.$watch('vm.finalDate', updateAsync);

        function updateAsync(){
            vm.yearDateOption = {
                minMode: 'year',
                minDate: new Date(2012,1,1),
                maxDate: vm.finalDate == '' ? new Date(2019,1,1) : vm.finalDate
            };

            vm.yearFinalDateOption = {
                minMode: 'year',
                minDate: vm.date == '' ? new Date(2012,1,1) : vm.date,
                maxDate: new Date(2019,1,1)
            };
            $scope.$evalAsync();
        }


        function initializeVariables() {
            vm.date = '';
            vm.finalDate = '';
        }

        function clear() {
            initializeVariables();
        }

        function cancel() {
            $state.go('monitoring-and-control-reports', null, {reload: true});
        }

        function generateReport() {
            ValuedSchedule.generatePepReport({date: vm.date, finalDate: vm.finalDate}, function (data) {
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
