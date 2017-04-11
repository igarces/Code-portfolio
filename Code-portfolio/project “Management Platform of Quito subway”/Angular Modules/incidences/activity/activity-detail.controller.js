(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('ActivityDetailController', ActivityDetailController);

    ActivityDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Activity', 'ActivityClassificationNom', 'AdministrativeUnit'];

    function ActivityDetailController($scope, $rootScope, $stateParams, entity, Activity, ActivityClassificationNom, AdministrativeUnit) {
        var vm = this;

        vm.activity = entity;

        var unsubscribe = $rootScope.$on('metroquitoApp:activityUpdate', function(event, result) {
            vm.activity = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
