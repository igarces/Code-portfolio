(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('SubactivityPoaLevel2MonitoringController',SubactivityPoaLevel2MonitoringController);

    SubactivityPoaLevel2MonitoringController.$inject = ['$scope','$state', 'entity', 'entityAct', 'ActivityBreakdown', 'SubactivityMonitoring', 'DateUtils'];

    function SubactivityPoaLevel2MonitoringController($scope, $state, entity, entityAct, ActivityBreakdown, SubactivityMonitoring, DateUtils) {
        var vm = this;

        vm.subactivityPoa = entity;
        vm.activityPoa = entityAct;
        vm.dateformat = 'dd/MM/yyyy';
        vm.monitoringList = [];
        vm.patternNumbers = '^[0-9]+$';
        vm.changePercent = changePercent;
        vm.totalSum = 0;
        vm.cancel = cancel;
        vm.save = save;
        vm.currentyear = new Date().getFullYear();
        vm.currentMonth = new Date().getMonth();
        vm.datePickerOpenStatus = {};
        vm.openCalendar = openCalendar;
        vm.currentWeek = -1;
        vm.currentWeekMonitoring = null;
        vm.showAddButton = true;

        initData();

        function initData() {
            initMonitoringList();

            SubactivityMonitoring.getMonitoringBySubactivity({subactivityId: vm.subactivityPoa.id, year: vm.currentyear, month: null},
                function (list) {

                    for(var index in list){
                        if(list[index].id){
                            for(var jindex in vm.monitoringList){
                                if(list[index].week === vm.monitoringList[jindex].week){

                                    list[index].startDate = DateUtils.convertLocalDateFromServer(list[index].startDate);
                                    list[index].finalDate = DateUtils.convertLocalDateFromServer(list[index].finalDate);

                                    if(list[index].week === vm.currentWeek){
                                        vm.showAddButton = false;
                                        list[index].showData = true;
                                    }

                                    vm.monitoringList[jindex] = list[index];
                                }
                            }
                        }
                    }

                    vm.totalSum = 0;
                    var accumulated = 0;

                    for(var jindex in vm.monitoringList){
                        if(vm.monitoringList[jindex]){

                            var beforeMonitoring = vm.monitoringList[Number(jindex)-1];
                            var monitoring = vm.monitoringList[jindex];

                            if(monitoring.week != vm.currentWeek){
                                monitoring.showData = true;

                                if(monitoring.id === null || monitoring.id === undefined){
                                    // monitoring.startDate = null;
                                    // monitoring.finalDate = null;
                                }
                            }else{
                                vm.currentWeekMonitoring = monitoring;
                            }

                            if(beforeMonitoring && beforeMonitoring.realPercent > 0){
                                accumulated = accumulated + Number(beforeMonitoring.realPercent);
                            }

                            // if(monitoring.week <= vm.currentWeek){
                                monitoring.accumulatedPercent = accumulated;
                            // }
                        }
                        vm.totalSum = Number(vm.totalSum) + Number(monitoring.realPercent);
                    }
            });
        }

        function initMonitoringList(){
            var startDate = vm.subactivityPoa.startDate;
            var finalDate = vm.subactivityPoa.finalDate;
            var today = new Date();

            if(today < startDate || today > finalDate){
                vm.showAddButton = false;
            }
            var weekNum = 1;

            while(startDate < finalDate){
                var flagOver = false;
                var startDayWeek = null;
                var finalDayWeek = null;

                if(weekNum === 1){
                    startDayWeek = startDate;
                    finalDayWeek = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + (6 - startDate.getDay()));
                }else{
                    startDayWeek = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + (0 - startDate.getDay()));
                    finalDayWeek = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + (6 - startDate.getDay()));

                    if(finalDate < finalDayWeek){
                        finalDayWeek = finalDate;
                        flagOver = true;
                    }
                }

                var monitoring = {
                    week: weekNum,
                    subactivityPoaId: vm.subactivityPoa.id,
                    startDate: startDayWeek,
                    finalDate: finalDayWeek,
                    realPercent: parseFloat(0).toFixed(2),
                    accumulatedPercent: 0,
                    year: today.getFullYear()
                };
                if(today < startDayWeek || today > finalDayWeek){
                    monitoring.showData = true;
                }else{
                    vm.currentWeek = JSON.parse(JSON.stringify(weekNum));
                    vm.currentWeekMonitoring = monitoring;
                }
                vm.monitoringList.push(monitoring);

                weekNum++;
                startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 7);

                if(startDate >= finalDate && !flagOver){
                    startDayWeek = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() - (6 - startDate.getDay()));
                    finalDayWeek = finalDate;

                    var monitoring = {
                        week: weekNum,
                        subactivityPoaId: vm.subactivityPoa.id,
                        startDate: startDayWeek,
                        finalDate: finalDayWeek,
                        realPercent: parseFloat(0).toFixed(2),
                        accumulatedPercent: 0,
                        year: today.getFullYear()
                    };
                    if(today < startDayWeek || today > finalDayWeek){
                        monitoring.showData = true;
                    }else{
                        vm.currentWeek = JSON.parse(JSON.stringify(weekNum));
                    }
                    vm.monitoringList.push(monitoring);
                }
            }
        }

        function changePercent(monitoring) {
            validate(monitoring);
            vm.totalSum = 0;
            for(var index in vm.monitoringList){
                if(vm.monitoringList[index] && vm.monitoringList[index].realPercent > 0){
                    vm.totalSum = Number(vm.totalSum) + Number(vm.monitoringList[index].realPercent);
                }
            }
        }

        function cancel() {
            $state.go('subactivity-poa', null, {reload: true});
        }

        function save(){
            if (vm.currentWeekMonitoring.id !== null) {
                SubactivityMonitoring.update(vm.currentWeekMonitoring, onSaveSuccess, onSaveError);
            } else {
                SubactivityMonitoring.save(vm.currentWeekMonitoring, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $state.go('subactivity-poa', null, {reload: true});
        }

        function onSaveError () {
            vm.isSaving = false;
        }

        vm.datePickerOpenStatus.startDate = false;
        vm.datePickerOpenStatus.finalDate = false;

        function openCalendar (date) {
            vm.datePickerOpenStatus[date] = true;
        }

        vm.startDateOption = {
            minDate: vm.subactivityPoa.startDate,
            maxDate: vm.subactivityPoa.finalDate
        };

        vm.finalDateOption = {
            minDate: vm.subactivityPoa.startDate,
            maxDate: vm.subactivityPoa.finalDate
        };

        $scope.$watch('vm.monitoringList[vm.currentMonth].startDate', updateAsync);
        $scope.$watch('vm.monitoringList[vm.currentMonth].finalDate', updateAsync);

        function updateAsync(){
            vm.startDateOption = {
                minDate: vm.subactivityPoa.startDate,
                maxDate: vm.monitoringList[vm.currentMonth] !== undefined ? vm.monitoringList[vm.currentMonth].finalDate : null
            };

            vm.finalDateOption = {
                minDate: vm.monitoringList[vm.currentMonth] !== undefined ? vm.monitoringList[vm.currentMonth].startDate : null,
                maxDate: vm.subactivityPoa.finalDate
            };
        }

        //decimal number validation
        vm.max = 100;

        function validate(monitoring) {
            if (monitoring.realPercent != undefined && isNaN( monitoring.realPercent)) {
                monitoring.realPercent = 0;
            }

            var arr = String(monitoring.realPercent).split(".");
            if(arr.length === 2 && arr[1].length > 2){
                monitoring.realPercent = Math.floor(monitoring.realPercent * 100) / 100;
                monitoring.realPercent = monitoring.realPercent.toFixed(2);
            }

            if(vm.max!== undefined &&  monitoring.realPercent > vm.max){
                monitoring.realPercent = vm.max;
            }
        }

        vm.blur = function(monitoring){
            if(monitoring.realPercent !== null && monitoring.realPercent !== undefined){
                var tmp = parseFloat(monitoring.realPercent).toFixed(2);

                monitoring.realPercent = tmp;
            }
        }
    }
})();
