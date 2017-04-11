(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('DetailAdjustActivityBudgetController', DetailAdjustActivityBudgetController);

    DetailAdjustActivityBudgetController.$inject = ['$scope', '$state', '$stateParams','ActivityBudget', 'HeadingSubheading', 'AlertService', 'ActivityPoa', '$translate', 'entity'];

    function DetailAdjustActivityBudgetController ($scope, $state, $stateParams, ActivityBudget, HeadingSubheading, AlertService, ActivityPoa, $translate, entity) {

        var vm = this;
        vm.activityPoa = entity;
        vm.dateformat = 'dd/MM/yyyy';
        vm.headingsubheadings = HeadingSubheading.getAllSubheadingsComplete();

        if (vm.activityPoa.id != null){
            vm.activityPoaHeadingSubheadings = [];
            ActivityPoa.queryHeadingSubheadings({activityPoaId: vm.activityPoa.id}, function (data) {
                for (var i = 0; i < data.length; i++){
                    var headingAdd = {
                        id: data[i].id,
                        headingSubheadingId: data[i].headingSubheadingId,
                        activityPoaId: data[i].activityPoaId,
                        headingSubheadingCode: data[i].headingSubheadingCode,
                        headingSubheadingDesc: data[i].headingSubheadingDesc,
                        amount: parseFloat(data[i].amount).toFixed(2),
                        activityBudgetId: data[i].activityBudgetId,
                        resourceMDMQ: data[i].resourceMDMQ,
                        ownFunds: data[i].ownFunds,
                        budgetSpent: data[i].budgetSpent
                    };
                    vm.activityPoaHeadingSubheadings.push(headingAdd);
                }
            });
        }

        vm.plusTotal = plusTotal;

        function plusTotal(headingSubheading) {
            var plus1 = 0;
            if(headingSubheading.resourceMDMQ > 0){
                plus1 = Number(parseFloat(headingSubheading.resourceMDMQ));
            }

            var plus2 = 0;
            if(headingSubheading.ownFunds > 0){
                plus2 = Number(parseFloat(headingSubheading.ownFunds));
            }
            vm.plusTotalResult = parseFloat(plus1 + plus2).toFixed(2);
        }

        vm.cancel = cancel;

        function cancel() {
            $state.go('activity-budget', {product: null, administrativeUnit: null});
        }

        vm.save = save;

        function save(){
            var exist = false;

            for (var i = 0; i < vm.activityPoaHeadingSubheadings.length; i++){
                for (var j = i+1; j < vm.activityPoaHeadingSubheadings.length; j++){
                    if(vm.activityPoaHeadingSubheadings[i].headingSubheadingId == vm.activityPoaHeadingSubheadings[j].headingSubheadingId) {
                        exist = true;
                    }
                }
            }

            if (exist){
                AlertService.error($translate.instant("metroquitoApp.activityBudget.errorDuplicate"));
                $state.go('activity-budget.adjust.detail', {id: vm.activityPoa.id});
                exist = false;
            }else{
                vm.isSaving = true;
                vm.activityPoa.activityPoaHeadingSubheadings = [];
                vm.activityPoa.activityPoaHeadingSubheadings = vm.activityPoaHeadingSubheadings;

                var dataSave = JSON.parse(JSON.stringify(vm.activityPoa));
                ActivityPoa.update(dataSave, onSaveSuccess, onSaveError);
            }

            function onSaveSuccess () {
                AlertService.success($translate.instant("metroquitoApp.activityBudget.budgetOk"));
                $state.go('activity-budget', {product: null, administrativeUnit: null});
                vm.isSaving = false;
            }

            function onSaveError () {
                vm.isSaving = false;
            }
        }
    }
})();
