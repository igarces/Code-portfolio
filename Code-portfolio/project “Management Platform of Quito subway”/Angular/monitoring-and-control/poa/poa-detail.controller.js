(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('PoaDetailController', PoaDetailController);

    PoaDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Poa', 'PoaType', 'PoaState'];

    function PoaDetailController($scope, $rootScope, $stateParams, entity, Poa, PoaType, PoaState) {
        var vm = this;

        vm.poa = entity;

        var unsubscribe = $rootScope.$on('metroquitoApp:poaUpdate', function(event, result) {
            vm.poa = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
