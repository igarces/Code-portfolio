(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('ActivityBreakdownDeleteController',ActivityBreakdownDeleteController);

    ActivityBreakdownDeleteController.$inject = ['$uibModalInstance', 'entity', 'ActivityBreakdown'];

    function ActivityBreakdownDeleteController($uibModalInstance, entity, ActivityBreakdown) {
        var vm = this;

        vm.activityBreakdown = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;
        
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            ActivityBreakdown.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
