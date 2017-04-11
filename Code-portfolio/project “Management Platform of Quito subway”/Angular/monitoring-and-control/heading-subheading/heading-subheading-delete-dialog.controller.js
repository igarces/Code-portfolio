(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('HeadingSubheadingDeleteController',HeadingSubheadingDeleteController);

    HeadingSubheadingDeleteController.$inject = ['entity', 'HeadingSubheading', '$state'];

    function HeadingSubheadingDeleteController(entity, HeadingSubheading, $state) {
        var vm = this;

        vm.headingSubheading = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
           $state.go('heading-subheading', null, {reload: true});
        }

        function confirmDelete (id) {
            HeadingSubheading.delete({id: id},
                function () {
                    $state.go('heading-subheading', null, {reload: true});
                });
        }
    }
})();
