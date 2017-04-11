(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('ActivityBreakdownDialogController', ActivityBreakdownDialogController);

    ActivityBreakdownDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'ActivityBreakdown', 'ActivityPoa', 'Subactivity'];

    function ActivityBreakdownDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, ActivityBreakdown, ActivityPoa, Subactivity) {
        var vm = this;

        vm.activityBreakdown = entity;
        vm.clear = clear;
        vm.save = save;
        vm.activitypoas = ActivityPoa.query();
        vm.subactivities = Subactivity.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.activityBreakdown.id !== null) {
                ActivityBreakdown.update(vm.activityBreakdown, onSaveSuccess, onSaveError);
            } else {
                ActivityBreakdown.save(vm.activityBreakdown, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('metroquitoApp:activityBreakdownUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
