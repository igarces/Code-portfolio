(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('SocialProfileDetailController', SocialProfileDetailController);

    SocialProfileDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'SocialProfile', 'AttachedDocument', 'SocialProfileUtil', 'Gender', 'InfrastructureTypeNom', 'PropertyTypeNom'];

    function SocialProfileDetailController($scope, $rootScope, $stateParams, entity, SocialProfile, AttachedDocument, SocialProfileUtil, Gender, InfrastructureTypeNom, PropertyTypeNom) {
        var vm = this;

        vm.socialProfile = entity;

        //initial methods
        findSexInList();
        findInfrastructureInList();
        findPropertyInList();

        //variables
        vm.showCompleteDetail = true;
        vm.otherCheck = false;
        if(vm.socialProfile.othersAffected !== null){
            vm.otherCheck = true;
        }

        var unsubscribe = $rootScope.$on('metroquitoApp:socialProfileUpdate', function(event, result) {
            vm.socialProfile = result;
        });
        $scope.$on('$destroy', unsubscribe);

        function findSexInList(){
            Gender.query({'name': ''}, function(data){
                vm.genders = data;
                vm.socialProfileSexValue = SocialProfileUtil.findSexInList(vm.genders, vm.socialProfile.sexId);
            });
        }

        function findInfrastructureInList(){
            InfrastructureTypeNom.query({'value': ''}, function(data){
                vm.infrastructuretypenoms = data;
                vm.socialProfileInfrastructure = SocialProfileUtil.findInfrastructureInList(vm.infrastructuretypenoms, vm.socialProfile.infrastructureTypeId);
            });
        }

        function findPropertyInList() {
            PropertyTypeNom.query(function(data){
                vm.propertytypenoms = data;
                vm.socialProfileProperty = SocialProfileUtil.findPropertyInList(vm.propertytypenoms, vm.socialProfile.propertyTypeId);
            });
        }
    }
})();
