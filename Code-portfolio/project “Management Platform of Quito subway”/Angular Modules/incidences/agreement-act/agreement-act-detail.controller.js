(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('AgreementActDetailController', AgreementActDetailController);

    AgreementActDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'DataUtils', 'entity', 'AgreementAct', 'IncidenceSocialResp'];

    function AgreementActDetailController($scope, $rootScope, $stateParams, DataUtils, entity, AgreementAct, IncidenceSocialResp) {
        var vm = this;

        vm.agreementAct = entity;
        vm.byteSize = DataUtils.byteSize;
        vm.openFile = DataUtils.openFile;

        var unsubscribe = $rootScope.$on('metroquitoApp:agreementActUpdate', function(event, result) {
            vm.agreementAct = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
