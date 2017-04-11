(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('ActivityPoaDetailController', ActivityPoaDetailController);

    ActivityPoaDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'ActivityPoa', 'ProductAU', 'CostCenter', 'Priority', 'HeadingSubheading', 'User'];

    function ActivityPoaDetailController($scope, $rootScope, $stateParams, entity, ActivityPoa, ProductAU, CostCenter, Priority, HeadingSubheading, User) {
        var vm = this;

        vm.activityPoa = entity;
        vm.dateformat = 'dd/MM/yyyy';

        var unsubscribe = $rootScope.$on('metroquitoApp:activityPoaUpdate', function(event, result) {
            vm.activityPoa = result;
        });
        $scope.$on('$destroy', unsubscribe);

        if (vm.activityPoa.id != null){
            vm.activityPoa.activityPoaHeadingSubheadings = [];
            ActivityPoa.queryHeadingSubheadings({activityPoaId: vm.activityPoa.id}, function (data) {
                for (var i = 0; i < data.length; i++){
                    var headingAdd = {
                        headingSubheadingId: data[i].headingSubheadingId,
                        headingSubheadingCode: data[i].headingSubheadingCode,
                        headingSubheadingDesc: data[i].headingSubheadingDesc,
                        amount: parseFloat(data[i].amount).toFixed(2)
                    };
                    vm.activityPoa.activityPoaHeadingSubheadings.push(headingAdd);
                }
            });
        }
    }
})();
