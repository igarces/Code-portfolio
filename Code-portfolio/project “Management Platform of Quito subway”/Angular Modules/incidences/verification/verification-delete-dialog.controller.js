(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('VerificationDeleteController',VerificationDeleteController);

    VerificationDeleteController.$inject = ['$uibModalInstance', 'entity', 'Verification'];

    function VerificationDeleteController($uibModalInstance, entity, Verification) {
        var vm = this;

        vm.verification = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;
        
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            Verification.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
