(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('PoaAuditsDetailController', PoaAuditsDetailController);

    PoaAuditsDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'PoaAudits', 'User'];

    function PoaAuditsDetailController($scope, $rootScope, $stateParams, entity, PoaAudits, User) {
        var vm = this;

        vm.poaAudits = entity;

        var unsubscribe = $rootScope.$on('metroquitoApp:poaAuditsUpdate', function(event, result) {
            vm.poaAudits = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
