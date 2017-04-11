(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('ValuedScheduleCompareController', ValuedScheduleCompareController);

    ValuedScheduleCompareController.$inject = ['$scope', '$rootScope', '$stateParams', 'DataUtils', 'entity', 'ValuedSchedule', 'User'];

    function ValuedScheduleCompareController($scope, $rootScope, $stateParams, DataUtils, entity, ValuedSchedule, User) {
        var vm = this;

        vm.comparison = entity;



    }
})();
