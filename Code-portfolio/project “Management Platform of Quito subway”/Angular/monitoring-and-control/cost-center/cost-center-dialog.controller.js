(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('CostCenterDialogController', CostCenterDialogController);

    CostCenterDialogController.$inject = ['$timeout', '$scope', '$state', '$stateParams', 'entity', 'CostCenter', 'AlertService', '$translate'];

    function CostCenterDialogController ($timeout, $scope, $state, $stateParams, entity, CostCenter, AlertService, $translate) {
        var vm = this;

        vm.costCenter = entity;
        vm.cancel = cancel;
        vm.save = save;
        vm.patternNumbers = '^[0-9]+$';
        vm.patternWords = '^[a-zA-Zá-úÁ-Ú \\s]+$';

        $timeout(function (){
            angular.element('.form-group:eq(0)>input').focus();
        });

        function cancel () {
            $state.go('cost-center', null,  {reload: true});
        }

        function save () {
            CostCenter.validate(
                {
                    id: vm.costCenter.id,
                    code: vm.costCenter.code,
                    description: vm.costCenter.description
                },
                function (data) {
                    if(data.response === true){
                        vm.isSaving = true;
                        if (vm.costCenter.id !== null) {
                            CostCenter.update(vm.costCenter, onSaveSuccess, onSaveError);
                        } else {
                            CostCenter.save(vm.costCenter, onSaveSuccess, onSaveError);
                        }
                    }else{
                        if (vm.costCenter.id !== null) {
                            AlertService.error($translate.instant("metroquitoApp.costCenter.invalidModification"));
                        }else{
                            AlertService.error($translate.instant("metroquitoApp.costCenter.invalidCreation"));
                        }
                    }
                });
        }

        function onSaveSuccess (result) {
            $scope.$emit('metroquitoApp:costCenterUpdate', result);
            vm.isSaving = false;
            cancel();
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
