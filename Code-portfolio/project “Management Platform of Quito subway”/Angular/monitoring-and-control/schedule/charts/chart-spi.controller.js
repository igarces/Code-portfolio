(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('ChartSPIController', ChartSPIController);
    ChartSPIController.$inject = ['$scope', '$state', 'Schedule', 'AlertService'];

    function ChartSPIController ($scope, $state, Schedule, AlertService ) {
        var vm = this;

        loadChart();

        vm.chartConfig = {
            chart: {
                type: 'spline'
            },
            title: {
                text: 'SPI'
            },
            subtitle: {
                text: 'Indice de desempeño de calendario'
            },
            xAxis: {
                title:{
                    text: ''
                },
                categories: []
            },
            yAxis: {
                title: {
                    text: '<b>SPI</b>',
                    rotation: 0

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
                    text: '<span style="font-size: 9px; color: #666; font-weight: normal">SPI = 1 El proyecto va en tiempo tal y como se planéo</span><br/>' +
                    '<span style="font-size: 9px; color: #666; font-weight: normal">SPI &gt; 1 El proyecto va en tiempo mejor de lo planeado</span><br/>' +
                    '<span style="font-size: 9px; color: #666; font-weight: normal">SPI &lt; 1 El proyecto tiene un retraso conforme a lo planeado</span>',
                    style: {
                        fontStyle: 'italic'
                    }
                }
            },
            series: [{}],
            loading: false,
            credits: {
                enabled : false
            }

        };



        function loadChart() {
            Schedule.chartS( onSuccess, onError);
            function onSuccess(data) {

                vm.chartConfig.series[0].name = 'SPI';
                vm.chartConfig.series[0].data = data.spi;

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

