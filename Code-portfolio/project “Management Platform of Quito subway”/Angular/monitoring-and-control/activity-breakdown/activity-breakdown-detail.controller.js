(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('ActivityBreakdownDetailController', ActivityBreakdownDetailController);

    ActivityBreakdownDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'ActivityBreakdown', 'ActivityPoa', 'Subactivity'];

    function ActivityBreakdownDetailController($scope, $rootScope, $stateParams, entity, ActivityBreakdown, ActivityPoa, Subactivity) {
        var vm = this;

        vm.activityBreakdown = entity;

        var unsubscribe = $rootScope.$on('metroquitoApp:activityBreakdownUpdate', function(event, result) {
            vm.activityBreakdown = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
