(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('IncidenceSocialRespDetailController', IncidenceSocialRespDetailController);

    IncidenceSocialRespDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'IncidenceSocialResp', 'User',
                                                'IncidenceTypeNom', 'IncidenceStateNom', 'AdministrativeUnit', 'Verification', 'Observation', 'IncidenceStates',
                                                'CategoryNom', 'AgreementAct', 'IncidenceSocialRespUtil', 'nomenclatorsConstants', 'DateUtils', 'paginationConstants',
                                                'ParseLinks', 'DataUtils', '$state','Principal', '$http', 'NgMap'];

    function IncidenceSocialRespDetailController($scope, $rootScope, $stateParams, entity, IncidenceSocialResp, User, IncidenceTypeNom,
                                                 IncidenceStateNom, AdministrativeUnit, Verification,  Observation, IncidenceStates,
                                                 CategoryNom, AgreementAct, IncidenceSocialRespUtil, nomenclatorsConstants, DateUtils, paginationConstants,
                                                 ParseLinks, DataUtils, $state, Principal, $http, NgMap) {
        var vm = this;

        vm.incidenceSocialResp = entity;

        // verification page configuration
        vm.pagingParamsVerification = {
            page: 1,
        };
        vm.itemsPerPage = paginationConstants.itemsPerPage;

        //initials methods
        getVerification();
        getUserLogged();

        var unsubscribe = $rootScope.$on('metroquitoApp:incidenceSocialRespUpdate', function(event, result) {
            vm.incidenceSocialResp = result;
        });

        $scope.$on('$destroy', unsubscribe);

        //Nomenclators
        vm.incidencetypenoms = IncidenceTypeNom.query();
        vm.categorynoms = CategoryNom.query();
        vm.users = User.query();

       //functions
        vm.getIncidenceType = getIncidenceType;
        vm.getSocialPromoterName = getSocialPromoterName;
        vm.getCategory = getCategory;
        vm.openFile = DataUtils.openFile;
        vm.getUserName = getUserName;
        vm.detailObservations = detailObservations;
        vm.detailVerifications = detailVerifications;
        vm.exportIncidence = exportIncidence;
        vm.exportAgreementAct = exportAgreementAct;
        vm.exportVerification = exportVerification;

        //Incidence type Nom
        vm.incidenceTypeInformationId = nomenclatorsConstants.incidenceTypeInformationId;
        vm.incidenceTypeComplainId = nomenclatorsConstants.incidenceTypeComplainId;
        vm.incidenceTypeClaimId = nomenclatorsConstants.incidenceTypeClaimId;

        //Incidence State Nom
        vm.incidenceStateOpenId = nomenclatorsConstants.incidenceStateOpenId;
        vm.incidenceStateRejectedId = nomenclatorsConstants.incidenceStateRejectedId;
        vm.incidenceStateAcceptedId = nomenclatorsConstants.incidenceStateAcceptedId;
        vm.incidenceStateCloseId = nomenclatorsConstants.incidenceStateCloseId;
        vm.incidenceStateProcessingId = nomenclatorsConstants.incidenceStateProcessingId;
        vm.incidenceStateResolvedId = nomenclatorsConstants.incidenceStateResolvedId;
        vm.incidenceStateReopenId = nomenclatorsConstants.incidenceStateReopenId;
        vm.incidenceStateVerifiedId = nomenclatorsConstants.incidenceStateVerifiedId;

        getIncidenceStates();

        //variables
        vm.dateformat = 'dd/MM/yyyy';
        vm.hourformat = 'H:mm';
        vm.dateHourFormat = 'dd/MM/yyyy H:mm';
        vm.defaultLatitude = -0.1936;
        vm.defaultLongitude = -78.4899;
        vm.showCompleteIncidenceDetail = true;
        initializeVariables();
        vm.showEditVerificationOption = false;
        vm.uploadAct = false;

        function initializeVariables() {
            vm.showCitizenAttention = true;
            vm.showVerification = true;
            vm.showInformantData = true;
            vm.showComplaintClaimData = true;
            vm.showResolvedVerification = true;
            vm.showVerificationsList = true;
            vm.showObservations = true;

            if(vm.incidenceSocialResp.incidenceStateId === vm.incidenceStateProcessingId ||
                vm.incidenceSocialResp.incidenceStateId === vm.incidenceStateResolvedId ||
                vm.incidenceSocialResp.incidenceStateId === vm.incidenceStateReopenId ||
                vm.incidenceSocialResp.incidenceStateId === vm.incidenceStateVerifiedId){

                vm.showObservationsListPanel = true;
                getObservations();
            }

            if(vm.incidenceSocialResp.incidenceStateId === vm.incidenceStateCloseId){
                vm.showExportVerificationButton = true;

                if(vm.incidenceSocialResp.incidenceTypeId === vm.incidenceTypeComplainId){
                    vm.showObservationsListPanel = true;
                    getObservations();
                    vm.incidenceClaimClosed = true;

                    if(vm.incidenceSocialResp.conformity === true){
                        initializeAgreementAct();
                        vm.showExportVerificationButton = false;
                    }
                }
            }
        }

        function getObservations(){
            Observation.search({
                sort: 'id,desc',
                incidenceId: vm.incidenceSocialResp.id,
                owner: false,

            }, onSuccessObservations);

            function onSuccessObservations(result) {
                vm.observations = result;
            }
        }

        function getVerification() {
            vm.showCompleteDetail = false;
            if(vm.incidenceSocialResp.verifications && vm.incidenceSocialResp.verifications.length > 0){
                vm.verifications = [];

                if(vm.incidenceSocialResp.verifications.length > 1){
                    for(var index in vm.incidenceSocialResp.verifications){
                        if(vm.incidenceSocialResp.verifications[index]){
                            if(vm.incidenceSocialResp.verifications[index].type === 'initial'){
                                vm.verification = vm.incidenceSocialResp.verifications[index];
                                break;
                            }
                        }
                    }
                    searchVerificationsIncidence(vm.incidenceSocialResp.id);
                }else{
                    vm.verification = vm.incidenceSocialResp.verifications[0];
                }

            }else{
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
            }

            if(vm.verification.reportSite){
                vm.verificationReportSite = vm.verification.reportSite.value;
            }

            if(vm.verification.betweenTunnel){
                vm.verificationBetweenTunnel = vm.verification.betweenTunnel.name;
            }

            if(vm.verification.station){
                vm.verificationStation = vm.verification.station.name;
            }

            if(vm.verification.informant && vm.verification.informant.id){
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
                    vm.mapLongitude = vm.defaultLongitude;
                    vm.mapLatitude = vm.defaultLatitude;
                    vm.mapZoom = 11;
                }else{
                    vm.mapLongitude = vm.socialProfile.locationLongitude;
                    vm.mapLatitude = vm.socialProfile.locationLatitude;
                    vm.mapZoom = 16;
                }
                moveMapPosition();
            }
        }

        function getIncidenceStates() {
            vm.incidenceState1 = 'Aceptada';
            if(vm.incidenceSocialResp.incidenceStateId === vm.incidenceStateRejectedId){
                vm.incidenceState1 = 'Rechazada';
            }
            if(vm.incidenceSocialResp.incidenceStateId === vm.incidenceStateOpenId){
                vm.incidenceState1 = 'Abierta';
            }

            if(vm.incidenceSocialResp.id !== null){
                IncidenceStates.search({
                    sort: 'id,asc',
                    incidenceId: vm.incidenceSocialResp.id,
                    owner: false,
                }, onSuccessHistory);

                function onSuccessHistory(result) {
                    vm.statesHistories = result;
                }
            }

        }

        function getIncidenceType() {
            return IncidenceSocialRespUtil.getIncidenceType(vm.incidencetypenoms, vm.incidenceSocialResp.incidenceTypeId);
        }

        function getSocialPromoterName(userId) {
            // return getUserName(userId);
            return vm.incidenceSocialResp.socialPromoterName + ' ' + vm.incidenceSocialResp.socialPromoterLastName;
        }

        function getUserName(userId) {
            var userObject = IncidenceSocialRespUtil.getUser(vm.users, userId);
            if(userObject !== null){
                return userObject.firstName + ' ' + userObject.lastName;
            }
        }

        function getCategory() {
            return IncidenceSocialRespUtil.getCategory(vm.categorynoms, vm.incidenceSocialResp.categoryId);
        }

        function searchVerificationsIncidence(incidenceId) {
            var type = 'resolved';

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

                vm.verifications = data;
            }
            function onError() {
                console.log("error");
            }
        }

        function detailObservations(observationId) {
            // IncidenceSocialResp.incidenceIdDetail = vm.incidenceSocialResp.id;
            $state.go('observation-detail', {id: observationId, incId: vm.incidenceSocialResp.id, type: 'rsD'}, {reload: true});
        }

        function detailVerifications(verificationId) {
            IncidenceSocialResp.incidenceIdDetail = vm.incidenceSocialResp.id;
            $state.go('verification-detail', {id: verificationId}, {reload: true});
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

        function exportIncidence() {
            IncidenceSocialResp.export({incidenceId: vm.incidenceSocialResp.id, userName: vm.userLoggedName}, function (data) {
                var url = window.URL.createObjectURL(data.response);
                window.open(url, '_blank');
            });
        }

        function exportAgreementAct() {
            var informantCompleteName = vm.socialProfile.name + ' ' + vm.socialProfile.lastName;
            AgreementAct.export({agreementActId: vm.agreementAct.id, informantCompleteName: informantCompleteName, userName: vm.userLoggedName},
                function (data) {
                    var url = window.URL.createObjectURL(data.response);
                    window.open(url, '_blank');
                });
        }

        function exportVerification(verificationId) {
            Verification.export({verificationId: verificationId, userName: vm.userLoggedName}, function (data) {
                var url = window.URL.createObjectURL(data.response);
                window.open(url, '_blank');
            });
        }

        function getUserLogged() {
            Principal.identity().then(function (account) {
                User.get({login: account.login}, function (result) {
                    vm.userLoggedName = result.firstName + ' ' + result.lastName;
                });
            });
        }

        //Maps configuration
        vm.kmlURL = "/content/images/trazado.kml";
        vm.kmlData = '';

        $http({
            method: 'GET',
            url: vm.kmlURL
        }).then(function successCallback(response) {
            vm.kmlData = response.data;
            NgMap.getMap().then(function(map) {
                vm.map = map;
                var myParser = new geoXML3.parser({ map: vm.map });
                myParser.parseKmlString(vm.kmlData);

                moveMapPosition();
            });
        }, function errorCallback(response) {
            console.log('Error');
        });

        function moveMapPosition(){
            if(vm.map){
                vm.map.setCenter(new google.maps.LatLng(vm.mapLatitude, vm.mapLongitude));
                vm.map.setZoom(vm.mapZoom);

                vm.pos = {
                    lat: vm.mapLatitude,
                    lng: vm.mapLongitude
                };
            }
        }
    }
})();
