(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('IncidenceStatesDialogController', IncidenceStatesDialogController);

    IncidenceStatesDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'IncidenceStates', 'User', 'IncidenceStateNom', 'IncidenceSocialResp', 'IncidenceTechnical'];

    function IncidenceStatesDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, IncidenceStates, User, IncidenceStateNom, IncidenceSocialResp, IncidenceTechnical) {
        var vm = this;

        vm.incidenceStates = entity;
        vm.clear = clear;
        vm.datePickerOpenStatus = {};
        vm.openCalendar = openCalendar;
        vm.save = save;
        vm.users = User.query();
        vm.incidencestatenoms = IncidenceStateNom.query();
        vm.incidencesocialresps = IncidenceSocialResp.query();
        vm.incidencetechnicals = IncidenceTechnical.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.incidenceStates.id !== null) {
                IncidenceStates.update(vm.incidenceStates, onSaveSuccess, onSaveError);
            } else {
                IncidenceStates.save(vm.incidenceStates, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('metroquitoApp:incidenceStatesUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }

        vm.datePickerOpenStatus.date = false;

        function openCalendar (date) {
            vm.datePickerOpenStatus[date] = true;
        }
    }
})();
