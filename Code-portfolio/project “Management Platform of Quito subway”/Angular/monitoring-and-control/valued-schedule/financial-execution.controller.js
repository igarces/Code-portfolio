(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('FinancialExecutionController', FinancialExecutionController);

    FinancialExecutionController.$inject = ['$scope', '$state', '$stateParams', 'DateUtils', 'entity', 'ValuedSchedule', 'User', 'ScheduleComponentDate', 'AlertService', '$translate'];

    function FinancialExecutionController($scope, $state, $stateParams, DateUtils, entity, ValuedSchedule, User, ScheduleComponentDate, AlertService, $translate) {
        var vm = this;

        vm.monthList = entity;
        vm.dateformat = 'dd/MM/yyyy';
        vm.valuedScheduleId = $stateParams.id;
        vm.changeMonth = changeMonth;
        vm.clear = clear;
        vm.cancel = cancel;
        vm.searchByFilters = searchByFilters;
        vm.saveActualExecution = saveActualExecution;
        vm.plusTotals = plusTotals;
        vm.totalSum = 0;
        vm.executedTotal = 0;
        vm.accumulatedTotal = 0;
        vm.plannedTotal = 0;
        vm.totalActualExecution = 0;
        vm.getArrayNumber = getArrayNumber;

        initializeVariables();

        function initializeVariables() {
            vm.fromDate = '';
            vm.toDate = '';
            vm.month = '';
            vm.componentList = [];
            vm.showAcceptButton = false;
        }

        function changeMonth(month) {
            if(month !== null && month != undefined){
                vm.fromDate = DateUtils.convertLocalDateFromServer(month.startDate);
                vm.toDate = DateUtils.convertLocalDateFromServer(month.finalDate);
            }else{
                vm.fromDate = '';
                vm.toDate = '';
            }
        }

        function clear() {
            initializeVariables();
        }

        function cancel() {
            $state.go('valued-schedule', null, {reload: true});
        }

        function searchByFilters() {
            ValuedSchedule.getFinancialExecution(
                {
                    month: vm.month,
                    valuedSchedule: vm.valuedScheduleId
                },
                function (financialObj) {
                    var list = financialObj.componentsList;
                    vm.componentList = financialObj.componentsList;
                    vm.totalPlannedAmount = financialObj.totalPlannedAmount;
                    vm.totalExecutedAmount = financialObj.totalExecutedAmount;
                    vm.totalPercent = financialObj.totalPercent;

                    if(list.length){
                        vm.showAcceptButton = true;
                    }else{
                        vm.showAcceptButton = false;
                    }
                    plusTotals(true);
                });
        }

        function plusTotals(searchSpace){
            var totalAmount = 0;
            var executedTotal = 0;
            // var accumulatedtotal = 0;
            var plannedTotal = 0;
            var totalActualExecution = 0;

            for(var index in vm.componentList){
                if(vm.componentList[index] && vm.componentList[index].id){
                    if(searchSpace){
                        searchSpacesInComponent(vm.componentList[index]);
                    }

                    if(vm.componentList[index].totalAmount > 0){
                        totalAmount += Number(vm.componentList[index].totalAmount);
                    }

                    if(vm.componentList[index].amount > 0){
                        plannedTotal += Number(vm.componentList[index].amount);
                    }

                    var executedAccumulatedSum = 0;
                    if(vm.componentList[index].executedAccumulatedAmount == null || vm.componentList[index].executedAccumulatedAmount == undefined){
                        vm.componentList[index].executedAccumulatedAmount = 0;
                    }

                    if(vm.componentList[index].actualExecution > 0){
                        totalActualExecution += Number(vm.componentList[index].actualExecution);
                        executedAccumulatedSum =  Number(vm.componentList[index].executedAccumulatedAmount) + Number(vm.componentList[index].actualExecution);
                    }else{
                        executedAccumulatedSum =  Number(vm.componentList[index].executedAccumulatedAmount) + 0;
                    }
                    executedTotal += Number(executedAccumulatedSum);
                }
            }
            vm.totalAmount = totalAmount;
            vm.executedTotal = executedTotal;
            var percent = executedTotal * 100 / totalAmount;
            vm.accumulatedTotal = Number(parseFloat(percent).toFixed(2));
            vm.plannedTotal = plannedTotal;
            vm.totalActualExecution = totalActualExecution;
        }

        function searchSpacesInComponent(component){
            var code = component.scheduleComponentCode;

            component['long'] = code.length / 2;
        }

        function saveActualExecution() {
            var saveList = [];
            var count = 0;

            for(var index in vm.componentList){
                if(vm.componentList[index] && vm.componentList[index].actualExecution !== null &&
                    vm.componentList[index].actualExecution !== undefined){

                    saveList.push(vm.componentList[index]);
                }
            }

            for(var index in saveList){
                if(saveList[index]){
                    ScheduleComponentDate.update(saveList[index], onSaveSuccess, onSaveError);
                }
            }

            function onSaveSuccess (result) {
                count++;
                if(count === saveList.length){
                    AlertService.success($translate.instant("metroquitoApp.valuedSchedule.actualExecutionSuccess"));
                    $state.go('valued-schedule');
                }
            }

            function onSaveError (error) {
                AlertService.error(error);
            }
        }

        function getArrayNumber(number) {
            if(number > 1 && number <= 5){
                return new Array(number * 2);
            }else if(number > 5){
                return new Array(10);
            }else{
                return [];
            }
        }
    }
})();
