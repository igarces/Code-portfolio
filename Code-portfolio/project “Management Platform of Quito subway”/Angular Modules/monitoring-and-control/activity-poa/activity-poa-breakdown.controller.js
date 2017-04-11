(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('ActivityPoaBreakdownController',ActivityPoaBreakdownController);

    ActivityPoaBreakdownController.$inject = ['$state', 'entity', 'ActivityBreakdown', 'nomenclatorsConstants'];

    function ActivityPoaBreakdownController($state, entity, ActivityBreakdown, nomenclatorsConstants) {
        var vm = this;

        vm.activityPoa = entity;
        vm.dateformat = 'dd/MM/yyyy';
        vm.breakdownList = [];
        vm.patternNumbers = '^[0-9]+$';
        vm.changePercent = changePercent;
        vm.totalSum = 0;
        vm.cancel = cancel;
        vm.save = save;
        vm.newActivityBreakdown = false;
        vm.poaStateReformedId = nomenclatorsConstants.poaStateReformedId;

        initData();

        function initData() {
            ActivityBreakdown.getBreakdownByActivity({activityId: vm.activityPoa.id}, function (list) {

                if(list.length > 0){
                    // vm.breakdownList = list;
                    vm.totalSum = 100;

                    if(vm.activityPoa.activityStatePoaId === vm.poaStateReformedId){
                        vm.newActivityBreakdown = true;
                    }

                    for(var index in list) {
                        if (list[index] && list[index].id) {
                            vm.breakdownList.push(list[index]);
                        }
                    }

                }else{
                    vm.newActivityBreakdown = true;

                    var startYear = vm.activityPoa.startDate.getFullYear();
                    var finalYear = vm.activityPoa.finalDate.getFullYear();

                    while(startYear <= finalYear){
                        var breakdown = {
                            year: startYear,
                            planningPercent: null,
                            activityPoaId: vm.activityPoa.id
                        };
                        startYear++;
                        vm.breakdownList.push(breakdown);
                    }
                }
            });
        }

        function changePercent(planningPercent) {
            vm.totalSum = 0;
            for(var index in vm.breakdownList){
                if(vm.breakdownList[index]){
                    var percent = Number(JSON.parse(JSON.stringify(vm.breakdownList[index].planningPercent)));

                    if(vm.totalSum >= 100){
                        vm.breakdownList[index].planningPercent = 0;
                        vm.breakdownList[index].planningPercent = parseFloat(vm.breakdownList[index].planningPercent).toFixed(2);
                    }else{
                        vm.totalSum = Number(vm.totalSum) + Number(vm.breakdownList[index].planningPercent);

                        if(vm.totalSum > 100){
                            var dif = Number(vm.totalSum) - Number(vm.breakdownList[index].planningPercent);

                            vm.breakdownList[index].planningPercent = Number(100) - Number(parseFloat(dif).toFixed(2));

                            vm.totalSum = 100;
                        }
                    }
                }
            }
        }

        function cancel() {
            $state.go('activity-poa', null, {reload: true});
        }

        function save(){
            ActivityBreakdown.save(vm.breakdownList, function () {
                $state.go('activity-poa', null, {reload: true});
            });
        }
    }
})();
