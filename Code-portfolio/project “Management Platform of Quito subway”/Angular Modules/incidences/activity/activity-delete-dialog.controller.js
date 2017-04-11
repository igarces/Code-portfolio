(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('ActivityDeleteController',ActivityDeleteController);

    ActivityDeleteController.$inject = ['$state', 'entity', 'Activity'];

    function ActivityDeleteController($state, entity, Activity) {
        var vm = this;

        vm.activity = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $state.go('activity', null, {reload: true});
        }

        function confirmDelete (id) {
            Activity.delete({id: id},
                function () {
                    clear();
                });
        }
    }
})();
