(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('AttachedDocumentDialogController', AttachedDocumentDialogController);

    AttachedDocumentDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'DataUtils', 'entity', 'AttachedDocument', 'Report'];

    function AttachedDocumentDialogController ($timeout, $scope, $stateParams, $uibModalInstance, DataUtils, entity, AttachedDocument, Report) {
        var vm = this;

        vm.attachedDocument = entity;
        vm.clear = clear;
        vm.byteSize = DataUtils.byteSize;
        vm.openFile = DataUtils.openFile;
        vm.save = save;
        vm.reports = Report.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.attachedDocument.id !== null) {
                AttachedDocument.update(vm.attachedDocument, onSaveSuccess, onSaveError);
            } else {
                AttachedDocument.save(vm.attachedDocument, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('metroquitoApp:attachedDocumentUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


        vm.setContentFile = function ($file, attachedDocument) {
            if ($file) {
                DataUtils.toBase64($file, function(base64Data) {
                    $scope.$apply(function() {
                        attachedDocument.contentFile = base64Data;
                        attachedDocument.contentFileContentType = $file.type;
                    });
                });
            }
        };

    }
})();
