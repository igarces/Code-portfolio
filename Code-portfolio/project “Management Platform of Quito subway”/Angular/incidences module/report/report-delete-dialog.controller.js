(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('ReportDeleteController',ReportDeleteController);

    ReportDeleteController.$inject = ['$state', 'entity', 'Report'];

    function ReportDeleteController($state, entity, Report) {
        var vm = this;

        vm.report = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $state.go('report', null, {reload: true});
        }

        function confirmDelete (id) {
            Report.delete({id: id},
                function () {
                    clear();
                });
        }
    }
})();
