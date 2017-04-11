(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('PoaDeleteController',PoaDeleteController);

    PoaDeleteController.$inject = ['entity', 'Poa', '$state'];

    function PoaDeleteController(entity, Poa, $state) {
        var vm = this;

        vm.poa = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $state.go('poa', null, {reload: true});
        }

        function confirmDelete (id) {
            Poa.delete({id: id},
                function () {
                    $state.go('poa', null, {reload: true});
                });
        }
    }
})();
