(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('SubactivityPoaBreakdownController',SubactivityPoaBreakdownController);

    SubactivityPoaBreakdownController.$inject = ['$state', 'entity', 'entityAct', 'ActivityBreakdown'];

    function SubactivityPoaBreakdownController($state, entity, entityAct, ActivityBreakdown) {
        var vm = this;

        vm.subactivityPoa = entity;
        vm.activityPoa = entityAct;
        vm.dateformat = 'dd/MM/yyyy';
        vm.breakdownList = [];
        vm.patternNumbers = '^[0-9]+$';
        vm.changePercent = changePercent;
        vm.totalSum = 0;
        vm.cancel = cancel;
        vm.save = save;
        vm.newActivityBreakdown = false;
        vm.monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

        initData();

        function initData() {
            var actualyear = new Date().getFullYear();

            ActivityBreakdown.getBreakdownBySubactivity({subactivityId: vm.subactivityPoa.id, year: actualyear}, function (list) {

                if(list.length > 0){
                    vm.breakdownList = list;
                    vm.totalSum = 100;
                }else{
                    vm.newActivityBreakdown = true;
                    breakdownList();
                }
            });
        }

        function breakdownList(){
           var startYear = vm.subactivityPoa.startDate.getFullYear();
           var finalYear = vm.subactivityPoa.finalDate.getFullYear();
           var actualyear = new Date().getFullYear();

           var startMonth = vm.subactivityPoa.startDate.getMonth();

            if(finalYear == actualyear){
                var finalMonth = vm.subactivityPoa.finalDate.getMonth();
            }else{
                var finalMonth = 11;
            }

            while(startMonth <= finalMonth && startMonth <= 11){
                var breakdown = {
                    year: actualyear,
                    month: startMonth,
                    planningPercent: null,
                    subactivityPoaId: vm.subactivityPoa.id
                };
                startMonth++;
                vm.breakdownList.push(breakdown);
            }
        }

        function changePercent(planningPercent) {
            vm.totalSum = 0;
            for(var index in vm.breakdownList){
                if(vm.breakdownList[index]){
                    var percent = JSON.parse(JSON.stringify(vm.breakdownList[index].planningPercent));

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
            $state.go('subactivity-poa', null, {reload: true});
        }

        function save(){
            ActivityBreakdown.save(vm.breakdownList, function () {
                $state.go('subactivity-poa', null, {reload: true});
            });
        }
    }
})();
