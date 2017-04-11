(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('ObservationDetailController', ObservationDetailController);

    ObservationDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'DataUtils', 'entity', 'Observation', 'User', 'IncidenceSocialResp', 'IncidenceTechnical', '$state'];

    function ObservationDetailController($scope, $rootScope, $stateParams, DataUtils, entity, Observation, User, IncidenceSocialResp, IncidenceTechnical, $state) {
        var vm = this;

        vm.observation = entity;
        vm.byteSize = DataUtils.byteSize;
        vm.openFile = DataUtils.openFile;

        getInitialData();
        getAuthorName();

        function getInitialData() {
            if($stateParams.type === 'rs'){
                vm.incidenceSocialRespId = $stateParams.incId;
                vm.incidenceTechnicalId = null;
            }
            if($stateParams.type === 'tc'){
                vm.incidenceTechnicalId = $stateParams.incId;
                vm.incidenceSocialRespId = null;
            }

            if($stateParams.type === 'rsD'){
                vm.incidenceSocialRespIdForDetails = $stateParams.incId;
                vm.incidenceTechnicalIdForDetails = null;
            }

            if($stateParams.type === 'tcD'){
                vm.incidenceTechnicalIdForDetails = $stateParams.incId;
                vm.incidenceSocialRespIdForDetails = null;
            }
        }

        vm.back = function () {
            if(vm.incidenceSocialRespId !== null && vm.incidenceSocialRespId !== undefined){
                $state.go('incidence-social-resp.edit', {id:vm.incidenceSocialRespId}, {reload: false});
            }
            if(vm.incidenceSocialRespIdForDetails !== null && vm.incidenceSocialRespIdForDetails !== undefined){
                $state.go('incidence-social-resp-detail', {id:vm.incidenceSocialRespIdForDetails}, {reload: false});
            }
            if(vm.incidenceTechnicalId !== null && vm.incidenceTechnicalId !== undefined){
                $state.go('incidence-technical.edit', {id:vm.incidenceTechnicalId}, {reload: false});
            }
            if(vm.incidenceTechnicalIdForDetails !== null && vm.incidenceTechnicalIdForDetails !== undefined){
                $state.go('incidence-technical-detail', {id:vm.incidenceTechnicalIdForDetails}, {reload: false});
            }
        }

        function getAuthorName() {
            User.getId({id: vm.observation.authorId}, function (result) {
                vm.userAuthorName = result.firstName + ' ' + result.lastName;
            });
        }
    }
})();
