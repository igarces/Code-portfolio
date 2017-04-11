(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('CostCenterDetailController', CostCenterDetailController);

    CostCenterDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'CostCenter'];

    function CostCenterDetailController($scope, $rootScope, $stateParams, entity, CostCenter) {
        var vm = this;

        vm.costCenter = entity;

        var unsubscribe = $rootScope.$on('metroquitoApp:costCenterUpdate', function(event, result) {
            vm.costCenter = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
