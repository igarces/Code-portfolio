(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('ValuedScheduleDialogController', ValuedScheduleDialogController);

    ValuedScheduleDialogController.$inject = ['$timeout', '$scope', '$stateParams', 'DataUtils', 'entity', 'ValuedSchedule', 'User', '$state'];

    function ValuedScheduleDialogController ($timeout, $scope, $stateParams, DataUtils, entity, ValuedSchedule, User, $state) {
        var vm = this;

        vm.valuedSchedule = entity;
        vm.cancel = cancel;
        vm.datePickerOpenStatus = {};
        vm.openCalendar = openCalendar;
        vm.byteSize = DataUtils.byteSize;
        vm.openFile = DataUtils.openFile;
        vm.save = save;
        vm.users = User.query();

        $timeout(function (){
            angular.element('.form-group:eq(0)>input').focus();
        });

        function cancel () {
            $state.go('valued-schedule', null, {reload: true});
        }

        function save () {
            vm.isSaving = true;
            if (vm.valuedSchedule.id !== null) {
                ValuedSchedule.update(vm.valuedSchedule, onSaveSuccess, onSaveError);
            } else {
                ValuedSchedule.save(vm.valuedSchedule, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('metroquitoApp:valuedScheduleUpdate', result);
            $state.go('valued-schedule', null, {reload: true});
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }

        vm.datePickerOpenStatus.registrationDate = false;

        vm.setFile = function ($file, valuedSchedule) {
            if ($file && $file.$error === 'pattern') {
                return;
            }
            if ($file) {
                DataUtils.toBase64($file, function(base64Data) {
                    $scope.$apply(function() {
                        valuedSchedule.file = base64Data;
                        valuedSchedule.fileContentType = 'csv';
                    });
                });
            }
        };

        function openCalendar (date) {
            vm.datePickerOpenStatus[date] = true;
        }
    }
})();
