(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('AgreementActDeleteController',AgreementActDeleteController);

    AgreementActDeleteController.$inject = ['$uibModalInstance', 'entity', 'AgreementAct'];

    function AgreementActDeleteController($uibModalInstance, entity, AgreementAct) {
        var vm = this;

        vm.agreementAct = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;
        
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            AgreementAct.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
