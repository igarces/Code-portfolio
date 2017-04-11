(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('CostCenterDeleteController',CostCenterDeleteController);

    CostCenterDeleteController.$inject = ['entity', 'CostCenter', '$state'];

    function CostCenterDeleteController(entity, CostCenter, $state) {
        var vm = this;

        vm.costCenter = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $state.go('cost-center', null, {reload: true});
        }

        function confirmDelete (id) {
            CostCenter.delete({id: id},
                function () {
                    clear();
                });
        }
    }
})();
