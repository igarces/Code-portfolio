(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('StatusScheduleController', StatusScheduleController);
    StatusScheduleController.$inject = ['$scope', '$state', 'Schedule', 'AlertService'];
    function StatusScheduleController ($scope, $state, Schedule, AlertService) {
        var vm = this;
        vm.noResult = false;
        vm.cancel = cancel;
        loadActiveScheduleData();

        function loadActiveScheduleData(){
            Schedule.state(
                {
                    idSchedule: -1
                },
                onSuccess, onError);
            function onSuccess(data) {
                vm.scheduleDataInfo = data;
            }
            function onError(error) {
                AlertService.error(error.data.message);
            }
        }


        function cancel() {
            $state.go('project-schedule', null, {reload: true});
        }

    }
})();
