(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('SubactivityPoaDeleteController',SubactivityPoaDeleteController);

    SubactivityPoaDeleteController.$inject = ['entity', 'SubactivityPoa','$state'];

    function SubactivityPoaDeleteController(entity, SubactivityPoa, $state) {
        var vm = this;

        vm.subactivityPoa = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $state.go('subactivity-poa', null, {reload: true});
        }

        function confirmDelete (id) {
            SubactivityPoa.delete({id: id},
                function () {
                    $state.go('subactivity-poa', null, {reload: true});
                });
        }
    }
})();
