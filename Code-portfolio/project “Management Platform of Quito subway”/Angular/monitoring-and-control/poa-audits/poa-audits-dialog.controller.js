(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('PoaAuditsDialogController', PoaAuditsDialogController);

    PoaAuditsDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'PoaAudits', 'User'];

    function PoaAuditsDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, PoaAudits, User) {
        var vm = this;

        vm.poaAudits = entity;
        vm.clear = clear;
        vm.datePickerOpenStatus = {};
        vm.openCalendar = openCalendar;
        vm.save = save;
        vm.users = User.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.poaAudits.id !== null) {
                PoaAudits.update(vm.poaAudits, onSaveSuccess, onSaveError);
            } else {
                PoaAudits.save(vm.poaAudits, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('metroquitoApp:poaAuditsUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }

        vm.datePickerOpenStatus.dateHour = false;

        function openCalendar (date) {
            vm.datePickerOpenStatus[date] = true;
        }
    }
})();
