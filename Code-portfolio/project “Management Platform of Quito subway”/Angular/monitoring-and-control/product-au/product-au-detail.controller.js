(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('ProductAUDetailController', ProductAUDetailController);

    ProductAUDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'ProductAU', 'AdministrativeUnit'];

    function ProductAUDetailController($scope, $rootScope, $stateParams, entity, ProductAU, AdministrativeUnit) {
        var vm = this;

        vm.productAU = entity;

        var unsubscribe = $rootScope.$on('metroquitoApp:productAUUpdate', function(event, result) {
            vm.productAU = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
