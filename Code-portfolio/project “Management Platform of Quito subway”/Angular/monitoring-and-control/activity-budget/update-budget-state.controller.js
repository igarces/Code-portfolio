(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('UpdateBudgetStateController', UpdateBudgetStateController);

    UpdateBudgetStateController.$inject = ['$scope', '$state', 'ActivityBudget', 'ActivityPoa', 'AlertService', '$translate','entity'];

    function UpdateBudgetStateController ($scope, $state, ActivityBudget, ActivityPoa, AlertService, $translate, entity) {
        var vm = this;

        vm.generalData = entity[0];
        vm.activityList = [];
        vm.cancel = cancel;
        vm.save = save;
        vm.budgetSpent = 0.00;

        initData();

        function initData() {
            ActivityPoa.search({
                page: 0,
                size: 100000,
                description: null,
                fromDate: null,
                toDate: null,
                responsible: null,
                administrativeUnit: vm.generalData.adminUnit.id,
                productId: vm.generalData.product.id,
                sort: 'id,asc'
            }, onSuccess, onError);

            function onSuccess(data) {
                vm.activityList = [];
                if (data != null){
                    for (var j = 0; j < data.length; j++){
                        var activityPoa = data[j];
                        vm.activityPoaHeadingSubheadings = [];
                        ActivityPoa.queryHeadingSubheadings({activityPoaId: activityPoa.id}, function (result) {

                            for (var i = 0; i < result.length; i++){

                                var headingAdd = {
                                    id: result[i].id,
                                    headingSubheadingId: result[i].headingSubheadingId,
                                    activityPoaId: result[i].activityPoaId,
                                    headingSubheadingCode: result[i].headingSubheadingCode,
                                    headingSubheadingDesc: result[i].headingSubheadingDesc,
                                    amount: parseFloat(result[i].amount).toFixed(2),
                                    activityBudgetId: result[i].activityBudgetId,
                                    resourceMDMQ: result[i].resourceMDMQ,
                                    ownFunds: result[i].ownFunds,
                                    budgetSpent: parseFloat(result[i].budgetSpent).toFixed(2),
                                    budgetToSpent: parseFloat(0.00).toFixed(2)
                                };

                                vm.activityPoaHeadingSubheadings.push(headingAdd);
                            }
                        });
                        activityPoa.activityPoaHeadingSubheadings = vm.activityPoaHeadingSubheadings;
                        vm.activityList.push(activityPoa);
                    }
                }

            }
            function onError(error) {
                AlertService.error(error.data.message);
            }
        }

        vm.assingSpent = assingSpent;

        function assingSpent(heading){

            if(heading.budgetToSpent > heading.resourceMDMQ + heading.ownFunds - heading.budgetSpent){
                heading.budgetSpent = heading.budgetSpent*1 + (heading.resourceMDMQ*1 + heading.ownFunds*1 - heading.budgetSpent*1);
                heading.budgetToSpent = parseFloat(0.00).toFixed(2);
            }else{
                heading.budgetSpent = heading.budgetSpent*1 + heading.budgetToSpent*1;
            }
        }

        function cancel() {
            $state.go('activity-budget', {product: null, administrativeUnit: null});
        }

        function save(){
            vm.isSaving = true;
            var dataSave = JSON.parse(JSON.stringify(vm.activityList));
            ActivityPoa.updateList(dataSave, onSaveSuccess, onSaveError);

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
