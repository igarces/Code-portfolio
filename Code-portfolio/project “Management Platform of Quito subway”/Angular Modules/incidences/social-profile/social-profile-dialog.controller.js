(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('SocialProfileDialogController', SocialProfileDialogController);

    SocialProfileDialogController.$inject = ['$timeout', '$scope', '$state', '$translate', 'entity', '$window', 'SocialProfile', 'AlertService', 'InfrastructureTypeNom', 'PropertyTypeNom', 'Gender', 'nomenclatorsConstants'];

    function SocialProfileDialogController ($timeout, $scope, $state, $translate, entity, $window, SocialProfile, AlertService, InfrastructureTypeNom, PropertyTypeNom, Gender, nomenclatorsConstants) {
        var vm = this;

        //functions
        vm.clear = clear;
        vm.save = save;
        vm.changeAffectedEnvironmentCheck = changeAffectedEnvironmentCheck;
        vm.changeInfrastructureType = changeInfrastructureType;
        vm.changePropertyType = changePropertyType;

        //nomenclators
        vm.infrastructuretypenoms = InfrastructureTypeNom.query({'value': ''});
        vm.propertytypenoms = PropertyTypeNom.query();
        vm.genders = Gender.query({'name': ''});

        //variables
        vm.socialProfile = entity;
        // vm.pattern ='[a-zA-Z0-9 \-()]+';
        vm.pattern = '[\\S \-()]+';
        vm.patternWords = '^[a-zA-Zá-úÁ-Ú \\s]+$';
        vm.patternOnlyNumbers = '^[0-9]+$';
        vm.patternNumbers = '^[0-9 \\- \+ \() \\s]+$';
        vm.patternEmail = '^[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{1,5}$';
            //'^[_\'.@A-Za-z0-9-]*$';
        vm.defaultOption = '<Seleccione>';
        vm.infrastructureTypeOtherId = nomenclatorsConstants.infrastructureTypeOtherId;
        vm.propertyTypeOtherId = nomenclatorsConstants.propertyTypeOtherId;
        vm.otherCheck = false;
        if(vm.socialProfile.othersAffected !== null){
            vm.otherCheck = true;
        }

        $timeout(function (){
            angular.element('.form-group:eq(0)>input').focus();
        });

        function clear () {
            $state.go('social-profile', null, {reload: true});
        }

        function save () {

            SocialProfile.validate({identityCard: vm.socialProfile.identityCard, id: vm.socialProfile.id},
                function (data) {
                    if(data.response === true){
                        vm.isSaving = true;
                        if (vm.socialProfile.id !== null) {
                            SocialProfile.update(vm.socialProfile, onSaveSuccess, onSaveError);
                        } else {
                            SocialProfile.save(vm.socialProfile, onSaveSuccess, onSaveError);
                        }
                    }else{
                        AlertService.error($translate.instant("metroquitoApp.socialProfile.invalidIdentityCard"));
                        $window.scrollTo(0,0);
                    }
            });
        }

        function onSaveSuccess (result) {
            $scope.$emit('metroquitoApp:socialProfileUpdate', result);
            vm.isSaving = false;
            clear();
        }

        function onSaveError () {
            vm.isSaving = false;
        }

        function changeAffectedEnvironmentCheck(){
            if(!vm.socialProfile.affectedBusiness){
                vm.socialProfile.businessType = null;
                vm.socialProfile.businessName = null;
            }

            if(!vm.socialProfile.affectedBusiness && !vm.socialProfile.affectedHouse){
                vm.socialProfile.infrastructureTypeId = null;
                vm.socialProfile.otherInfrastructure = null;
                vm.socialProfile.propertyTypeId = null;
                vm.socialProfile.otherProperty = null;
            }

            if(!vm.otherCheck){
                vm.socialProfile.othersAffected = null;
            }
        }

        function changeInfrastructureType(){
            if(vm.socialProfile.infrastructureTypeId !== vm.infrastructureTypeOtherId){
                vm.socialProfile.otherInfrastructure = null;
            }
        }

        function changePropertyType(){
            if(vm.socialProfile.propertyTypeId !== vm.propertyTypeOtherId){
                vm.socialProfile.otherProperty = null;
            }
        }
    }
})();
