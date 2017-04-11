(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('IncidenceStatesDetailController', IncidenceStatesDetailController);

    IncidenceStatesDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'IncidenceStates', 'User', 'IncidenceStateNom', 'IncidenceSocialResp', 'IncidenceTechnical'];

    function IncidenceStatesDetailController($scope, $rootScope, $stateParams, entity, IncidenceStates, User, IncidenceStateNom, IncidenceSocialResp, IncidenceTechnical) {
        var vm = this;

        vm.incidenceStates = entity;

        var unsubscribe = $rootScope.$on('metroquitoApp:incidenceStatesUpdate', function(event, result) {
            vm.incidenceStates = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
