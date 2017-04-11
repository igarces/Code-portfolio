(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('ObservationDeleteController',ObservationDeleteController);

    ObservationDeleteController.$inject = ['$uibModalInstance', 'entity', 'Observation'];

    function ObservationDeleteController($uibModalInstance, entity, Observation) {
        var vm = this;

        vm.observation = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;
        
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            Observation.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
