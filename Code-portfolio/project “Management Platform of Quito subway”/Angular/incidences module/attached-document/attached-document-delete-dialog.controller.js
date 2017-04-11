(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('AttachedDocumentDeleteController',AttachedDocumentDeleteController);

    AttachedDocumentDeleteController.$inject = ['$uibModalInstance', 'entity', 'AttachedDocument'];

    function AttachedDocumentDeleteController($uibModalInstance, entity, AttachedDocument) {
        var vm = this;

        vm.attachedDocument = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;
        
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            AttachedDocument.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
