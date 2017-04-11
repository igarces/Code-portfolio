(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('VerificationDetailController', VerificationDetailController);

    VerificationDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'DataUtils', 'entity', 'Verification', 'SocialProfile', 'ReportSiteNom', 'StationsNom', 'BetweenTunnelNom', 'IncidenceSocialResp', '$state'];

    function VerificationDetailController($scope, $rootScope, $stateParams, DataUtils, entity, Verification, SocialProfile, ReportSiteNom, StationsNom, BetweenTunnelNom, IncidenceSocialResp, $state) {
        var vm = this;

        vm.verificationResolved = entity;
        vm.byteSize = DataUtils.byteSize;
        vm.openFile = DataUtils.openFile;
        vm.showCompleteDetail = true;
        vm.showExportVerificationButton = false;
        vm.incidenceSocialRespId = IncidenceSocialResp.incidenceId;
        vm.incidenceSocialRespIdForDetails = IncidenceSocialResp.incidenceIdDetail;
        vm.back = back;

        var unsubscribe = $rootScope.$on('metroquitoApp:verificationUpdate', function(event, result) {
            vm.verification = result;
        });
        $scope.$on('$destroy', unsubscribe);

        vm.dateformat = 'dd/MM/yyyy';
        vm.hourformat = 'h:mm';

        function back() {
            if(vm.incidenceSocialRespId !== null && vm.incidenceSocialRespId !== undefined){
                $state.go('incidence-social-resp.edit', {id:vm.incidenceSocialRespId}, {reload: true});
            }else if(vm.incidenceSocialRespIdForDetails !== null && vm.incidenceSocialRespIdForDetails !== undefined){
                $state.go('incidence-social-resp-detail', {id:vm.incidenceSocialRespIdForDetails}, {reload: true});
            }
        }
    }
})();
