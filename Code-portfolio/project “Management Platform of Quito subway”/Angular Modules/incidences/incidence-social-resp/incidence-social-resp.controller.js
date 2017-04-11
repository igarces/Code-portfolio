(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('IncidenceSocialRespController', IncidenceSocialRespController);

    IncidenceSocialRespController.$inject = ['$scope', '$state', 'IncidenceSocialResp', 'ParseLinks', 'AlertService', 'pagingParams',
                                             'paginationConstants','IncidenceTypeNom','IncidenceStateNom', 'Principal', 'nomenclatorsConstants',
                                             'User', 'IncidenceSocialRespUtil', 'AdministrativeUnit'];

    function IncidenceSocialRespController ($scope, $state, IncidenceSocialResp, ParseLinks, AlertService, pagingParams,
                                            paginationConstants, IncidenceTypeNom, IncidenceStateNom, Principal, nomenclatorsConstants,
                                            User, IncidenceSocialRespUtil, AdministrativeUnit) {
        var vm = this;

        //nomenclators
        vm.incidencetypenoms = IncidenceTypeNom.query();
        vm.incidencestatenoms = IncidenceStateNom.query();
        vm.administrativeunits = AdministrativeUnit.search({'name': '', 'acronym':''});
        vm.usersPromotor = [];

        //Roles
        vm.rolPromotorSocialId = nomenclatorsConstants.rolPromotorSocialId;
        vm.rolEspecialistaRSId = nomenclatorsConstants.rolEspecialistaRSId;
        vm.adminUserLogin = nomenclatorsConstants.adminUserLogin;

        User.query({
            page: 0,
            size: 100000,
            sort: 'firstName,asc'
        }, function (users) {
            vm.users = users;

            for(var index in users){
                if(users[index] && users[index].login !==  vm.adminUserLogin){
                    var user = users[index];

                    for(var index in user.roles){
                        if(user.roles[index].id === vm.rolPromotorSocialId){
                            vm.usersPromotor.push(user);
                            break;
                        }
                    }
                }
            }
        });

        //functions
        vm.loadPage = loadPage;
        vm.predicate = pagingParams.predicate;
        vm.reverse = pagingParams.ascending;
        vm.transition = transition;
        vm.itemsPerPage = paginationConstants.itemsPerPage;
        vm.searchByFilters = searchByFilters;
        vm.clear = clear;
        vm.cancel = cancel;
        vm.getIncidenceType = getIncidenceType;
        vm.getIncidenceState = getIncidenceState;
        vm.showEditOptionByIncidenceState = showEditOptionByIncidenceState;
        vm.showAssignOptionByIncidenceState = showAssignOptionByIncidenceState;
        vm.getAdministrativeUnitName = getAdministrativeUnitName;
        vm.getResponsibleName = getResponsibleName;
        vm.filterUserAdministrativeUnit = filterUserAdministrativeUnit;

        //variables
        vm.patternWords = '^[a-zA-Zá-úÁ-Ú \\s]+$';
        vm.patternNumbers = '^[0-9 \-]+$';
        vm.dateformat = 'dd/MM/yyyy';

        initializeVariables(false);
        showOptionsByRol();
        vm.defaultOption = '<Seleccione>';
        vm.initSystemDate = IncidenceSocialResp.initSystemDate;

        //initial methods
        loadAll();

        //date configurations
        vm.openCalendar = openCalendar;
        vm.datePickerOpenStatus = {};
        vm.datePickerOpenStatus.fromDate = false;
        vm.datePickerOpenStatus.toDate = false;

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
        //end date configurations

        function initializeVariables(clean) {
            if(clean){
                vm.incidenceNumber = '';
                vm.fromDate = '';
                vm.toDate = '';
                vm.incidenceTypeId = '';
                vm.incidenceStateId = '';
                vm.responsible = '';
                vm.promotor = '';
                vm.administrativeUnitId = '';
            }else{
                vm.incidenceNumber = pagingParams.search.incidenceNumber;
                vm.fromDate = pagingParams.search.fromDate;
                vm.toDate = pagingParams.search.toDate;
                vm.incidenceTypeId = pagingParams.search.incidenceTypeId;
                vm.incidenceStateId = pagingParams.search.incidenceStateId;
                vm.responsible = pagingParams.search.responsible;
                vm.administrativeUnitId = pagingParams.search.administrativeUnitId;
                vm.promotor = pagingParams.search.promotor;
            }
        }

        function searchByFilters() {
            pagingParams.page = 1;
            transition();
        }

        function clear() {
            initializeVariables(true);
            vm.page = 1;
            transition();
        }

        function cancel() {
            $state.go('incidences', null, {reload: true});
        }

        function loadAll () {
            IncidenceSocialResp.query({
                page: pagingParams.page - 1,
                size: vm.itemsPerPage,
                sort: sort(),
                fromDate: vm.fromDate,
                toDate: vm.toDate,
                incidenceNumber: vm.incidenceNumber,
                incidenceTypeId: vm.incidenceTypeId === null ? '' : vm.incidenceTypeId,
                incidenceStateId: vm.incidenceStateId  === null ? '' : vm.incidenceStateId,
                responsible: vm.responsible === null ? '' : vm.responsible,
                administrativeUnitId: vm.administrativeUnitId === null ? '' : vm.administrativeUnitId,
                promotor: vm.promotor === null ? '' : vm.promotor
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
                vm.incidenceSocialResps = data;
                vm.page = pagingParams.page;

                if((IncidenceSocialResp.initSystemDate === null || IncidenceSocialResp.initSystemDate === undefined) &&
                    vm.incidenceSocialResps.length > 0){
                    IncidenceSocialResp.initSystemDate = vm.incidenceSocialResps[vm.incidenceSocialResps.length - 1].incidenceReportDate;
                    updateAsync();
                }
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
                  fromDate: vm.fromDate,
                  toDate: vm.toDate,
                  incidenceNumber: vm.incidenceNumber,
                  incidenceTypeId: vm.incidenceTypeId,
                  incidenceStateId: vm.incidenceStateId,
                  responsible: vm.responsible,
                  administrativeUnitId: vm.administrativeUnitId,
                  promotor: vm.promotor
            });
        }

        function getIncidenceType(incidenceTypeId) {
            return IncidenceSocialRespUtil.getIncidenceType(vm.incidencetypenoms, incidenceTypeId);
        }

        function getIncidenceState(incidenceStateId) {
            if(incidenceStateId !== null){
                for(var index in vm.incidencestatenoms){
                    if(vm.incidencestatenoms[index].id === incidenceStateId){
                        return vm.incidencestatenoms[index].value;
                    }
                }
            }
            return '';
        }

        function showOptionsByRol() {
            vm.showAddOption = false;
            vm.isRolPromotorSocial = false;
            vm.isRolEspecialistaRS = false;
            vm.userLoggedId = null;
            vm.userLogged = null;

            Principal.identity().then(function (account) {
                User.get({login: account.login}, function (result) {
                    vm.userLoggedId = result.id
                    vm.userLogged = result;
                });
                for(var index in account.roles){
                    if(account.roles[index].id === vm.rolPromotorSocialId){
                        vm.isRolPromotorSocial = true;
                        vm.showAddOption = true;
                    }
                    if(account.roles[index].id === vm.rolEspecialistaRSId){
                        vm.isRolEspecialistaRS = true;
                        vm.showAddOption = true;
                    }
                }
            });
        }

        /**
         * Rol promotor social
         * Estado: Abierta. Opciones: Ver y Modificar
         * Estado: Aceptada, Rechazada, Asignada, En proceso y Reabierta. Opcion: Ver
         * Estado: Resuelta, Verificada y Cerrada. Opciones: Ver y Modificar.
         */

        /**
         * Especialista R.S.
         * Estado: Abierta. Opciones: Ver y Modificar
         * Estado: Rechazada, Asignada, En proceso y Reabierta. Opcion: Ver
         * Estado: Aceptada. Opciones: Ver, y Asignar/Reasignar.
         * Estado: Resuelta, Verificada y Cerrada. Opciones: Ver y Modificar.
         */

        /**
         * Gerente de la unidad administrativa
         * Estado: Abierta y Aceptada/Rechazada. NO SE MUESTRA NINGUNA OPCION
         * Estado: Asignada, En proceso y Reabierta. Opciones: Ver, Modificar y Asignar/Reasignar
         * Estado: Resuelta, Verificada y Cerrada. Opcion: Ver.
         */

        /**
         * Responsable de la incidencia
         * Estado: Abierta y Aceptada/Rechazada. NO SE MUESTRA NINGUNA OPCION
         * Estado: Asignada, En proceso y Reabierta. Opciones: ver y Modificar
         * Estado: Resuelta y Cerrada. Opción: Ver
         */

        function showEditOptionByIncidenceState(incidence){
            if(incidence.incidenceTypeId === nomenclatorsConstants.incidenceTypeClaimId &&
                incidence.incidenceStateId === nomenclatorsConstants.incidenceStateCloseId){
                return false;
            }

            if(incidence.incidenceTypeId === nomenclatorsConstants.incidenceTypeComplainId &&
                incidence.incidenceStateId === nomenclatorsConstants.incidenceStateCloseId &&
                (incidence.incidenceStateTempId === nomenclatorsConstants.incidenceStateCloseId || !incidence.conformity)){
                return false;
            }

            if(vm.isRolPromotorSocial || vm.isRolEspecialistaRS){
                if(incidence.incidenceStateId === nomenclatorsConstants.incidenceStateOpenId ||
                    incidence.incidenceStateId === nomenclatorsConstants.incidenceStateResolvedId ||
                    incidence.incidenceStateId === nomenclatorsConstants.incidenceStateVerifiedId ||
                    incidence.incidenceStateId === nomenclatorsConstants.incidenceStateCloseId){
                    return true;
                }
                if(incidence.incidenceTypeId === nomenclatorsConstants.incidenceTypeClaimId &&
                    incidence.incidenceStateId === nomenclatorsConstants.incidenceStateAcceptedId){
                    return true;
                }
            }

            if(incidence.responsibleId === vm.userLoggedId){
                if(incidence.incidenceStateId === nomenclatorsConstants.incidenceStateAssignedId ||
                    incidence.incidenceStateId === nomenclatorsConstants.incidenceStateProcessingId ||
                    incidence.incidenceStateId === nomenclatorsConstants.incidenceStateReopenId){
                    return true;
                }
            }
            return false;
        }

        function showAssignOptionByIncidenceState(incidence){
            if(incidence.incidenceTypeId === nomenclatorsConstants.incidenceTypeClaimId ||
                incidence.incidenceTypeId === nomenclatorsConstants.incidenceTypeInformationId){
                return false;
            }

            if(vm.isRolEspecialistaRS){
                if(incidence.incidenceStateId === nomenclatorsConstants.incidenceStateAcceptedId){
                    return true;
                }
            }
            vm.isRolGerenteUnidadAdministrativa = getAdministativeUnitManagerRol(incidence);
            if(vm.isRolGerenteUnidadAdministrativa){
                if(incidence.incidenceStateId === nomenclatorsConstants.incidenceStateAssignedId ||
                    incidence.incidenceStateId === nomenclatorsConstants.incidenceStateProcessingId ||
                    incidence.incidenceStateId === nomenclatorsConstants.incidenceStateReopenId){
                    return true;
                }
            }
            return false;
        }

        function getAdministativeUnitManagerRol(incidence){
            //Administrative Unit
            if(vm.userLogged && vm.userLogged.responsible && vm.userLogged.adminUnitId !== null &&
                vm.userLogged.adminUnitId === incidence.administrativeUnitResponsibleId){
                return true;
            }
            return false;
        }

        function getAdministrativeUnitName(administrativeUnitId) {
            if(administrativeUnitId !== null && administrativeUnitId !== undefined){
                for(var index in vm.administrativeunits){
                    if(vm.administrativeunits[index] && vm.administrativeunits[index].id === administrativeUnitId){
                        return vm.administrativeunits[index].name;
                    }
                }
            }
            return '';
        }

        function getResponsibleName(userId) {
            var userObject = IncidenceSocialRespUtil.getUser(vm.users, userId);
            if(userObject !== null){
                return userObject.firstName + ' ' + userObject.lastName;
            }
        }

        function filterUserAdministrativeUnit(item) {
            if(item.login !== vm.adminUserLogin){
                if(vm.administrativeUnitId === '' || vm.administrativeUnitId === null || vm.administrativeUnitId === undefined){
                    return true;
                }else{
                    if(item.adminUnitId === vm.administrativeUnitId){
                        return true;
                    }
                }
            }
            return false;
        }
    }
})();


