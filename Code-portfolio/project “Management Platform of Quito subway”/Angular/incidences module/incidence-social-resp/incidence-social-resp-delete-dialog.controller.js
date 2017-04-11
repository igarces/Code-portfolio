(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('IncidenceSocialRespDeleteController',IncidenceSocialRespDeleteController);

    IncidenceSocialRespDeleteController.$inject = ['$uibModalInstance', 'entity', 'IncidenceSocialResp'];

    function IncidenceSocialRespDeleteController($uibModalInstance, entity, IncidenceSocialResp) {
        var vm = this;

        vm.incidenceSocialResp = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;
        
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            IncidenceSocialResp.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
