(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('IncidenceTechnicalDeleteController',IncidenceTechnicalDeleteController);

    IncidenceTechnicalDeleteController.$inject = ['$uibModalInstance', 'entity', 'IncidenceTechnical'];

    function IncidenceTechnicalDeleteController($uibModalInstance, entity, IncidenceTechnical) {
        var vm = this;

        vm.incidenceTechnical = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;
        
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            IncidenceTechnical.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
