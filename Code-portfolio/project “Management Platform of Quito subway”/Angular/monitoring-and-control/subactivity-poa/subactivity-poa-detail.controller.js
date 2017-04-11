(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('SubactivityPoaDetailController', SubactivityPoaDetailController);

    SubactivityPoaDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'SubactivityPoa', 'ProcessStation', 'Priority', 'User', 'ActivityBreakdown', 'ActivityPoa'];

    function SubactivityPoaDetailController($scope, $rootScope, $stateParams, entity, SubactivityPoa, ProcessStation, Priority, User, ActivityBreakdown, ActivityPoa) {
        var vm = this;

        vm.subactivityPoa = entity;
        vm.dateformat = 'dd/MM/yyyy';

        var unsubscribe = $rootScope.$on('metroquitoApp:subactivityPoaUpdate', function(event, result) {
            vm.subactivityPoa = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
