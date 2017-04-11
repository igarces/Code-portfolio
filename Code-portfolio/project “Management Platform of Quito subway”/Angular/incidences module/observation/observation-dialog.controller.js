(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('ObservationDialogController', ObservationDialogController);

    ObservationDialogController.$inject = ['$timeout', '$scope', '$stateParams', 'DataUtils', 'entity', 'Observation', 'User', 'IncidenceSocialResp', 'IncidenceTechnical', 'Principal', '$state', 'IncidenceSocialRespUtil'];

    function ObservationDialogController ($timeout, $scope, $stateParams, DataUtils, entity, Observation, User, IncidenceSocialResp, IncidenceTechnical, Principal, $state, IncidenceSocialRespUtil) {
        var vm = this;

        vm.observation = entity;

        //functions
        vm.clear = clear;
        vm.byteSize = DataUtils.byteSize;
        vm.openFile = DataUtils.openFile;
        vm.save = save;
        // vm.users = User.query();

        //variables
        vm.patternNewLine = '[\\S \\n \-()]+';
        vm.pattern = '[\\S \-()]+';
        // vm.incidenceSocialRespId = IncidenceSocialResp.incidenceId;
        // vm.incidenceTechnicalId = IncidenceTechnical.incidenceId;

        //initial methods
        getIntialObservationsData();


        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function getIntialObservationsData() {
            if($stateParams.type === 'rs'){
                vm.incidenceSocialRespId = $stateParams.incId;
                vm.incidenceTechnicalId = null;
            }
            if($stateParams.type === 'tc'){
                vm.incidenceTechnicalId = $stateParams.incId;
                vm.incidenceSocialRespId = null;
            }

            if(vm.observation.id === null){
                Principal.identity().then(function (account) {
                    User.get({login: account.login}, function (result) {
                       vm.observation.authorId = result.id;
                       vm.userLogged = result.firstName + ' ' + result.lastName;
                    });
                });
            }else{
                User.query(function (result) {
                    vm.users = result;
                    vm.userLogged = getUserName(vm.observation.authorId);
                });
            }
        }

        function getUserName(id){
            var userObject = IncidenceSocialRespUtil.getUser(vm.users, id);
            if(userObject !== null){
                return userObject.firstName + ' ' + userObject.lastName;
            }
        }

        function clear () {
            if(vm.incidenceSocialRespId !== null && vm.incidenceSocialRespId !== undefined ){
                $state.go('incidence-social-resp.edit', {id:vm.incidenceSocialRespId}, {reload: true});
            }
            if(vm.incidenceTechnicalId !== null && vm.incidenceTechnicalId !== undefined ){
                $state.go('incidence-technical.edit', {id:vm.incidenceTechnicalId}, {reload: true});
            }
        }

        function save () {
            if(vm.incidenceSocialRespId !== null && vm.incidenceSocialRespId !== undefined ){
                vm.observation.incidenceSocialRespsId = vm.incidenceSocialRespId;
            }
            if(vm.incidenceTechnicalId !== null && vm.incidenceTechnicalId !== undefined && vm.incidenceTechnicalId !== ''){
                vm.observation.incidenceTechnicalsId = vm.incidenceTechnicalId;
            }

            vm.isSaving = true;
            if (vm.observation.id !== null) {
                Observation.update(vm.observation, onSaveSuccess, onSaveError);
            } else {
                Observation.save(vm.observation, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('metroquitoApp:observationUpdate', result);
            vm.isSaving = false;
            clear();
        }

        function onSaveError () {
            vm.isSaving = false;
        }


        vm.setEvidence = function ($file, observation) {
            if ($file && $file.$error === 'pattern') {
                return;
            }
            if ($file) {
                DataUtils.toBase64($file, function(base64Data) {
                    $scope.$apply(function() {
                        observation.evidence = base64Data;
                        observation.evidenceContentType = $file.type;
                    });
                });
            }
        };

    }
})();
