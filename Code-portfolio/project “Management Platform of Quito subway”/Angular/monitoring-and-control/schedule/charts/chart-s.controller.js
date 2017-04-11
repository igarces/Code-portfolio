(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('ChartSController', ChartSController);
    ChartSController.$inject = ['$scope', '$state', 'Schedule', 'AlertService'];

    function ChartSController ($scope, $state, Schedule, AlertService ) {
        var vm = this;

        loadChart();

        vm.chartConfig = {
            chart: {
                type: 'spline'
            },
            title: {
                text: 'Curvas S'
            },
            subtitle: {
                text: 'Proyección de Obra'
            },
            xAxis: {
                title:{
                  text: 'Fecha'
                },
                categories: []
            },
            yAxis: {
                title: {
                    text: 'Costo',
                    rotation: 0
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [{},{},{}],
            credits: {
                enabled : false
            },
            loading: false

        };

        function loadChart() {
            Schedule.chartS( onSuccess, onError);
            function onSuccess(data) {
                vm.chartConfig.xAxis.categories = data.dates;
                vm.chartConfig.series[0].data = data.pv;
                vm.chartConfig.series[0].name = 'Planificado';
                vm.chartConfig.series[1].data = data.ev;
                vm.chartConfig.series[1].name = 'Ganadao';
                vm.chartConfig.series[2].data = data.ac;
                vm.chartConfig.series[2].name = 'Realizado';

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
