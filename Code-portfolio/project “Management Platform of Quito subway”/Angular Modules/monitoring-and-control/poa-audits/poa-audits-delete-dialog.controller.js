(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('PoaAuditsDeleteController',PoaAuditsDeleteController);

    PoaAuditsDeleteController.$inject = ['$uibModalInstance', 'entity', 'PoaAudits'];

    function PoaAuditsDeleteController($uibModalInstance, entity, PoaAudits) {
        var vm = this;

        vm.poaAudits = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;
        
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            PoaAudits.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
