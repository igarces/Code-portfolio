(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('VerificationDialogController', VerificationDialogController);

    VerificationDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$q', 'entity', 'Verification', 'SocialProfile', 'ReportSiteNom', 'StationsNom', 'BetweenTunnelNom', 'IncidenceSocialResp', 'nomenclatorsConstants', 'DataUtils','Principal', 'User', '$state'];

    function VerificationDialogController ($timeout, $scope, $stateParams, $q, entity, Verification, SocialProfile, ReportSiteNom, StationsNom, BetweenTunnelNom, IncidenceSocialResp, nomenclatorsConstants, DataUtils, Principal, User, $state) {
        var vm = this;

        //functions
        vm.verificationResolved = entity;
        vm.clear = clear;
        vm.datePickerOpenStatus = {};
        vm.openCalendar = openCalendar;
        vm.byteSize = DataUtils.byteSize;
        vm.openFile = DataUtils.openFile;
        vm.save = save;
        vm.changeVerificationDate = changeVerificationDate;
        vm.changeVerificationHour = changeVerificationHour;

        getInitialData();
        // vm.socialprofiles = SocialProfile.query();

        //Nomenclators
        vm.reportsitenoms = ReportSiteNom.query();
        vm.stationsnoms = StationsNom.query();
        vm.betweentunnelnoms = BetweenTunnelNom.query();

        // reportSiteNom ids
        vm.reportSiteStationId = nomenclatorsConstants.reportSiteStationId;
        vm.reportSiteOperationsCenterId = nomenclatorsConstants.reportSiteOperationsCenterId;
        vm.reportSiteVentilationShaftsId = nomenclatorsConstants.reportSiteVentilationShaftsId;
        vm.reportSiteTunnelSectionId = nomenclatorsConstants.reportSiteTunnelSectionId;

        //variables
        vm.showAddVerification = true;
        vm.pattern = '[\\S \-()]+';
        vm.patternNewLine = '[\\S \\n \-()]+';
        vm.incidenceSocialRespId = IncidenceSocialResp.incidenceId;
        vm.dateformat = 'dd/MM/yyyy';
        vm.dateHourFormat = 'dd/MM/yyyy H:mm';
        vm.hourformat = 'H:mm';


        // if(vm.incidenceSocialRespId !== null && vm.incidenceSocialRespId !== undefined){
        //     IncidenceSocialResp.get({id: vm.incidenceSocialRespId}, function (result) {
                vm.verificationDateOption = {
                    // minDate: result.incidenceReportDate
                    maxDate: new Date()
                };
        //     });
        // }

        function clear () {
            if(vm.incidenceSocialRespId !== null){
                $state.go('incidence-social-resp.edit', {id:vm.incidenceSocialRespId}, {reload: true});
            }
        }

        function getInitialData() {
            if(vm.verificationResolved.id === null){
                Principal.identity().then(function (account) {
                    User.get({login: account.login}, function (result) {
                        vm.verificationResolved.socialPromoterId = result.id;
                    });
                });
            }
            if(vm.verificationResolved && vm.verificationResolved.verificationDate !== null && vm.verificationResolved.verificationDate !== undefined){
                vm.verificationHour = new Date(vm.verificationResolved.verificationDate);
            }else{
                vm.verificationHour = null;
            }
        }

        function save () {
            vm.isSaving = true;

            vm.verificationResolved.incidenceSocialRespsId = vm.incidenceSocialRespId;
            if (vm.verificationResolved.id !== null) {
                Verification.update(vm.verificationResolved, onSaveSuccess, onSaveError);
            } else {
                Verification.save(vm.verificationResolved, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('metroquitoApp:verificationUpdate', result);
            clear();
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }

        vm.datePickerOpenStatus.verificationDate = false;

        function openCalendar (date) {
            vm.datePickerOpenStatus[date] = true;
        }

        vm.setPhotographicRecord = function ($file, verification) {
            if ($file && $file.$error === 'pattern') {
                return;
            }
            if ($file) {
                DataUtils.toBase64($file, function(base64Data) {
                    $scope.$apply(function() {
                        verification.photographicRecord = base64Data;
                        verification.photographicRecordContentType = $file.type;
                    });
                });
            }
        };

        function changeVerificationDate(){
            if(vm.verificationHour === null || vm.verificationHour === undefined) {
                vm.verificationHour = new Date(vm.verificationResolved.verificationDate);
            }else{
                vm.verificationResolved.verificationDate.setHours(vm.verificationHour.getHours());
                vm.verificationResolved.verificationDate.setMinutes(vm.verificationHour.getMinutes());
            }
        }

        function changeVerificationHour(){
            if(vm.verificationHour !== null && vm.verificationHour !== undefined) {
                vm.verificationResolved.verificationDate.setHours(vm.verificationHour.getHours());
                vm.verificationResolved.verificationDate.setMinutes(vm.verificationHour.getMinutes());
            }else{
                vm.verificationHour = new Date(vm.verificationResolved.verificationDate);
                vm.verificationHour.setHours(0);
                vm.verificationHour.setMinutes(0);
                vm.verificationResolved.verificationDate.setHours(vm.verificationHour.getHours());
                vm.verificationResolved.verificationDate.setMinutes(vm.verificationHour.getMinutes());
            }
        }
    }
})();
