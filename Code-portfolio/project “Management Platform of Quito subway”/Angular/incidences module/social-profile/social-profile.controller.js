(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('SocialProfileController', SocialProfileController);

    SocialProfileController.$inject = ['$scope', '$state', 'SocialProfile', 'ParseLinks', 'AlertService', 'pagingParams', 'paginationConstants', 'InfrastructureTypeNom', 'Gender','IncidenceSocialResp', 'Verification'];

    function SocialProfileController ($scope, $state, SocialProfile, ParseLinks, AlertService, pagingParams, paginationConstants, InfrastructureTypeNom, Gender, IncidenceSocialResp, Verification) {
        var vm = this;

        //functions
        vm.loadPage = loadPage;
        vm.predicate = pagingParams.predicate;
        vm.reverse = pagingParams.ascending;
        vm.transition = transition;
        vm.itemsPerPage = paginationConstants.itemsPerPage;
        vm.clear = clear;
        vm.cancel = cancel;
        vm.searchByFilters = searchByFilters;
        vm.findSexInList = findSexInList;
        vm.findInfrastructureInList = findInfrastructureInList;
        vm.goNewIncidence = goNewIncidence;

        //variables
        vm.patternWords = '^[a-zA-Zá-úÁ-Ú \\s]+$';
        vm.patternOnlyNumbers = '^[0-9]+$';
        vm.isSelection = $state.params.isSelection;
        vm.defaultOption = '<Seleccione>';
        vm.incidenceSocialResp = IncidenceSocialResp.stateIncidence;
        vm.incidenceIdEdit = IncidenceSocialResp.incidenceIdEdit;

        //nomenclators
        vm.infrastructuretypenoms = InfrastructureTypeNom.query({'value': ''});
        vm.genders = Gender.query({'name': ''});

        initializeVariables(false);
        loadAll();

        function initializeVariables(clean) {
            if(clean){
                vm.name = '';
                vm.lastName = '';
                vm.infrastructureTypeId = '';
                vm.sexId = '';
                vm.identityCard = '';
            }else{
                vm.name = pagingParams.search.name;
                vm.lastName = pagingParams.search.lastName;
                vm.infrastructureTypeId = pagingParams.search.infrastructureTypeId;
                vm.sexId = pagingParams.search.sexId;
                vm.identityCard = pagingParams.search.identityCard;
            }
        }

        function loadAll () {
            SocialProfile.search({
                page: pagingParams.page - 1,
                size: vm.itemsPerPage,
                name: vm.name,
                lastName: vm.lastName,
                infrastructureTypeId: vm.infrastructureTypeId === null ? '' : vm.infrastructureTypeId,
                sexId: vm.sexId === null ? '' : vm.sexId,
                identityCard: vm.identityCard,
                sort: sort()
            }, onSuccess, onError);
            function sort() {
                var result = [vm.predicate + ',' + (vm.reverse ? 'asc' : 'desc')];
                if (vm.predicate !== 'id') {
                    result.push('id');
                }
                return result;
            }
            function onSuccess(data, headers) {
                vm.links = ParseLinks.parse(headers('link'));
                vm.totalItems = headers('X-Total-Count');
                vm.queryCount = vm.totalItems;
                vm.socialProfiles = data;
                vm.page = pagingParams.page;
            }
            function onError(error) {
                AlertService.error(error.data.message);
            }
        }

        function loadPage (page) {
            vm.page = page;
            vm.transition();
        }

        function transition () {
            $state.transitionTo($state.$current, {
                page: vm.page,
                sort: vm.predicate + ',' + (vm.reverse ? 'asc' : 'desc'),
                search: vm.currentSearch,
                name: vm.name,
                lastName: vm.lastName,
                infrastructureTypeId: vm.infrastructureTypeId,
                sexId: vm.sexId,
                identityCard: vm.identityCard,
                isSelection: vm.isSelection
            });
        }

        function clear(){
            initializeVariables(true);
            vm.page = 1;
            transition();
        }

        function cancel() {
            if(vm.isSelection !== '1'){
                $state.go('incidences', null, {reload: true});
            }else{
                redirectIncidenceSocialResp();
            }
        }

        function searchByFilters(){
            pagingParams.page = 1;
            transition();
        }

        function findSexInList(sexId){
             for(var index in vm.genders){
                 if(vm.genders[index] && vm.genders[index].id === sexId){
                     return vm.genders[index].name;
                 }
             }
             return '';
        }

        function findInfrastructureInList(infrastructureId){
            for(var index in vm.infrastructuretypenoms){
                if(vm.infrastructuretypenoms[index] && vm.infrastructuretypenoms[index].id === infrastructureId){
                    return vm.infrastructuretypenoms[index].value;
                }
            }
            return '';
        }

        function goNewIncidence(socialProfile) {
            var verification = Verification.verification;

            if(verification === undefined || verification === null){
                verification = {
                    informantId: socialProfile.id,
                    verificationId: null,
                    verificationDate: null,
                    description: null,
                    conformity: null,
                    photographicRecord: null,
                    photographicRecordContentType: null,
                    id: null,
                    reportSiteId: null,
                    stationId: null,
                    betweenTunnelId: null,
                    informant: null,
                    reportSite: null,
                    station: null,
                    betweenTunnel: null
                }
            }else{
                verification.informantId = socialProfile.id;
            }

            Verification.verification = verification;
            SocialProfile.socialProfile = socialProfile;

            redirectIncidenceSocialResp();
        }

        function redirectIncidenceSocialResp(){
            if(vm.incidenceSocialResp && vm.incidenceSocialResp.id && vm.incidenceIdEdit){
                $state.go('incidence-social-resp.edit', {id: vm.incidenceSocialResp.id}, { reload: true });
            }else{
                $state.go('incidence-social-resp.new', null, { reload: true });
            }
        }
    }
})();
