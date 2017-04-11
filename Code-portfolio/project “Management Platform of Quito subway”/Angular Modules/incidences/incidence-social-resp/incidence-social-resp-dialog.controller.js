(function () {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('IncidenceSocialRespDialogController', IncidenceSocialRespDialogController);

    IncidenceSocialRespDialogController.$inject = ['$timeout', '$scope', '$state', '$stateParams', '$q', 'entity', 'IncidenceSocialResp',
        'User', 'IncidenceTypeNom', 'IncidenceStateNom', 'AdministrativeUnit', 'Verification', 'Observation', 'CategoryNom',
        'AgreementAct', 'Principal', 'nomenclatorsConstants', 'ReportSiteNom', 'Site', 'SocialProfile', 'SocialProfileUtil',
        'Gender', 'InfrastructureTypeNom', 'PropertyTypeNom', 'DataUtils', 'DateUtils', 'IncidenceSocialRespUtil', 'ParseLinks',
        'paginationConstants', '$http', 'NgMap'];

    function IncidenceSocialRespDialogController($timeout, $scope, $state, $stateParams, $q, entity, IncidenceSocialResp,
                                                 User, IncidenceTypeNom, IncidenceStateNom, AdministrativeUnit, Verification, Observation, CategoryNom,
                                                 AgreementAct, Principal, nomenclatorsConstants, ReportSiteNom, Site, SocialProfile, SocialProfileUtil,
                                                 Gender, InfrastructureTypeNom, PropertyTypeNom, DataUtils, DateUtils, IncidenceSocialRespUtil, ParseLinks,
                                                 paginationConstants, $http, NgMap) {
        var vm = this;

        // verification page configuration
        vm.pagingParamsVerification = {
            page: 1,
        };
        vm.itemsPerPage = paginationConstants.itemsPerPage;

        //Incidence type Nom
        vm.incidenceTypeInformationId = nomenclatorsConstants.incidenceTypeInformationId;
        vm.incidenceTypeComplainId = nomenclatorsConstants.incidenceTypeComplainId;
        vm.incidenceTypeClaimId = nomenclatorsConstants.incidenceTypeClaimId;

        //Incidence State Nom
        vm.incidenceStateOpenId = nomenclatorsConstants.incidenceStateOpenId;
        vm.incidenceStateRejectedId = nomenclatorsConstants.incidenceStateRejectedId;
        vm.incidenceStateAcceptedId = nomenclatorsConstants.incidenceStateAcceptedId;
        vm.incidenceStateAcceptedId = nomenclatorsConstants.incidenceStateAcceptedId;
        vm.incidenceStateCloseId = nomenclatorsConstants.incidenceStateCloseId;
        vm.incidenceStateAssignedId = nomenclatorsConstants.incidenceStateAssignedId;
        vm.incidenceStateProcessingId = nomenclatorsConstants.incidenceStateProcessingId;
        vm.incidenceStateResolvedId = nomenclatorsConstants.incidenceStateResolvedId;
        vm.incidenceStateVerifiedId = nomenclatorsConstants.incidenceStateVerifiedId;
        vm.incidenceStateReopenId = nomenclatorsConstants.incidenceStateReopenId;

        //initial methods
        getIncidenceRespSocialObject();
        getVerificationObject();
        getSocialProfileObject();
        getUserLogged();
        initializeVariables();
        getIncidenceStates();

        //Nomenclators
        vm.incidencetypenoms = IncidenceTypeNom.query();
        vm.reportsitenoms = ReportSiteNom.query();
        vm.categorynoms = CategoryNom.query();
        vm.infrastructuretypenoms = InfrastructureTypeNom.query({'value': ''});
        vm.genders = Gender.query({'name': ''});
        vm.propertytypenoms = PropertyTypeNom.query();
        vm.incidencestatenoms = IncidenceStateNom.query();

        //functions
        vm.clear = clear;
        vm.byteSize = DataUtils.byteSize;
        vm.openFile = DataUtils.openFile;
        vm.save = save;
        vm.selectInformant = selectInformant;
        vm.definitive = definitive;
        vm.getIncidenceType = getIncidenceType;
        vm.getSocialPromoterName = getSocialPromoterName;
        vm.getCategory = getCategory;
        vm.showHidePanel = showHidePanel;
        vm.createVerifications = createVerifications;
        vm.editVerifications = editVerifications;
        vm.detailVerifications = detailVerifications;
       // vm.exportIncidence = exportIncidence;
        vm.createObservations = createObservations;
        vm.getUserName = getUserName;
        vm.editObservations = editObservations;
        vm.detailObservations = detailObservations;
        vm.changeVerificationDate = changeVerificationDate;
        vm.changeVerificationHour = changeVerificationHour;
        vm.filterStation = filterStation;
        vm.filterBetweenTunnel = filterBetweenTunnel;
        vm.exportAgreementAct = exportAgreementAct;
        vm.changeReportSite = changeReportSite;
        vm.changeStation = changeStation;
        vm.changeStretchTunnel = changeStretchTunnel;

        //variables
        vm.pattern = '[\\S \-()]+';
        vm.patternNewLine = '[\\S \\n \-()]+';
        vm.patternWords = '^[a-zA-Zá-úÁ-Ú \\s]+$';
        vm.patternNumbers = '^[0-9 \-]+$';
        vm.dateformat = 'dd/MM/yyyy';
        vm.dateHourFormat = 'dd/MM/yyyy H:mm';
        vm.hourformat = 'H:mm';
        vm.defaultOption = '<Seleccione>';
        vm.userLoggedId = null;
        vm.showCompleteIncidenceDetail = false;
        vm.showCompleteVerificationSearch = false;
        vm.defaultLatitude = -0.1936;
        vm.defaultLongitude = -78.4899;
        vm.mapZoom = 20;

        vm.verifications = [];
        vm.showCompleteObservationSearch = false;
        vm.observations = [];
        vm.goSave = true;

        // Verification panel
        vm.reportSiteStationId = nomenclatorsConstants.reportSiteStationId;
        vm.reportSiteOperationsCenterId = nomenclatorsConstants.reportSiteOperationsCenterId;
        vm.reportSiteVentilationShaftsId = nomenclatorsConstants.reportSiteVentilationShaftsId;
        vm.reportSiteTunnelSectionId = nomenclatorsConstants.reportSiteTunnelSectionId;
        vm.visitSiteTunnelSectionId = nomenclatorsConstants.visitSiteTunnelSectionId;

        //Informant panel
        vm.showCompleteDetail = false;

        $timeout(function () {
            angular.element('.form-group:eq(1)>input').focus();
        });

        function initializeVariables() {
            vm.showEditLabel = false;
            if($stateParams.id){
                vm.showEditLabel = true;
            }
            vm.showCitizenAttention = true;
            vm.showVerification = true;
            vm.showInformantData = true;
            vm.showComplaintClaimData = true;
            vm.showResolvedVerification = true;
            vm.showObservations = true;
            vm.showAgreementAct = true;

            if(!vm.incidenceInitial){
                vm.showCitizenAttention = false;
                vm.showVerification = false;
                vm.showInformantData = false;
                vm.showComplaintClaimData = false;
            }

            if(!vm.incidenceResolved && !vm.incidenceVerified && !vm.incidenceComplainAccepted ){
                vm.showResolvedVerification = false;
            }

            if(vm.incidenceResolved || vm.incidenceVerified || vm.incidenceClaimClosed){
                vm.showObservations = false;
            }
        }

        function getIncidenceRespSocialObject (){
            if(IncidenceSocialResp.markers){
                vm.markers = IncidenceSocialResp.markers;
                IncidenceSocialResp.markers = null;
            }
            if (IncidenceSocialResp.stateIncidence !== undefined && IncidenceSocialResp.stateIncidence !== null) {
                vm.incidenceSocialResp = IncidenceSocialResp.stateIncidence;
                IncidenceSocialResp.stateIncidence = null;
                // IncidenceSocialResp.incidenceId = null;
                // IncidenceSocialResp.incidenceIdEdit = null;
                getUserById(vm.incidenceSocialResp.socialPromoterId);
            } else {
                vm.incidenceSocialResp = entity;
                getUserById(vm.incidenceSocialResp.socialPromoterId);
            }
            vm.incidenceSocialResp.incidenceDefinitive = false;
            if(vm.incidenceSocialResp.incidenceReportDate === null){
                vm.incidenceSocialResp.incidenceReportDate = new Date();
            }
            vm.incidenceInitial = false;
            vm.incidenceComplainAccepted = false;
            vm.incidenceComplainClosed = false;
            vm.incidenceAssign = false;
            vm.incidenceInProcess = false;
            vm.incidenceResolved = false;
            vm.incidenceReopen = false;
            vm.incidenceVerified = false;
            vm.incidenceClaimClosed = false;

            vm.showVerificationsList = false;
            vm.showEditVerificationOption = true;
            vm.showObservationsListPanel = false;

            if(vm.incidenceSocialResp.id === null || vm.incidenceSocialResp.incidenceStateId === null ||
                vm.incidenceSocialResp.incidenceStateId === vm.incidenceStateOpenId){
                vm.incidenceInitial = true;
                vm.differentSites = Site.getAll();
            }
            if(vm.incidenceSocialResp.incidenceStateId === vm.incidenceStateAcceptedId &&
                vm.incidenceSocialResp.incidenceTypeId === vm.incidenceTypeClaimId){
                //se cambio claim x complain
                vm.incidenceComplainAccepted = true;
            }

            if(vm.incidenceSocialResp.incidenceStateId === vm.incidenceStateCloseId &&
                vm.incidenceSocialResp.incidenceTypeId === vm.incidenceTypeClaimId){

                //se cambio claim x complain
                vm.incidenceComplainClosed = true;
                vm.showVerificationsList = true;
                vm.showEditVerificationOption = false;
                vm.showExportVerificationButton = true;
            }

            if(vm.incidenceSocialResp.incidenceStateId === vm.incidenceStateAssignedId){
                vm.incidenceAssign = true;
                vm.showObservationEdit = true;
                getIncidenceObservations();
            }

            if(vm.incidenceSocialResp.incidenceStateId === vm.incidenceStateProcessingId){
                vm.incidenceInProcess = true;
                vm.showObservationEdit = true;
                getIncidenceObservations();
            }

            if(vm.incidenceSocialResp.incidenceStateId === vm.incidenceStateReopenId){
                vm.incidenceReopen = true;
                vm.showObservationEdit = true;
                getIncidenceObservations();
            }

            if(vm.incidenceSocialResp.incidenceStateId === vm.incidenceStateResolvedId){
                vm.incidenceResolved = true;
                vm.showObservationEdit = false;
                vm.showObservationsListPanel = true;
                getIncidenceObservations();
            }

            if(vm.incidenceSocialResp.incidenceStateId === vm.incidenceStateVerifiedId){
                vm.incidenceVerified = true;
                vm.showObservationEdit = false;
                vm.showObservationsListPanel = true;
                getIncidenceObservations();
                initializeAgreementAct();
            }

            if(vm.incidenceSocialResp.incidenceStateId === vm.incidenceStateCloseId &&
                vm.incidenceSocialResp.incidenceTypeId === vm.incidenceTypeComplainId){

                //se cambio claim x complain
                vm.incidenceClaimClosed = true;
                vm.showVerificationsList = true;
                vm.showEditVerificationOption = false;
                vm.uploadAct = true;
                vm.showObservationEdit = false;
                vm.showObservationsListPanel = true;

                vm.showExportVerificationButton = false;
                if(!vm.incidenceSocialResp.conformity){
                    vm.showExportVerificationButton = true;
                }
                getIncidenceObservations();
                initializeAgreementAct();
            }
        }

        function getVerificationObject() {
            vm.verification = {
                verificationId: null,
                verificationDate: null,
                description: null,
                conformity: null,
                photographicRecord: null,
                photographicRecordContentType: null,
                id: null,
                informantId: null,
                reportSiteId: null,
                stationId: null,
                betweenTunnelId: null,
                informant: null,
                reportSite: null,
                station: null,
                betweenTunnel: null
            };
            if(Verification.verification !== undefined && Verification.verification !== null){
                vm.verification = Verification.verification;
                Verification.verification = null;
                getVerificationTime();
            }else{
                if(vm.incidenceSocialResp.id !== null && vm.incidenceSocialResp.verifications &&
                    vm.incidenceSocialResp.verifications.length > 0){

                    if(vm.incidenceInitial){
                        searchVerificationsIncidence(vm.incidenceSocialResp.id, true);
                    }
                    else{
                        getDataInitialVerification(vm.incidenceSocialResp.verifications);
                    }

                    if(vm.incidenceComplainAccepted || vm.incidenceComplainClosed || vm.incidenceResolved ||
                        vm.incidenceStateVerifiedId){
                        searchVerificationsIncidence(vm.incidenceSocialResp.id, false);
                    }

                    // vm.showVerificationsList = true;
                }
            }
        }

        function getDataInitialVerification(verifications) {

            for(var index in verifications){
                if(verifications[index] && verifications[index].type === 'initial'){
                    vm.verification = verifications[index];
                    break;
                }
            }
            getVerificationTime();

            if(vm.verification.reportSite !== null){
                vm.verificationReportSite = vm.verification.reportSite.value;
            }

            if(vm.verification.betweenTunnel !== null){
                vm.verificationBetweenTunnel = vm.verification.betweenTunnel.name;
            }

            if(vm.verification.station !== null){
                vm.verificationStation = vm.verification.station.name;
            }

            if(vm.verification.informant && vm.verification.informant.id){
                vm.verification.informantId = vm.verification.informant.id;
                vm.socialProfile = vm.verification.informant;
                vm.socialProfileSexValue = vm.socialProfile.sex.name;

                vm.otherCheck = false;
                if(vm.socialProfile.othersAffected !== null){
                    vm.otherCheck = true;
                }
                if(vm.socialProfile.infrastructureType){
                    vm.socialProfileInfrastructure = vm.socialProfile.infrastructureType.value;
                }else{
                    vm.socialProfileInfrastructure = '';
                }
                if(vm.socialProfile.propertyType){
                    vm.socialProfileProperty = vm.socialProfile.propertyType.value;
                }else{
                    vm.socialProfileProperty = '';
                }

                if(vm.socialProfile.locationLatitude === null && vm.socialProfile.locationLongitude === null){
                    vm.mapLongitude = vm.defaultLongitude,
                        vm.mapLatitude = vm.defaultLatitude;
                }else{
                    vm.mapLongitude = vm.socialProfile.locationLongitude,
                        vm.mapLatitude = vm.socialProfile.locationLatitude;
                }

                vm.center = {
                    lat: vm.mapLatitude,
                    lng: vm.mapLongitude,
                    zoom: 15
                };
            }
        }

        function getVerificationTime() {
            if(vm.verification && vm.verification.verificationDate !== null && vm.verification.verificationDate !== undefined){
                vm.verificationHour = new Date(vm.verification.verificationDate);
            }else{
                vm.verificationHour = null;
            }
        }

        function getSocialProfileObject() {
            if(SocialProfile.socialProfile !== undefined && SocialProfile.socialProfile !== null){
                vm.socialProfile = SocialProfile.socialProfile;
                SocialProfile.socialProfile = null;
                getDataSocialProfile();
            }
        }

        function getDataSocialProfile(){
            findSexInList();
            findInfrastructureInList();
            findPropertyInList();

            vm.otherCheck = false;
            if(vm.socialProfile.othersAffected !== null){
                vm.otherCheck = true;
            }
            getMapCoordinates();
        }

        function clear() {
            $state.go('incidence-social-resp', null, {reload: true});
        }

        function definitive (definitiveFlag) {
            vm.incidenceSocialResp.incidenceDefinitive = definitiveFlag;
        }

        function save() {
            console.log("Definitive: " + vm.incidenceSocialResp.incidenceDefinitive);
            if(vm.goSave){
                if(vm.incidenceVerified || vm.incidenceClaimClosed){
                    saveAgreementAct();
                }else {
                    //Save incidence social resp
                    saveIncidenceSocialResp();
                }
            }else{
                vm.goSave = true;
            }
        }

        function saveIncidenceSocialResp(){
            vm.isSaving = true;
            vm.incidenceSocialResp.updateSocialProfile = false;
            vm.incidenceSocialResp.userLoggedId = vm.userLoggedId;
            vm.incidenceSocialResp.updateIncidence = false;
            vm.incidenceSocialResp.verifications = [];

            if(vm.incidenceInitial){
                vm.incidenceSocialResp.updateIncidence = true;
                completeVerificationObject();

                if(vm.incidenceSocialResp.incidenceTypeId === vm.incidenceTypeClaimId || vm.incidenceSocialResp.incidenceTypeId === vm.incidenceTypeComplainId ||
                    vm.verification.id !== null){
                    vm.incidenceSocialResp.verifications.push(vm.verification);

                    if(vm.socialProfile !== null && vm.socialProfile !== undefined){
                        if(vm.socialProfile.locationLongitude !== vm.mapLongitude ||
                            vm.socialProfile.locationLatitude !== vm.mapLatitude){
                            vm.socialProfile.locationLongitude = vm.mapLongitude;
                            vm.socialProfile.locationLatitude = vm.mapLatitude;
                        }
                        vm.incidenceSocialResp.updateSocialProfile = true;
                    }
                }

                if(vm.incidenceSocialResp.incidenceStateId === null){
                    vm.incidenceSocialResp.incidenceStateId = nomenclatorsConstants.incidenceStateOpenId;
                }
            }

            if(vm.incidenceComplainAccepted || vm.incidenceResolved) {
                if(vm.incidenceSocialResp.incidenceStateTempId !== null){
                    vm.incidenceSocialResp.updateIncidence = true;
                }
            }

            if(vm.incidenceAssign && vm.observations.length > 0){
                vm.incidenceSocialResp.incidenceStateTempId = vm.incidenceStateProcessingId;
                vm.incidenceSocialResp.updateIncidence = true;
            }

            if(vm.incidenceReopen && vm.observations.length > 0){
                vm.incidenceSocialResp.incidenceStateTempId = vm.incidenceStateProcessingId;
                vm.incidenceSocialResp.updateIncidence = true;
            }

            if(vm.incidenceInProcess){
                vm.incidenceSocialResp.updateIncidence = true;
            }

            if(vm.incidenceVerified){
                vm.incidenceSocialResp.updateIncidence = true;
            }

            if(vm.incidenceSocialResp.incidenceDefinitive){
                if(vm.incidenceSocialResp.incidenceTypeId === vm.incidenceTypeInformationId){
                    vm.incidenceSocialResp.incidenceStateId = null;
                    vm.incidenceSocialResp.incidenceStateTempId = null;
                    vm.incidenceSocialResp.incidenceRealDate = null;
                }

                if(vm.incidenceSocialResp.incidenceStateTempId !== null){
                    vm.incidenceSocialResp.incidenceStateId = vm.incidenceSocialResp.incidenceStateTempId;
                }

                if(vm.incidenceSocialResp.incidenceStateId === null  ||
                    vm.incidenceSocialResp.incidenceStateId === vm.incidenceStateRejectedId){
                    vm.incidenceSocialResp.complaintClaimRegistrationDate = null;
                    vm.incidenceSocialResp.categoryId = null;
                    vm.incidenceSocialResp.complaintClaimDescription = null;
                }

                if(vm.incidenceVerified){
                    if(!vm.incidenceSocialResp.conformity){
                        vm.incidenceSocialResp.agreementActId = null;
                        // AgreementAct.delete({id: id});
                    }
                }

                if(vm.incidenceClaimClosed){
                    vm.incidenceSocialResp.incidenceDefinitive = false;
                    vm.incidenceSocialResp.updateIncidence = true;
                    vm.incidenceSocialResp.incidenceStateTempId = vm.incidenceSocialResp.incidenceStateId;
                }
            }

            var dataSave = JSON.parse(JSON.stringify(vm.incidenceSocialResp));
            if(dataSave.incidenceNumber === null){
                dataSave.incidenceNumber = '0';
            }

            if(vm.showEditLabel){
                if (vm.incidenceSocialResp.id !== null) {
                    IncidenceSocialResp.update(dataSave, onSaveSuccess, onSaveError);
                } else {
                    IncidenceSocialResp.save(dataSave, onSaveSuccess, onSaveError);
                }
            }else{
                if(vm.incidenceSocialResp.incidenceDefinitive){
                    IncidenceSocialResp.accept(dataSave, onSaveSuccess, onSaveError);
                }else{
                    IncidenceSocialResp.saveNew(dataSave, onSaveSuccess, onSaveError);
                }
            }

        }

        function onSaveSuccess(result) {
            if(vm.incidenceClaimClosed){
                clear();
                return;
            }
            if(!vm.incidenceSocialResp.incidenceDefinitive ){
                if(vm.incidenceInitial){
                    vm.incidenceSocialResp.id = result.id;
                    vm.incidenceSocialResp.incidenceStateId = result.incidenceStateId;

                    // vm.incidenceSocialResp.incidenceRealDate = DateUtils.convertLocalDateFromServer(result.incidenceRealDate);
                    // vm.incidenceSocialResp.incidenceReportDate = DateUtils.convertLocalDateFromServer(result.incidenceReportDate);
                    // vm.incidenceSocialResp.complaintClaimRegistrationDate = DateUtils.convertLocalDateFromServer(result.complaintClaimRegistrationDate);
                    vm.incidenceSocialResp.incidenceNumber = result.incidenceNumber;

                    searchVerificationsIncidence(vm.incidenceSocialResp.id, false);
                }
            }else{
                clear();
            }

            $scope.$emit('metroquitoApp:incidenceSocialRespUpdate', result);
            vm.isSaving = false;
        }

        function onSaveError() {
            vm.isSaving = false;
        }

        //Date configuration
        function getUserLogged() {
            Principal.identity().then(function (account) {
                User.get({login: account.login}, function (result) {
                    if(vm.incidenceSocialResp.socialPromoterId === null){
                        vm.incidenceSocialResp.socialPromoterId = result.id;
                        vm.incidenceSocialResp.socialPromoterName = result.firstName;
                        vm.incidenceSocialResp.socialPromoterLastName = result.lastName;
                        vm.userLogged = result.firstName + ' ' + result.lastName;
                     }
                     // else{
                        // getUserById(vm.incidenceSocialResp.socialPromoterId);
                    // }
                    vm.userLoggedName = result.firstName + ' ' + result.lastName;
                    vm.userLoggedId = result.id;
                });
            });
        }

        function getUserById(id){
            vm.userLogged = vm.incidenceSocialResp.socialPromoterName + ' ' + vm.incidenceSocialResp.socialPromoterLastName;
            // if(id !== undefined && id !== null){
            //     User.query(function (result) {
            //         vm.users = result;
            //         vm.userLogged = getUserName(id);
            //     });
            // }
        }

        function getUserName(id){
            var userObject = IncidenceSocialRespUtil.getUser(vm.users, id);
            if(userObject !== null){
                return userObject.firstName + ' ' + userObject.lastName;
            }
        }

        function selectInformant() {
            IncidenceSocialResp.stateIncidence = vm.incidenceSocialResp;
            Verification.verification = vm.verification;
            SocialProfile.socialProfile = vm.socialProfile;
            IncidenceSocialResp.markers = vm.markers;
            if(vm.showEditLabel){
                IncidenceSocialResp.incidenceIdEdit = vm.incidenceSocialResp.id;
            }

            $state.go('social-profile', {isSelection: 1});
        }

        function findSexInList(){
            Gender.query({'name': ''},   function(data){
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

        vm.setPhotographicRecord = function ($file, verification) {
            if ($file && $file.$error === 'pattern') {
                verification.photographicRecord = null;
                verification.photographicRecordContentType = null;
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

        vm.setCardCopy = function ($file, socialProfile) {
            if ($file && $file.$error === 'pattern') {
                return;
            }
            if ($file) {
                DataUtils.toBase64($file, function(base64Data) {
                    $scope.$apply(function() {
                        socialProfile.cardCopy = base64Data;
                        socialProfile.cardCopyContentType = $file.type;
                    });
                });
            }
        };

        function completeVerificationObject() {
            vm.verification.informant = vm.socialProfile;
            vm.verification.type = 'initial';
            var reportSiteId = vm.verification.reportSiteId;
            if(reportSiteId !== null){
                for(var index in vm.reportsitenoms){
                    if(vm.reportsitenoms[index].id === reportSiteId){
                        vm.verification.reportSite = vm.reportsitenoms[index];
                    }
                }
            }
            var stationId = vm.verification.stationId;
            var betweenTunnelId = vm.verification.betweenTunnelId;
            if(stationId !== null && stationId !== undefined) {
                for (var index in vm.differentSites) {
                    if (vm.differentSites[index].id === stationId) {
                        vm.verification.station = vm.differentSites[index];
                    }
                }
            }

            if(betweenTunnelId !== null ){
                for(var index in vm.differentSites){
                    if(vm.differentSites[index].id === betweenTunnelId){
                        vm.verification.betweenTunnel = vm.differentSites[index];
                    }
                }
            }

            if(reportSiteId !== vm.reportSiteTunnelSectionId){
                vm.verification.betweenTunnelId = null;
                vm.verification.betweenTunnel = null;
            }else{
                vm.verification.stationId = null;
                vm.verification.station = null;
            }
        }

        function searchVerificationsIncidence(incidenceId, overwrite) {
            var type;
            if(vm.incidenceInitial){
                type = 'initial';
            }else{
                type = 'resolved';
            }

            Verification.query({
                page: vm.pagingParamsVerification.page - 1,
                size: vm.itemsPerPage,
                sort: 'id,desc',
                incidenceSocialRespsId: incidenceId,
                type: type,

            }, onSuccess, onError);
            function onSuccess(data, headers) {
                vm.links = ParseLinks.parse(headers('link'));
                vm.totalItems = headers('X-Total-Count');
                vm.queryCount = vm.totalItems;
                vm.verifications = data;
                vm.page = vm.pagingParamsVerification.page;

                var verificationsList = data;
                vm.verifications = [];
                if(verificationsList.length > 0){
                    if(vm.incidenceInitial){
                        vm.verification.id = verificationsList[0].id;
                    }

                    vm.verifications = verificationsList;

                     if(overwrite){
                        vm.verification = verificationsList[0];
                        vm.verification.verificationDate = DateUtils.convertDateTimeFromServer(vm.verification.verificationDate);

                        if(vm.verification.informantId !== undefined && vm.verification.informantId !== null){
                            SocialProfile.get({id:vm.verification.informantId},onSuccessSocialProfile,onError);
                            function onSuccessSocialProfile(result, headers) {
                                vm.socialProfile = result;
                                getDataSocialProfile();
                            }
                        }
                    }

                    getVerificationTime();
                }
            }
            function onError() {
                console.log("error");
            }
        }

        vm.filterStatusOpen = function (item) {
            if(item.id === vm.incidenceStateAcceptedId || item.id === vm.incidenceStateRejectedId){
                return true;
            }
            return false;
        }

        vm.filterStatusVerification = function (item) {
            if((vm.incidenceComplainAccepted || vm.incidenceVerified) && item.id === vm.incidenceStateCloseId){
                return true;
            }
            if(vm.incidenceResolved && (item.id === vm.incidenceStateVerifiedId || item.id === vm.incidenceStateReopenId)){
                return true;
            }
            return false;
        }

        vm.filterStatusClaimProcess = function (item) {
            if(item.id === vm.incidenceStateResolvedId){
                return true;
            }
            return false;
        }

        function getIncidenceType() {
            return IncidenceSocialRespUtil.getIncidenceType(vm.incidencetypenoms, vm.incidenceSocialResp.incidenceTypeId);
        }

        function getSocialPromoterName(userId) {
           return vm.incidenceSocialResp.socialPromoterName + ' ' + vm.incidenceSocialResp.socialPromoterLastName;
        }

        function getCategory() {
            return IncidenceSocialRespUtil.getCategory(vm.categorynoms, vm.incidenceSocialResp.categoryId);
        }

        function getIncidenceStates() {
            vm.incidenceState1 = 'Aceptada';
            if(vm.incidenceSocialResp.incidenceStateId === vm.incidenceStateRejectedId){
                vm.incidenceState1 = 'Rechazada';
            }
            if(vm.incidenceSocialResp.incidenceStateId === vm.incidenceStateOpenId){
                vm.incidenceState1 = 'Abierta';
            }
        }

        function showHidePanel(flagPanel) {
            switch (flagPanel){
                case 1:
                    vm.showCitizenAttention = (vm.showCitizenAttention)? false: true;
                    break;

                case 2:
                    vm.showVerification = (vm.showVerification)? false: true;
                    break;

                case 3:
                    vm.showInformantData = (vm.showInformantData)? false: true;
                    break;

                case 4:
                    vm.showComplaintClaimData = (vm.showComplaintClaimData)? false: true;
                    break;

                case 5:
                    vm.showResolvedVerification = (vm.showResolvedVerification)? false: true;
                    break;

                case 6:
                    vm.showObservations = (vm.showObservations)? false: true;
                    break;

                case 7:
                    vm.showAgreementAct= (vm.showAgreementAct)? false: true;
                    break;
            }
        }

        function createVerifications(){
            vm.goSave = false;
            IncidenceSocialResp.incidenceId = vm.incidenceSocialResp.id;
            IncidenceSocialResp.stateIncidence = vm.incidenceSocialResp;
            $state.go('verification.new', null, {reload: true});
        }

        function editVerifications(verificationId) {
            vm.goSave = false;
            IncidenceSocialResp.incidenceId = vm.incidenceSocialResp.id;
            IncidenceSocialResp.stateIncidence = vm.incidenceSocialResp;
            $state.go('verification.edit', {id: verificationId}, {reload: true});
        }

        function detailVerifications(verificationId) {
            vm.goSave = false;
            IncidenceSocialResp.incidenceId = vm.incidenceSocialResp.id;
            IncidenceSocialResp.stateIncidence = vm.incidenceSocialResp;
            $state.go('verification-detail', {id: verificationId}, {reload: true});
        }

        function createObservations(){
            vm.goSave = false
            $state.go('observation.new', {incId: vm.incidenceSocialResp.id, type: 'rs'}, {reload: true});
        }

        function editObservations(observationId) {
            vm.goSave = false;
            $state.go('observation.edit', {id: observationId, incId: vm.incidenceSocialResp.id, type: 'rs'}, {reload: true});
        }

        function detailObservations(observationId) {
            vm.goSave = false;
            $state.go('observation-detail', {id: observationId, incId: vm.incidenceSocialResp.id, type: 'rs'}, {reload: true});
        }

        function getIncidenceObservations() {
            if(vm.incidenceSocialResp.id !== null){
                Observation.search({
                    sort: 'id,desc',
                    incidenceId: vm.incidenceSocialResp.id,
                    owner: false,
                }, onSuccessObservations);
                function onSuccessObservations(result) {
                    vm.observations = result;
                }
            }
        }

        function initializeAgreementAct() {
            if(vm.incidenceSocialResp.agreementActId){
                AgreementAct.get({id : vm.incidenceSocialResp.agreementActId}, function (result) {
                    vm.agreementAct = result;
                });
            }else{
                vm.agreementAct = {
                    companyRepresentative: null,
                    company: null,
                    content: null,
                    annexedAct: null,
                    annexedActContentType: null,
                    id: null
                }
            }
        }

        function saveAgreementAct() {
            if (vm.agreementAct.id !== null) {
                AgreementAct.update(vm.agreementAct, onSaveAgreementAct);
            } else {
                AgreementAct.save(vm.agreementAct, onSaveAgreementAct);
            }
        }

        function onSaveAgreementAct(actResult) {
            vm.incidenceSocialResp.agreementActId = actResult.id;
            saveIncidenceSocialResp();
        }

        vm.setAnnexedAct = function ($file, agreementAct) {
            if ($file && $file.$error === 'pattern') {
                return;
            }
            if ($file) {
                DataUtils.toBase64($file, function(base64Data) {
                    $scope.$apply(function() {
                        agreementAct.annexedAct = base64Data;
                        agreementAct.annexedActContentType = $file.type;
                    });
                });
            }
        };

        //Date configurations
        vm.openCalendar = openCalendar;
        vm.datePickerOpenStatus = {};
        vm.datePickerOpenStatus.incidenceRealDate = false;
        vm.datePickerOpenStatus.incidenceReportDate = false;
        vm.datePickerOpenStatus.complaintClaimRegistrationDate = false;

        vm.realDateOption = {
            maxDate: vm.incidenceSocialResp.incidenceReportDate
        };

        vm.verificationDateOption = {
            // minDate: vm.incidenceSocialResp.incidenceReportDate
            maxDate: new Date()
        };

        vm.complaintClaimRegistrationDateOption = {
            minDate: vm.incidenceSocialResp.incidenceReportDate
        };
        $scope.$watch('vm.incidenceSocialResp.incidenceReportDate', function () {
            if(vm.incidenceSocialResp.incidenceReportDate < vm.incidenceSocialResp.incidenceRealDate){
                vm.incidenceSocialResp.incidenceRealDate = vm.incidenceSocialResp.incidenceReportDate;
            }
            vm.realDateOption = {
                maxDate: vm.incidenceSocialResp.incidenceReportDate
            };

            if(vm.incidenceSocialResp.incidenceReportDate > vm.verification.verificationDate &&
                vm.verification.verificationDate !== null && vm.verification.verificationDate !== undefined){
                vm.verification.verificationDate = vm.incidenceSocialResp.incidenceReportDate;
            }
            vm.verificationDateOption = {
                // minDate: vm.incidenceSocialResp.incidenceReportDate
                maxDate: new Date()
            };

            if(vm.incidenceSocialResp.incidenceReportDate > vm.incidenceSocialResp.complaintClaimRegistrationDate &&
                vm.incidenceSocialResp.complaintClaimRegistrationDate !== null && vm.incidenceSocialResp.complaintClaimRegistrationDate !== undefined){
                vm.incidenceSocialResp.complaintClaimRegistrationDate = vm.incidenceSocialResp.incidenceReportDate;
            }
            vm.complaintClaimRegistrationDateOption = {
                minDate: vm.incidenceSocialResp.incidenceReportDate
            };
            $scope.$evalAsync();
        });

        function openCalendar(date) {
            vm.datePickerOpenStatus[date] = true;
        }

        vm.fromDateOption = {
            minDate: IncidenceSocialResp.initSystemDate,
            maxDate: (vm.toDate !== '') ? vm.toDate : new Date()
        };

        vm.toDateOption = {
            minDate: vm.fromDate,
            maxDate: new Date()
        };

        $scope.$watch('vm.toDate', updateAsync);
        $scope.$watch('vm.fromDate', updateAsync);

        function updateAsync(){
            vm.fromDateOption = {
                minDate: IncidenceSocialResp.initSystemDate,
                maxDate: (vm.toDate !== '') ? vm.toDate : new Date()
            };

            vm.toDateOption = {
                minDate: vm.fromDate,
                maxDate: new Date()
            };
            $scope.$evalAsync();
        }
        //end date configuration

        function changeVerificationDate(){
            if(vm.verificationHour === null || vm.verificationHour === undefined) {
                vm.verificationHour = new Date(vm.verification.verificationDate);
            }else{
                vm.verification.verificationDate.setHours(vm.verificationHour.getHours());
                vm.verification.verificationDate.setMinutes(vm.verificationHour.getMinutes());
            }
        }

        function changeVerificationHour(){
            if(vm.verificationHour !== null && vm.verificationHour !== undefined) {
                vm.verification.verificationDate.setHours(vm.verificationHour.getHours());
                vm.verification.verificationDate.setMinutes(vm.verificationHour.getMinutes());
            }else{
                if(vm.verification.verificationDate){
                    vm.verificationHour = new Date(vm.verification.verificationDate);
                    vm.verificationHour.setHours(0);
                    vm.verificationHour.setMinutes(0);
                    vm.verification.verificationDate.setHours(vm.verificationHour.getHours());
                    vm.verification.verificationDate.setMinutes(vm.verificationHour.getMinutes());
                }
            }
        }

        function filterStation(item) {
            if(item.typeId === vm.reportSiteStationId){
                return true;
            }
            return false;
        }

        function filterBetweenTunnel(item) {
            if(item.typeId === vm.visitSiteTunnelSectionId){
                return true;
            }
            return false;
        }

        function exportAgreementAct() {
            var informantCompleteName = vm.socialProfile.name + ' ' + vm.socialProfile.lastName;
            var userName = vm.userLoggedName;
            AgreementAct.export({agreementActId: vm.agreementAct.id, informantCompleteName: informantCompleteName, userName: userName},
                function (data) {
                    var url = window.URL.createObjectURL(data.response);
                    window.open(url, '_blank');
            });
        }

        //Maps configuration
        vm.kmlURL = "/content/images/trazado.kml";
        vm.kmlData = '';
        vm.parserMap = null;
        vm.getMapPosition = getMapPosition;
        $http({
            method: 'GET',
            url: vm.kmlURL
        }).then(function successCallback(response) {
            vm.kmlData = response.data;
            NgMap.getMap().then(function(map) {
                vm.map = map;
                var myParser = new geoXML3.parser({ map: vm.map });
                myParser.parseKmlString(vm.kmlData);
                vm.parserMap = myParser;
                getMapCoordinates();
            });
        }, function errorCallback(response) {
            console.log('Error');
        });

        function getMapCoordinates(){
            if(vm.socialProfile && vm.socialProfile.locationLatitude && vm.socialProfile.locationLongitude){
                vm.mapLatitude = vm.socialProfile.locationLatitude;
                vm.mapLongitude = vm.socialProfile.locationLongitude;

                if(vm.map){
                    vm.map.setCenter(new google.maps.LatLng(vm.mapLatitude, vm.mapLongitude));
                    vm.map.setZoom(16);

                    vm.pos = {
                        lat: vm.mapLatitude,
                        lng: vm.mapLongitude
                    }
                }

            }else{
                vm.mapLatitude = vm.defaultLatitude;
                vm.mapLongitude = vm.defaultLongitude;
                if(vm.map){
                    vm.map.setCenter(new google.maps.LatLng(vm.mapLatitude, vm.mapLongitude));
                }
                changeReportSiteAux();
            }
        }

        function getMapPosition(position) {
            if(position && position.latLng){
                vm.mapLongitude = position.latLng.lng().toFixed(4);
                vm.mapLatitude = position.latLng.lat().toFixed(4);

                vm.pos = {
                    lat: vm.mapLatitude,
                    lng: vm.mapLongitude
                }
            }
        }

        function changeReportSite(){
            if(vm.socialProfile && vm.socialProfile.locationLatitude == null && vm.socialProfile.locationLongitude == null){
                changeReportSiteAux();
            }
        }

        function changeReportSiteAux(){
            if(vm.verification){
                if(vm.verification.reportSiteId === vm.reportSiteStationId){
                    changeStation();
                }
                if(vm.verification.reportSiteId === vm.reportSiteTunnelSectionId){
                    changeStretchTunnel();
                }
            }
        }

        function changeStation() {
            if(vm.verification && vm.verification.stationId !== null && vm.socialProfile){

                if((vm.socialProfile.locationLatitude == null && vm.socialProfile.locationLongitude == null) ||
                    (vm.socialProfile.locationLatitude === vm.defaultLatitude && vm.socialProfile.locationLongitude === vm.defaultLongitude)){

                    for(var index in vm.differentSites){
                        if(vm.differentSites[index] && vm.differentSites[index].id === vm.verification.stationId){
                            moveMapGeoId(vm.differentSites[index].geoid);
                            break;
                        }
                    }
                }
            }
        }

        function changeStretchTunnel() {
            if(vm.verification && vm.verification.betweenTunnelId !== null && vm.socialProfile){

                if((vm.socialProfile.locationLatitude == null && vm.socialProfile.locationLongitude == null) ||
                    (vm.socialProfile.locationLatitude === vm.defaultLatitude && vm.socialProfile.locationLongitude === vm.defaultLongitude)) {

                    for(var index in vm.differentSites){
                        if(vm.differentSites[index] && vm.differentSites[index].id === vm.verification.betweenTunnelId){
                            moveMapGeoId(vm.differentSites[index].geoid);
                            break;
                        }
                    }
                }
            }
        }

        function moveMapGeoId(geoId){
            if(vm.parserMap && vm.parserMap.docs && vm.parserMap.docs.length > 0 && vm.parserMap.docs[0]){
                var placemarks = vm.parserMap.docs[0].placemarks;
                for(var index in placemarks){
                    if (placemarks[index] && placemarks[index].description) {
                        var geoIdKml = getGeoid(placemarks[index]);

                        if(geoId && geoId == geoIdKml){
                            if(vm.map && placemarks[index].polygon){
                                var polygon = new google.maps.Polygon(placemarks[index].polygon);
                                var polygonBounds = polygon.getPath().getArray();
                                var firstPoint = polygonBounds[0];

                                vm.mapLatitude =  firstPoint.lat().toFixed(4);
                                vm.mapLongitude = firstPoint.lng().toFixed(4);

                                if(vm.map){
                                    vm.map.setCenter(new google.maps.LatLng(vm.mapLatitude, vm.mapLongitude));
                                    vm.map.setZoom(16);

                                    vm.pos = {
                                        lat: vm.mapLatitude,
                                        lng: vm.mapLongitude
                                    }
                                }
                            }
                            break;
                        }
                    }
                }
            }
        }

        function getGeoid(placemarks) {
            var xmlString = placemarks.description;
            var parser = new DOMParser();
            var document = parser.parseFromString(xmlString, "text/html");
            var tdElements = document.getElementsByTagName("td");
            for(var jindex in tdElements){
                if(tdElements[jindex] && tdElements[jindex].innerText === 'GeoId'){
                    return tdElements[Number(jindex) + 1].innerText;
                }
            }
        }

    }
})();
