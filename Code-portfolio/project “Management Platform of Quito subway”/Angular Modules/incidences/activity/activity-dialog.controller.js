(function () {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('ActivityDialogController', ActivityDialogController);

    ActivityDialogController.$inject = ['$timeout', '$scope', '$state', 'entity', 'Activity', 'ActivityClassificationNom', 'AdministrativeUnit', 'nomenclatorsConstants'];

    function ActivityDialogController($timeout, $scope, $state, entity, Activity, ActivityClassificationNom, AdministrativeUnit, nomenclatorsConstants) {
        var vm = this;

        vm.activity = entity;
        vm.clear = clear;
        vm.save = save;
        vm.classificationChanged = classificationChanged;
        vm.administrativeUnitChanged = administrativeUnitChanged;
        vm.activityclassificationnoms = ActivityClassificationNom.query();
        vm.administrativeunits =AdministrativeUnit.query({'name': '', 'acronym':''});
        vm.activities = Activity.getAll();
        vm.filterActivity = filterActivity;

        //variables
        vm.disabled = false;
        vm.requiredActivity = true;
        vm.defaultOption = '<Seleccione>';
        vm.classificationActivityId = nomenclatorsConstants.classificationActivityId;
        vm.noEditActivity = false;
        if(vm.activity.id){
            vm.noEditActivity = true;
        }

        //initialMethods
        loadActivitiesFather();

        $timeout(function () {
            angular.element('.form-group:eq(0)>input').focus();
        });

        function clear() {
            $state.go('activity', null, {reload: true});
        }

        function save() {
            vm.isSaving = true;
            if (vm.activity.id !== null) {
                Activity.update(vm.activity, onSaveSuccess, onSaveError);
            } else {
                Activity.save(vm.activity, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess(result) {
            $scope.$emit('metroquitoApp:activityUpdate', result);
            vm.isSaving = false;
            clear();
        }

        function onSaveError() {
            vm.isSaving = false;
        }

        function loadActivitiesFather() {
            if (vm.activity.id) {
                //     vm.activities = Activity.search();
                // }
                // else {
                //     vm.activities = [];
                // }
                classificationChanged();
            }
        }

        function classificationChanged() {
            vm.disabled = vm.activity.classificationId === vm.classificationActivityId  ? true : false;

            if (vm.disabled) {
                vm.activity.activityFatherId = null;
                vm.requiredActivity = false;
            }
            else {
                if (vm.activity.classificationId != null) {
                    vm.requiredActivity = true;
                }
                else vm.requiredActivity = false;
            }

            if (vm.activity.classificationId == null) {
                vm.activity.administrativeUnitId = null;
                vm.activity.activityFatherId = null;
            }
        }

        function administrativeUnitChanged() {
            // vm.activities = Activity.search();
            if (vm.activity.administrativeUnitId == null) {
                vm.activity.activityFatherId = null;
            }
        }

        function filterActivity(item) {
            if(item.classificationId === vm.classificationActivityId && item.administrativeUnitId === vm.activity.administrativeUnitId){
                return true;
            }
            return false;
        }
    }
})();
