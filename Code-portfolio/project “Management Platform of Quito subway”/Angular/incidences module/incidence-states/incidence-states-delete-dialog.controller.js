(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('IncidenceStatesDeleteController',IncidenceStatesDeleteController);

    IncidenceStatesDeleteController.$inject = ['$uibModalInstance', 'entity', 'IncidenceStates'];

    function IncidenceStatesDeleteController($uibModalInstance, entity, IncidenceStates) {
        var vm = this;

        vm.incidenceStates = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;
        
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            IncidenceStates.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
