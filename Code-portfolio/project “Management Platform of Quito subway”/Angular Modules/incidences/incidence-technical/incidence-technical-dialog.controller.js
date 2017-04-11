(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('IncidenceTechnicalDialogController', IncidenceTechnicalDialogController);

    IncidenceTechnicalDialogController.$inject = ['$timeout', '$scope', '$state', '$stateParams','DataUtils', 'entity', 'IncidenceTechnical',
        'User', 'AdministrativeUnit', 'IncidenceStateNom', 'Observation', 'Report', 'Principal', 'nomenclatorsConstants'];

    function IncidenceTechnicalDialogController ($timeout, $scope, $state, $stateParams, DataUtils, entity, IncidenceTechnical,
         User, AdministrativeUnit, IncidenceStateNom, Observation, Report, Principal, nomenclatorsConstants) {

        var vm = this;
        vm.ficticeId = $state.params.id;
        //Incidence State Nom
        vm.incidenceStateOpenId = nomenclatorsConstants.incidenceStateOpenId;
        vm.incidenceStateAssignedId = nomenclatorsConstants.incidenceStateAssignedId;
        vm.incidenceStateProcessingId = nomenclatorsConstants.incidenceStateProcessingId;
        vm.incidenceStateCloseId = nomenclatorsConstants.incidenceStateCloseId;
        vm.adminUnitGIFId = nomenclatorsConstants.adminUnitGIFId;
        vm.adminUnitEEIId = nomenclatorsConstants.adminUnitEEIId;

        getIncidenceTechnical();

        //nomenclators
        vm.users = User.query();
        AdministrativeUnit.query({'name': '', 'acronym':''}, function (list) {
            vm.administrativeunits = [];

            for(var index in list){
                if(list[index] && (list[index].id === vm.adminUnitGIFId || list[index].id === vm.adminUnitEEIId)){
                    vm.administrativeunits.push(list[index]);
                }
            }
        });
        vm.incidencestatenoms = IncidenceStateNom.query();

        //variables
        vm.pattern = '[\\S \-()]+';
        vm.patternNewLine = '[\\S \\n \-()]+';
        vm.defaultOption = '<Seleccione>';
        vm.userFunctionary = null;
        vm.userLogged = null;
        vm.userLoggedId = null;
        vm.responsibleReadOnly = false;
        vm.administrativeUnitReadOnly = false;
        vm.loadDefaultUser = false;
        vm.reportId = $state.params.reportId;
        vm.goSave = true;
        vm.dateformat = 'dd/MM/yyyy';
        vm.incidenceStateId = null;

        getUserLogged();

        //functions
        vm.clear = clear;
        vm.byteSize = DataUtils.byteSize;
        vm.openFile = DataUtils.openFile;
        vm.save = save;
        vm.changeAdministrativeUnit = changeAdministrativeUnit;
        vm.showHidePanel = showHidePanel;
        vm.createObservations = createObservations;
        //vm.getUserName = getUserName;
        vm.editObservations = editObservations;
        vm.detailObservations = detailObservations;
        vm.filterStatus = filterStatus;

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function getIncidenceTechnical() {
            vm.incidenceTechnical = entity;

            vm.initialIncidence = false;
            vm.incidenceInProcess = false;
            vm.showIncidenceData = true;
            vm.showObservations = false;

            if(vm.ficticeId === '0'){
                vm.incidenceTechnical = Report.incidenceTechnical;
            }

            if(vm.incidenceTechnical.functionaryId !== null && vm.incidenceTechnical.functionaryId !== undefined){
                User.getId({id: vm.incidenceTechnical.functionaryId}, function (result) {
                    vm.userFunctionaryName = result.firstName + ' ' + result.lastName;
                    vm.userFunctionary = result;

                    // if((result.adminUnitId === vm.adminUnitGIFId || result.adminUnitId === vm.adminUnitEEIId) &&
                    //     (result.responsible === false || result.responsible === null)){
                    //    vm.administrativeUnitReadOnly = true;
                    // }
                    //
                    if(result.adminUnitId !== vm.incidenceTechnical.administrativeUnitResponsibleId){
                        vm.responsibleReadOnly = true;
                    }
                });
            }

            if(vm.incidenceTechnical.incidenceStateId === null ||
                vm.incidenceTechnical.incidenceStateId === vm.incidenceStateOpenId){
                vm.initialIncidence = true;
            }

            if(vm.incidenceTechnical.incidenceStateId === vm.incidenceStateAssignedId){
                vm.showIncidenceData = false;
                vm.showObservations = true;
                vm.showObservationEdit = true;
                getAdministrativeUnit();
                getObservations();
            }

            if(vm.incidenceTechnical.incidenceStateId === vm.incidenceStateProcessingId){
                vm.showIncidenceData = false;
                vm.showObservations = true;
                vm.showObservationEdit = true;
                vm.incidenceInProcess = true;
                getAdministrativeUnit();
                getObservations();
            }

            if(vm.incidenceTechnical.incidenceStateId === vm.incidenceStateCloseId){
                vm.showIncidenceData = false;
                vm.showObservations = true;
                vm.showObservationEdit = false;
                vm.incidenceInProcess = true;
                getObservations();
            }

        }

        function getUserLogged() {
            Principal.identity().then(function (account) {
                User.get({login: account.login}, function (result) {
                    vm.userLogged = result;
                    vm.userLoggedId = result.id;

                    if(vm.incidenceTechnical.functionaryId === null || vm.incidenceTechnical.functionaryId === undefined){
                        vm.incidenceTechnical.functionaryId = result.id;
                        vm.userFunctionaryName = result.firstName + ' ' + result.lastName;
                        vm.userFunctionary = result;

                        if(result.adminUnitId !== null && result.adminUnitId !== undefined &&
                            (result.adminUnitId === vm.adminUnitGIFId || result.adminUnitId === vm.adminUnitEEIId)){
                            vm.incidenceTechnical.administrativeUnitResponsibleId = result.adminUnitId;
                            vm.incidenceTechnical.responsibleId = result.id;
                        }

                        // if((result.adminUnitId === vm.adminUnitGIFId || result.adminUnitId === vm.adminUnitEEIId) &&
                        //     (result.responsible === false || result.responsible === null)){
                        //     vm.administrativeUnitReadOnly = true;
                        // }
                    }
                });
            });
        }

        function clear () {
            Report.incidenceTechnical = null;
            redirect();
        }

        function redirect() {
            if(vm.reportId === '-1' && vm.incidenceTechnical.id === null){
                $state.go('report.new', null, {reload: true});
            }else{
                if(vm.reportId !== '-1' && vm.reportId !== ''){
                    $state.go('report.edit', {id: vm.reportId}, {reload: true});
                }else{
                    $state.go('incidence-technical', null, {reload: true});
                }
            }
        }

        function save () {
            if(vm.goSave){
                vm.isSaving = true;
                vm.incidenceTechnical.addHistory = false;
                vm.incidenceTechnical.userLoggedId = vm.userLogged.id;

                if(vm.incidenceTechnical.incidenceStateId === null){
                    vm.incidenceTechnical.incidenceStateId = vm.incidenceStateOpenId;
                    vm.incidenceTechnical.addHistory = true;
                }

                if(vm.incidenceTechnical.incidenceStateId === vm.incidenceStateAssignedId){
                    vm.incidenceTechnical.incidenceStateId = vm.incidenceStateProcessingId;
                    vm.incidenceTechnical.addHistory = true;
                }

                if(vm.incidenceInProcess && vm.incidenceStateId === vm.incidenceStateCloseId){
                    vm.incidenceTechnical.incidenceStateId = vm.incidenceStateCloseId;
                    vm.incidenceTechnical.endDate = new Date();
                    vm.incidenceTechnical.addHistory = true;
                }

                if(vm.incidenceTechnical.reportsId === null && vm.reportId !== '-1' && vm.reportId !== '') {
                    vm.incidenceTechnical.reportsId = vm.reportId;
                }

                if(vm.reportId === '-1' && vm.incidenceTechnical.id === null){
                    Report.incidenceTechnical = vm.incidenceTechnical;
                    redirect();
                }else{
                    saveIncidenceTechnical();
                }
            }else{
                vm.goSave = true;
            }
        }

        function saveIncidenceTechnical() {
            if (vm.incidenceTechnical.id !== null) {
                IncidenceTechnical.update(vm.incidenceTechnical, onSaveSuccess, onSaveError);
            } else {
                IncidenceTechnical.save(vm.incidenceTechnical, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('metroquitoApp:incidenceTechnicalUpdate', result);
            vm.isSaving = false;
                redirect();
        }

        function onSaveError () {
            vm.isSaving = false;
        }

        vm.setPhoto = function ($file, incidenceTechnical) {
            if ($file && $file.$error === 'pattern') {
                return;
            }
            if ($file) {
                DataUtils.toBase64($file, function(base64Data) {
                    $scope.$apply(function() {
                        incidenceTechnical.photo = base64Data;
                        incidenceTechnical.photoContentType = $file.type;
                    });
                });
            }
        };

        vm.filterUserUnidadAdministrativa = function (item) {
            if(vm.incidenceTechnical.administrativeUnitResponsibleId !== null && item.adminUnitId === vm.incidenceTechnical.administrativeUnitResponsibleId){
                if(item.id === vm.incidenceTechnical.responsibleId){
                    vm.incidenceTechnical.responsible = item;
                }

                if(item.adminUnitId === vm.userLogged.adminUnitId){
                    if(vm.userLogged.responsible){

                        if(item.responsible && vm.incidenceTechnical.responsibleId == null) {
                            vm.incidenceTechnical.responsibleId = item.id;
                        }

                        return true;
                    }else{
                        if(item.id === vm.userLogged.id || item.responsible){
                            return true;
                        }
                    }
                }else{
                    if(item.responsible){
                        if(vm.incidenceTechnical.responsibleId == null) {
                            vm.incidenceTechnical.responsibleId = item.id;
                        }
                        vm.responsibleReadOnly = true;
                        return true;
                    }
                }

            }
            return false;
        }

        function changeAdministrativeUnit() {
            vm.loadDefaultUser = false;
            vm.responsibleReadOnly = false;
            if(vm.userFunctionary !== null && vm.incidenceTechnical.administrativeUnitResponsibleId !== null &&
                vm.incidenceTechnical.administrativeUnitResponsibleId !== vm.userFunctionary.adminUnitId){
                vm.loadDefaultUser = true;
            }

            if(vm.userFunctionary !== null && vm.incidenceTechnical.administrativeUnitResponsibleId !== null &&
                vm.incidenceTechnical.administrativeUnitResponsibleId === vm.userFunctionary.adminUnitId){
                vm.incidenceTechnical.responsibleId = vm.userFunctionary.id;
            }
        }

        function getAdministrativeUnit() {
            AdministrativeUnit.get({id: vm.incidenceTechnical.administrativeUnitResponsibleId}, function (result) {
                vm.administrativeUnitName = result.name;
            });
        }

        function getObservations() {
            vm.observations = Observation.query({'incidenceId': $stateParams.id, 'owner':'true', 'sort': 'id,desc'});
        }

        function showHidePanel(flagPanel) {
            switch (flagPanel){
                case 1:
                    vm.showIncidenceData = (vm.showIncidenceData)? false: true;
                    break;

                case 2:
                    vm.showObservations = (vm.showObservations)? false: true;
                    break;
            }
        }

        function createObservations(){
            vm.goSave = false;
            $state.go('observation.new', {incId: vm.incidenceTechnical.id, type: 'tc'}, {reload: true});
        }

        function editObservations(observationId) {
            vm.goSave = false;
            // IncidenceTechnical.incidenceId = vm.incidenceTechnical.id;
            // IncidenceTechnical.stateIncidence = vm.incidenceTechnical;
            $state.go('observation.edit', {id: observationId, incId: vm.incidenceTechnical.id, type: 'tc'}, {reload: true});
        }

        function detailObservations(observationId) {
            vm.goSave = false;
            // IncidenceTechnical.incidenceId = vm.incidenceTechnical.id;
            // IncidenceTechnical.stateIncidence = vm.incidenceTechnical;
            $state.go('observation-detail', {id: observationId, incId: vm.incidenceTechnical.id, type: 'tc'}, {reload: true});
        }

        function filterStatus(item) {
            if(item.id === vm.incidenceStateCloseId){
                return true;
            }
            return false;
        }
    }
})();
