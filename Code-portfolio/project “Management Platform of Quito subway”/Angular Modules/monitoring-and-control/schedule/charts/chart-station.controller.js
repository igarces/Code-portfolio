(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('ChartStationController', ChartStationController);
    ChartStationController.$inject = ['$scope', '$state', 'Task', '$filter'];

    function ChartStationController ($scope, $state, Task, $filter ) {
        var vm = this;

        vm.defaultOption = '<Seleccione>';
        vm.selectedStation = {id: ''};

        vm.changeStation = changeStation;

        vm.cancel = cancel;

        loadTasks();
        getParent();

        vm.chartConfig = {
            chart: {
                type: 'bar'
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: [ $filter('date')(new Date(), 'dd/MM/yyyy')],
                title: {
                    text: ''
                }
            },
            yAxis: {
                title: {
                    text: ''
                }                ,
                min: 0, max: 100
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true,
                        format: '{y}%'
                    }
                }
            },
            legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                borderWidth: 0
            },
            series: [
                {
                    name: 'Real al terminar',
                    data: [0]
                }
                ,
                {
                    name: 'Real',
                    data: [0]
                }],
            loading: false,
            credits: {
                enabled : false
            }

        };

        function loadTasks() {
            Task.stations(onSuccess, onError);
                function onSuccess(data) {
                    vm.tasksStations = data;
                }
                function onError(error) {
                }
        }

        function getParent() {
            Task.getParent({
                idSchedule: -1
            },onSuccess, onError);
            function onSuccess(data) {
                vm.taskParent = data;
            }
            function onError(error) {
            }
        }

        var chart = Highcharts.chart('chartContainer', vm.chartConfig);

        function updateData() {
            for (var i = 0, len = vm.tasksStations.length; i < len; i++) {
                var value = vm.tasksStations[i];
                if (value.id == vm.selectedStation.id) {
                    var percentReal = parseFloat( $filter('number')(((value.duration / vm.taskParent.duration) * 100), 2));
                    chart.update({
                        title: {
                            text: 'ESTACIÓN ' + value.name
                        },
                        series: [
                            {
                                data: [ percentReal ]
                            }
                            ,
                            {
                                data: [value.percentComplete]
                            }]
                    });
                    break;
                }
            }
        }

        function changeStation() {
            if(vm.selectedStation.id != null){
                updateData();
            }else{
                chart.update({
                    title: {
                        text: ''
                    },
                    series: [
                        {
                            name: 'Real al terminar',
                            data: [0]
                        }
                        ,
                        {
                            name: 'Real',
                            data: [0]
                        }]
                });
            }
        }

        function cancel() {
            $state.go('status-schedule', null, {reload: true});
        }
    }

})();

