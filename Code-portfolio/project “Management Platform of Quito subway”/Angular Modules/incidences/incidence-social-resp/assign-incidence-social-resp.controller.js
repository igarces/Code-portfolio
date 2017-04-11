(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('AssignIncidenceSocialRespController', AssignIncidenceSocialRespController);

    AssignIncidenceSocialRespController.$inject = ['$scope', '$rootScope', '$stateParams', '$state', 'entity', 'IncidenceSocialResp', 'User',  'AdministrativeUnit', 'nomenclatorsConstants', 'Principal'];

    function AssignIncidenceSocialRespController($scope, $rootScope, $stateParams, $state, entity, IncidenceSocialResp, User, AdministrativeUnit, nomenclatorsConstants, Principal) {
        var vm = this;

        vm.incidenceSocialResp = entity;
        vm.administrativeunits = AdministrativeUnit.search({'name': '', 'acronym':''});

        vm.usersAdmUnit = [];

        //initial methods
        assignInitialConfiguration();
        getUserLogged();

        //functions
        vm.changeAdministrativeUnit = changeAdministrativeUnit;
        vm.save = save;
        vm.cancel = cancel;

        //variables
        vm.incidenceStateAcceptedId = nomenclatorsConstants.incidenceStateAcceptedId;
        vm.incidenceStateAssignedId = nomenclatorsConstants.incidenceStateAssignedId;
        vm.defaultOption = '<Seleccione>';
        vm.administrativeUnitFlag = false;


        function assignInitialConfiguration() {
            User.query({
                page: 0,
                size: 100000,
                sort: 'firstName,asc'
            }, function (users) {
                vm.users = users;
            });
            vm.unitAdministrativeReadOnly = false;
            vm.responsibleReadOnly = false;

            if(vm.incidenceSocialResp.administrativeUnitResponsibleId !== null){
                vm.unitAdministrativeReadOnly = true;
            }
            vm.initialUser = vm.incidenceSocialResp.responsibleId;
         }

        function changeAdministrativeUnit(){
            vm.administrativeUnitFlag = true;
            vm.incidenceSocialResp.responsibleId = null;
            vm.responsibleReadOnly = false;
        }

        function getUserLogged() {
            Principal.identity().then(function (account) {
                User.get({login: account.login}, function (result) {
                    vm.userLoggedId = result.id;
                    vm.userLoggedAU = result.adminUnitId;
                });
            });
        }

        function save() {
            if(vm.initialUser === vm.incidenceSocialResp.responsibleId){
                cancel();
            }else{
                vm.incidenceSocialResp.incidenceDefinitive = false;
                vm.incidenceSocialResp.userLoggedId = vm.userLoggedId;

                if(vm.incidenceSocialResp.incidenceStateId === vm.incidenceStateAcceptedId){
                    vm.incidenceSocialResp.incidenceDefinitive = true;
                    vm.incidenceSocialResp.incidenceStateTempId = vm.incidenceStateAssignedId;
                    vm.incidenceSocialResp.incidenceStateId = vm.incidenceSocialResp.incidenceStateTempId;
                }
                vm.incidenceSocialResp.updateIncidence = true;
                vm.incidenceSocialResp.verifications = [];

                if (vm.incidenceSocialResp.id !== null) {
                    IncidenceSocialResp.assign(vm.incidenceSocialResp, onSaveSuccess, onSaveError);
                }

                function onSaveSuccess(){
                    cancel();
                }

                function onSaveError(){
                    console.log('error en asignar la incidencia');
                }
            }
        }

        function cancel() {
            $state.go('incidence-social-resp', null, {reload: true});
        }

        vm.filterUserAdministrativeUnit = function (item) {
            if(vm.incidenceSocialResp.administrativeUnitResponsibleId !== null && item.adminUnitId === vm.incidenceSocialResp.administrativeUnitResponsibleId){

                if(vm.administrativeUnitFlag){
                    if(item.adminUnitId === vm.userLoggedAU){
                        if(item.responsible && (vm.incidenceSocialResp.responsibleId === null || vm.incidenceSocialResp.responsibleId === undefined)){
                            vm.incidenceSocialResp.responsibleId = item.id;
                        }

                        return true;
                    }else{
                        if(item.responsible){
                            vm.responsibleReadOnly = true;
                            if(vm.incidenceSocialResp.responsibleId === null || vm.incidenceSocialResp.responsibleId === undefined){
                                vm.incidenceSocialResp.responsibleId = item.id;
                            }

                            return true;
                        }
                    }
                }else{
                    return true;
                }
            }
            return false;
        }
    }
})();
