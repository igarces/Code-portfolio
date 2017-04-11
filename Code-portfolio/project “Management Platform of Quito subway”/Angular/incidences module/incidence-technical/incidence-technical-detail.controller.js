(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('IncidenceTechnicalDetailController', IncidenceTechnicalDetailController);

    IncidenceTechnicalDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'DataUtils', 'entity', 'IncidenceTechnical',
        'User', 'AdministrativeUnit', 'IncidenceStates', 'Observation', 'Report', '$state', 'Principal'];

    function IncidenceTechnicalDetailController($scope, $rootScope, $stateParams, DataUtils, entity, IncidenceTechnical,
         User, AdministrativeUnit, IncidenceStates, Observation, Report, $state, Principal) {

        var vm = this;
        vm.ficticeId = $state.params.id;

        getIncidenceTechnical();

        vm.byteSize = DataUtils.byteSize;
        vm.openFile = DataUtils.openFile;
        vm.statesHistories = [];
        vm.dateformat = 'dd/MM/yyyy';
        vm.userFunctionaryName = '';
        vm.administrativeUnitName = '';
        vm.showIncidenceData = true;
        vm.reportId = $state.params.reportId;
        vm.action = $state.params.action;

        //nomenclators
        vm.users = User.query();

        //variables
        vm.showCompleteIncidenceDetail = true;

        //initial methods
        getInitialData();

        //functions
        vm.getUserName = getUserName;
        vm.detailObservations = detailObservations;
        vm.back = back;
        vm.exportIncidence = exportIncidence;

        var unsubscribe = $rootScope.$on('metroquitoApp:incidenceTechnicalUpdate', function(event, result) {
            vm.incidenceTechnical = result;
        });
        $scope.$on('$destroy', unsubscribe);

        function getIncidenceTechnical() {
            vm.incidenceTechnical = entity;

            if(vm.ficticeId === '0'){
                vm.incidenceTechnical = Report.incidenceTechnical;
            }
        }

        function getInitialData() {
            getIncidenceStates();
            getFunctionaryName();
            getAdministrativeUnit();
            getObservations();
            getUserLogged();
        }

        function getIncidenceStates() {
            if(vm.incidenceTechnical.id !== null){
                IncidenceStates.search({
                    sort: 'id,asc',
                    incidenceId: vm.incidenceTechnical.id,
                    owner: true,
                }, onSuccessHistory);

                function onSuccessHistory(result) {
                    vm.statesHistories = result;
                }
            }
        }

        function getFunctionaryName() {
            User.getId({id: vm.incidenceTechnical.functionaryId}, function (result) {
                vm.userFunctionaryName = result.firstName + ' ' + result.lastName;
            });
        }

        function getAdministrativeUnit() {
            if(vm.incidenceTechnical.administrativeUnitResponsibleName !== null &&
                vm.incidenceTechnical.administrativeUnitResponsibleName !== undefined){
                vm.administrativeUnitName = vm.incidenceTechnical.administrativeUnitResponsibleName;
            }else{
                AdministrativeUnit.get({id: vm.incidenceTechnical.administrativeUnitResponsibleId}, function (result) {
                    vm.administrativeUnitName = result.name;
                });
            }
        }

        function getObservations() {
            if(vm.incidenceTechnical.id !== null && vm.incidenceTechnical.incidenceStateId > 1){
                vm.observations = Observation.query({'incidenceId': vm.incidenceTechnical.id, 'owner':'true'});
            }
        }

        function getUserName(id){
            if(id !== null && id !== undefined){
                for(var index in vm.users){
                    if(vm.users[index] && vm.users[index].id === id){
                        return vm.users[index].firstName + ' ' + vm.users[index].lastName;
                    }
                }
            }
        }

        function detailObservations(observationId) {
            // IncidenceTechnical.incidenceIdDetail = vm.incidenceTechnical.id;
            $state.go('observation-detail', {id: observationId, incId: vm.incidenceTechnical.id, type: 'tcD'}, {reload: true});
        }

        function back(){
            Report.incidenceTechnical = null;
            if(vm.reportId === '-1' && vm.incidenceTechnical.id === null){
                $state.go('report.new', null, {reload: true});
            }else{
                if(vm.reportId !== '-1'  && vm.reportId !== ''){

                    if(vm.action === 'view'){
                        $state.go('report-detail', {id: vm.reportId}, {reload: true});
                    }else{
                        $state.go('report.edit', {id: vm.reportId}, {reload: true});
                    }
                }else{
                    $state.go('incidence-technical', null, {reload: true});
                }
            }
        }

        function getUserLogged() {
            Principal.identity().then(function (account) {
                User.get({login: account.login}, function (result) {
                    vm.userLoggedName = result.firstName + ' ' + result.lastName;
                });
            });
        }

        function exportIncidence() {
            IncidenceTechnical.export({incidenceTechnicalId: vm.incidenceTechnical.id, userName: vm.userLoggedName}, function (data) {
                var url = window.URL.createObjectURL(data.response);
                window.open(url, '_blank');
            });
        }
    }
})();
