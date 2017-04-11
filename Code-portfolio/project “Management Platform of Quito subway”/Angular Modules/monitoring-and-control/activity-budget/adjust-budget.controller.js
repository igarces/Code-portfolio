(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('AdjustActivityBudgetController', AdjustActivityBudgetController);

    AdjustActivityBudgetController.$inject = ['$scope', '$state', 'ActivityBudget', 'HeadingSubheading', 'AlertService', 'ActivityPoa', '$translate', 'entity'];

    function AdjustActivityBudgetController ($scope, $state, ActivityBudget, HeadingSubheading, AlertService, ActivityPoa, $translate, entity) {
        var vm = this;

        vm.generalData = entity;
        console.log('Unidad Administrativa: '+ vm.generalData[0].productName);
        console.log('Producto: '+ vm.generalData[0].adminUnitName);
        vm.headingsubheadings = HeadingSubheading.getAllSubheadings({sort: 'code,asc'});
        vm.activityList = [];
        vm.activityListOriginal = [];
        vm.cancel = cancel;
        vm.save = save;
        vm.plusTotal = plusTotal;
        vm.plusTotalResult = 0.00;

        initData();

        function initData() {

            ActivityPoa.search({
                page: 0,
                size: 100000,
                description: null,
                fromDate: null,
                toDate: null,
                responsible: null,
                administrativeUnit: vm.generalData[0].adminUnit.id,
                productId: vm.generalData[0].product.id,
                sort: 'id,asc'
            }, onSuccess, onError);

            function onSuccess(data, headers) {
                vm.activityListOriginal = data;
                vm.activityList = JSON.parse(JSON.stringify(data));
            }
            function onError(error) {
                AlertService.error(error.data.message);
            }
        }

        function cancel() {
            $state.go('activity-budget', {product: null, administrativeUnit: null});
        }

        vm.ajustDetail = ajustDetail;

        function ajustDetail(id) {
            $state.go('activity-budget.adjust.detail', {id: id});
        }



        vm.referentialAmount = referentialAmount;
        vm.ivaAmount = ivaAmount;
        vm.totalAmount = totalAmount;

        function referentialAmount(activity) {

        }

        function ivaAmount(activity) {

        }

        function totalAmount(activity) {

        }

        function save(){
            var count = 0;
            var listToUpdate = [];

            for(var index in vm.activityList){
                if(vm.activityList[index]){
                   var original = vm.activityListOriginal[index];
                   var actual = vm.activityList[index];

                   if(original.activityBudget.resourceMDMQ !== actual.activityBudget.resourceMDMQ ||
                       original.activityBudget.ownFunds !== actual.activityBudget.ownFunds){

                       var tempObj = {
                           'type': 'budget',
                           'obj': actual
                       }

                       listToUpdate.push(tempObj);
                   }
                   if(original.headingSubheadingId !== actual.headingSubheadingId){

                        var tempObj = {
                            'type': 'act',
                            'obj': actual
                        }

                        listToUpdate.push(tempObj);
                    }
                }
            }

            if(listToUpdate.length === 0){
                $state.go('activity-budget');
            }

            for(var index in listToUpdate){
                if(listToUpdate[index]){

                    if(listToUpdate[index].type === 'budget'){
                        var budget = listToUpdate[index].obj.activityBudget;
                        budget.updateAction = false;
                        ActivityBudget.update(budget, onSaveSuccess, onSaveError);
                    }

                    if(listToUpdate[index].type === 'act'){
                        var act = listToUpdate[index].obj;
                        ActivityPoa.updataActivity(act, onSaveSuccess, onSaveError);
                    }
                }
            }

            function onSaveSuccess (result) {
                count++;
                if(count === listToUpdate.length){
                    AlertService.success($translate.instant("metroquitoApp.activityBudget.budgetOk"));
                    $state.go('activity-budget');
                }
            }

            function onSaveError () {
                AlertService.error(error.data.message);
            }
        }

        function plusTotal(activity) {
            var plus1 = 0;
            if(activity.activityBudget.resourceMDMQ > 0){
                plus1 = Number(parseFloat(activity.activityBudget.resourceMDMQ));
            }

            var plus2 = 0;
            if(activity.activityBudget.ownFunds > 0){
                plus2 = Number(parseFloat(activity.activityBudget.ownFunds));
            }
            vm.plusTotalResult = parseFloat(plus1 + plus2).toFixed(2);
        }
    }
})();
