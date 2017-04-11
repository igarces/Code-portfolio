(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('SubactivityMonitoringDetailController', SubactivityMonitoringDetailController);

    SubactivityMonitoringDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'SubactivityMonitoring', 'SubactivityPoa'];

    function SubactivityMonitoringDetailController($scope, $rootScope, $stateParams, entity, SubactivityMonitoring, SubactivityPoa) {
        var vm = this;

        vm.subactivityMonitoring = entity;

        var unsubscribe = $rootScope.$on('metroquitoApp:subactivityMonitoringUpdate', function(event, result) {
            vm.subactivityMonitoring = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
