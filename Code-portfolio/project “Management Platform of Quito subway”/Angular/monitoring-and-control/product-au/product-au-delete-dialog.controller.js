(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('ProductAUDeleteController',ProductAUDeleteController);

    ProductAUDeleteController.$inject = ['entity', 'ProductAU', '$state'];

    function ProductAUDeleteController(entity, ProductAU, $state) {
        var vm = this;

        vm.productAU = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $state.go('product-au', null, {reload: true});
        }

        function confirmDelete (id) {
            ProductAU.delete({id: id},
                function () {
                    $state.go('product-au', null, {reload: true});
                });
        }
    }
})();
