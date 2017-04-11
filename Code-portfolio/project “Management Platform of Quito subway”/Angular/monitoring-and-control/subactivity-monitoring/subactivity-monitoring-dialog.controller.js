(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('SubactivityMonitoringDialogController', SubactivityMonitoringDialogController);

    SubactivityMonitoringDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'SubactivityMonitoring', 'SubactivityPoa'];

    function SubactivityMonitoringDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, SubactivityMonitoring, SubactivityPoa) {
        var vm = this;

        vm.subactivityMonitoring = entity;
        vm.clear = clear;
        vm.datePickerOpenStatus = {};
        vm.openCalendar = openCalendar;
        vm.save = save;
        vm.subactivitypoas = SubactivityPoa.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.subactivityMonitoring.id !== null) {
                SubactivityMonitoring.update(vm.subactivityMonitoring, onSaveSuccess, onSaveError);
            } else {
                SubactivityMonitoring.save(vm.subactivityMonitoring, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('metroquitoApp:subactivityMonitoringUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }

        vm.datePickerOpenStatus.startDate = false;
        vm.datePickerOpenStatus.finalDate = false;

        function openCalendar (date) {
            vm.datePickerOpenStatus[date] = true;
        }
    }
})();
