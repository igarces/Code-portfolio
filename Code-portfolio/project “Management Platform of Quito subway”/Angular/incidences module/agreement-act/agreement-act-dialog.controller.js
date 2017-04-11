(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('AgreementActDialogController', AgreementActDialogController);

    AgreementActDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'DataUtils', 'entity', 'AgreementAct', 'IncidenceSocialResp'];

    function AgreementActDialogController ($timeout, $scope, $stateParams, $uibModalInstance, DataUtils, entity, AgreementAct, IncidenceSocialResp) {
        var vm = this;

        vm.agreementAct = entity;
        vm.clear = clear;
        vm.byteSize = DataUtils.byteSize;
        vm.openFile = DataUtils.openFile;
        vm.save = save;
        vm.incidencesocialresps = IncidenceSocialResp.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.agreementAct.id !== null) {
                AgreementAct.update(vm.agreementAct, onSaveSuccess, onSaveError);
            } else {
                AgreementAct.save(vm.agreementAct, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('metroquitoApp:agreementActUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


        vm.setAnnexedAct = function ($file, agreementAct) {
            if ($file && $file.$error === 'pattern') {
                return;
            }
            if ($file) {
                DataUtils.toBase64($file, function(base64Data) {
                    $scope.$apply(function() {
                        agreementAct.annexedAct = base64Data;
                        agreementAct.annexedActContentType = $file.type;
                    });
                });
            }
        };

    }
})();
