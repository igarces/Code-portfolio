(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('ActivityPoaDeleteController',ActivityPoaDeleteController);

    ActivityPoaDeleteController.$inject = ['$state', 'entity', 'ActivityPoa'];

    function ActivityPoaDeleteController($state, entity, ActivityPoa) {
        var vm = this;

        vm.activityPoa = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $state.go('activity-poa', null, {reload: true});
        }

        function confirmDelete (id) {
            ActivityPoa.delete({id: id},
                function () {
                    $state.go('activity-poa', null, {reload: true});
                });
        }
    }
})();
