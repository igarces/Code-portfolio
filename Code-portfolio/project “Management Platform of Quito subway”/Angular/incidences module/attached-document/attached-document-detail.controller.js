(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('AttachedDocumentDetailController', AttachedDocumentDetailController);

    AttachedDocumentDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'DataUtils', 'entity', 'AttachedDocument', 'Report'];

    function AttachedDocumentDetailController($scope, $rootScope, $stateParams, DataUtils, entity, AttachedDocument, Report) {
        var vm = this;

        vm.attachedDocument = entity;
        vm.byteSize = DataUtils.byteSize;
        vm.openFile = DataUtils.openFile;

        var unsubscribe = $rootScope.$on('metroquitoApp:attachedDocumentUpdate', function(event, result) {
            vm.attachedDocument = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
