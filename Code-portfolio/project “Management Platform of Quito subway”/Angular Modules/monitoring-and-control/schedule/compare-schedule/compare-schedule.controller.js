(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('CompareScheduleController', CompareScheduleController);
    CompareScheduleController.$inject = ['$scope', '$state', 'Schedule', 'AlertService'];
    function CompareScheduleController ($scope, $state, Schedule, AlertService) {
        var vm = this;
        vm.defaultOption = '<Seleccione>';
        vm.scheduleO = {id: ''};
        vm.scheduleD = {id: -1};
        vm.show = false;
        vm.disabled = false;
        vm.cancel = cancel;
        vm.compare = compare;

        loadAllSchedules();

        function compare() {
            vm.show = false;

            if(vm.scheduleO.id == '' || vm.scheduleO.id == null)
                vm.scheduleD.id = -1;

            if(vm.scheduleO.id == '' || vm.scheduleO.id == null
            || vm.scheduleD.id == null || vm.scheduleD.id == -1 || vm.scheduleD.id == '')
                return;

            vm.disabled = true;
            Schedule.state(
                {
                    idSchedule: vm.scheduleO.id
                },
                onSuccess, onError);
            function onSuccess(data) {
                vm.scheduleDataInfoO = data;

                Schedule.state(
                    {
                        idSchedule: vm.scheduleD.id
                    },
                    onSuccess, onError);
                function onSuccess(data) {
                    vm.scheduleDataInfoD = data;
                    vm.show = true;
                    vm.disabled = false;
                }
                function onError(error) {
                    AlertService.error(error.data.message);
                }

            }
            function onError(error) {
                AlertService.error(error.data.message);
            }

        }

        function loadAllSchedules() {
            Schedule.query(onSuccess, onError);
            function onSuccess(data) {
                vm.schedules = data;
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
