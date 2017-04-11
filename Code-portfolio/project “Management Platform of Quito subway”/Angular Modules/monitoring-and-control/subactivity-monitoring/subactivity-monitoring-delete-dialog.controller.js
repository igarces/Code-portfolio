(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('SubactivityMonitoringDeleteController',SubactivityMonitoringDeleteController);

    SubactivityMonitoringDeleteController.$inject = ['$uibModalInstance', 'entity', 'SubactivityMonitoring'];

    function SubactivityMonitoringDeleteController($uibModalInstance, entity, SubactivityMonitoring) {
        var vm = this;

        vm.subactivityMonitoring = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;
        
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            SubactivityMonitoring.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
