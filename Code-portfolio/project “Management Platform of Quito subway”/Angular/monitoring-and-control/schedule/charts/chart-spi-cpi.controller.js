(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('ChartSPIvsCPIController', ChartSPIvsCPIController);
    ChartSPIvsCPIController.$inject = ['$scope', '$state', 'Schedule', 'AlertService'];

    function ChartSPIvsCPIController ($scope, $state, Schedule, AlertService ) {
        var vm = this;

        loadChart();


        vm.chartConfig = {
            chart: {
                type: 'spline'
            },
            title: {
                text: 'SPI vs CPI'
            },
            xAxis: {
                title:{
                    text: '<b>CPI</b>',
                    align: 'high'
                },
                categories: []
            },
            yAxis: {
                title: {
                    text: '<b>SPI</b>',
                    rotation: 0,
                    align: 'high'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                borderWidth: 0,
                title: {
                    text: '<span style="font-size: 9px; color: #666; font-weight: normal">(1,1) En tiempo y En presupuesto</span><br/>' +
                    '<span style="font-size: 9px; color: #666; font-weight: normal">(CPI,SPI) Adelantado y bajo el presupuesto</span><br/>' +
                    '<span style="font-size: 9px; color: #666; font-weight: normal">(CPI,-SPI) Retrasado y bajo el presupuesto</span><br/>' +
                    '<span style="font-size: 9px; color: #666; font-weight: normal">(-CPI,-SPI) Retrasado y sobre el presupuesto</span><br/>' +
                    '<span style="font-size: 9px; color: #666; font-weight: normal">(-CPI, SPI) Adelantado y sobre el presupuesto</span>',
                    style: {
                        fontStyle: 'italic'
                    }
                }
            },
            series: [{}],
            loading: false,
            credits: {
                enabled : false
            },
            tooltip: {

            }

        };

        function loadChart() {
            Schedule.chartS( onSuccess, onError);
            function onSuccess(data) {

                vm.chartConfig.series[0].name = 'SPI vs CPI';
                vm.chartConfig.series[0].data = data.spiCpi;

                Highcharts.chart('chartContainer', vm.chartConfig);

            }
            function onError(error) {
                AlertService.error(error.data.message);
            }
        }

        vm.cancel = cancel;


        function cancel() {
            $state.go('status-schedule', null, {reload: true});
        }
    }

})();

