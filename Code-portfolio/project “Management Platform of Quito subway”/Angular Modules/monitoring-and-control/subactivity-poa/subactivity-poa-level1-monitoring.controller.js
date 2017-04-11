 (function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('SubactivityPoaLevel1MonitoringController',SubactivityPoaLevel1MonitoringController);

    SubactivityPoaLevel1MonitoringController.$inject = ['$scope','$state', 'entity', 'entityAct', 'ActivityBreakdown', 'SubactivityMonitoring', 'DateUtils'];

    function SubactivityPoaLevel1MonitoringController($scope, $state, entity, entityAct, ActivityBreakdown, SubactivityMonitoring, DateUtils) {
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
        vm.newActivityBreakdown = false;
        vm.monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        vm.currentyear = new Date().getFullYear();
        vm.currentDate = new Date();
        vm.currentMonth = vm.currentDate.getMonth();
        vm.currentDay = vm.currentDate.getDate();
        vm.isOutOfRange = false;

        if(vm.currentDay < vm.activityPoa.poaStartDay && vm.currentDay > vm.activityPoa.poaFinalDay){
            vm.isOutOfRange = true;
        }

        if(vm.currentDay <= vm.activityPoa.poaFinalDay){
            vm.currentMonth = vm.currentMonth - 1;
        }

        vm.datePickerOpenStatus = {};
        vm.openCalendar = openCalendar;
        vm.showAcceptButton = true;

        initData();

        function initData() {
            //Search the monitoring activities for the current year
            SubactivityMonitoring.getMonitoringBySubactivity({subactivityId: vm.subactivityPoa.id, year: vm.currentyear, month: null},
                function (listM) {
                    var monitoringList = listM;

                    ActivityBreakdown.getBreakdownBySubactivity({subactivityId: vm.subactivityPoa.id, year: vm.currentyear}, function (list) {
                        if(list.length === 0){
                            vm.showAcceptButton = false;
                        }else{
                            vm.showAcceptButton = false;
                            for(var jindex in list){
                                if(list[jindex] && list[jindex].month ===  vm.currentMonth){
                                    vm.showAcceptButton = true;
                                }
                            }
                        }

                        initMonitoringList(list, monitoringList);
                    });
            });
        }

        function initMonitoringList(breakdownList, monitoringList){

            for(var index in breakdownList){

                if(breakdownList[index].id){
                    var monitoring = null;

                    for(var jindex in monitoringList){
                        if(monitoringList[jindex].id !== null && monitoringList[jindex].id !== undefined &&
                            monitoringList[jindex].month === breakdownList[index].month){

                            monitoring = monitoringList[jindex];
                            monitoring.startDate = DateUtils.convertLocalDateFromServer(monitoring.startDate);
                            monitoring.finalDate = DateUtils.convertLocalDateFromServer(monitoring.finalDate);
                            monitoring.showData = true;

                            if(monitoringList[jindex].month === vm.currentMonth){
                                vm.showAcceptButton = false;
                            }
                            break;
                        }
                    }

                    if(monitoring === null){
                        monitoring = {
                            year: breakdownList[index].year,
                            month: breakdownList[index].month,
                            planningPercent:  breakdownList[index].planningPercent,
                            realPercent:  parseFloat(0).toFixed(2),
                            subactivityPoaId: vm.subactivityPoa.id,
                            startDate: breakdownList[index].month < vm.currentMonth ? null : vm.subactivityPoa.startDate,
                            finalDate: breakdownList[index].month < vm.currentMonth ? null : vm.subactivityPoa.finalDate
                        };
                    }

                    if(monitoring.month != vm.currentMonth || vm.isOutOfRange){
                        monitoring.showData = true;
                    }

                    if(breakdownList[index].month > vm.currentMonth || (breakdownList[index].month === vm.currentMonth && vm.isOutOfRange)){
                        monitoring.startDate = null;
                        monitoring.finalDate = null;
                    }

                    if(vm.isOutOfRange){
                        vm.showAcceptButton = false;
                    }
                    vm.monitoringList.push(monitoring);
                    vm.totalSum = Number(vm.totalSum) + Number(monitoring.realPercent);
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
            var currentMonitoring = null;

            for(var jindex in vm.monitoringList){
                if(vm.monitoringList[jindex] && vm.monitoringList[jindex].month === vm.currentMonth){
                    currentMonitoring = vm.monitoringList[jindex];
                    break;
                }
            }

            if(currentMonitoring !== null){
                if (currentMonitoring.id !== null) {
                    SubactivityMonitoring.update(currentMonitoring, onSaveSuccess, onSaveError);
                } else {
                    SubactivityMonitoring.save(currentMonitoring, onSaveSuccess, onSaveError);
                }
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
