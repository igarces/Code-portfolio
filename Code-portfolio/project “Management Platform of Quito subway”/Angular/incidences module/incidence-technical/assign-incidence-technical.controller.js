(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('AssignIncidenceTechnicalController', AssignIncidenceTechnicalController);

    AssignIncidenceTechnicalController.$inject = ['$state', 'entity', 'IncidenceTechnical', 'User',  'AdministrativeUnit', 'nomenclatorsConstants'];

    function AssignIncidenceTechnicalController($state, entity, IncidenceTechnical, User, AdministrativeUnit, nomenclatorsConstants) {
        var vm = this;

        vm.incidenceTechnical = entity;

        vm.adminUnitGIFId = nomenclatorsConstants.adminUnitGIFId;
        vm.adminUnitEEIId = nomenclatorsConstants.adminUnitEEIId;
        AdministrativeUnit.query({'name': '', 'acronym':''}, function (list) {
            vm.administrativeunits = [];

            for(var index in list){
                if(list[index] && (list[index].id === vm.adminUnitGIFId || list[index].id === vm.adminUnitEEIId)){
                    vm.administrativeunits.push(list[index]);
                }
            }
        });
        vm.users = User.query();

        //functions
        vm.save = save;
        vm.cancel = cancel;
        vm.filterUserAdministrativeUnit = filterUserAdministrativeUnit;
        vm.changeAdministrativeUnit = changeAdministrativeUnit;
        assignInitialConfiguration();

        //variables
        vm.defaultOption = '<Seleccione>';

        function assignInitialConfiguration() {
            vm.responsibleReadOnly = false;
            vm.initialUser = vm.incidenceTechnical.responsibleId;
            vm.initialAdministrativeUnit = vm.incidenceTechnical.administrativeUnitResponsibleId;
        }

        function save() {
            if(vm.initialUser === vm.incidenceTechnical.responsibleId){
                cancel();
            }else{
                if (vm.incidenceTechnical.id !== null) {
                    IncidenceTechnical.assign(vm.incidenceTechnical, onSaveSuccess, onSaveError);
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
            $state.go('incidence-technical', null, {reload: true});
        }

        function filterUserAdministrativeUnit(item) {
            if(vm.incidenceTechnical.administrativeUnitResponsibleId !== null && item.adminUnitId === vm.incidenceTechnical.administrativeUnitResponsibleId){

                if(vm.responsibleReadOnly){
                    if(item.responsible && (vm.incidenceTechnical.responsibleId === null || vm.incidenceTechnical.responsibleId === undefined)){
                        vm.incidenceTechnical.responsibleId = item.id;
                    }
                }
                return true;

            }
            return false;
        }

        function changeAdministrativeUnit() {
            if(vm.incidenceTechnical.administrativeUnitResponsibleId != vm.initialAdministrativeUnit){
                vm.responsibleReadOnly = true;
            }else{
                vm.responsibleReadOnly = false;
                vm.incidenceTechnical.responsibleId = vm.initialUser;
            }
        }
    }
})();
