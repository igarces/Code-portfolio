(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('ProductAUDialogController', ProductAUDialogController);

    ProductAUDialogController.$inject = ['$timeout', '$scope', '$stateParams', 'entity', 'ProductAU', 'AdministrativeUnit', '$state',
                                        'Principal', 'User', 'AlertService', '$translate', '$window', 'Poa', 'nomenclatorsConstants'];

    function ProductAUDialogController ($timeout, $scope, $stateParams, entity, ProductAU, AdministrativeUnit, $state,
                                        Principal, User, AlertService, $translate, $window, Poa, nomenclatorsConstants) {
        var vm = this;

        vm.productAU = entity;
        vm.oldProduct = entity.product;
        vm.cancel = cancel;
        vm.save = save;
        vm.idAdministrativeUnitDPGI = nomenclatorsConstants.adminUnitDPGIId;
        vm.activatedStateId = nomenclatorsConstants.poaStateActivedId;
        vm.reformedStateId = nomenclatorsConstants.poaStateReformedId;
        vm.poaStateId = null;
        vm.patternLettersNumbers = '^[a-zA-Zá-úÁ-Ú0-9 \\s]+$';
        vm.selectAll = false;
        vm.administrativeunits = [];
        vm.poas = [];
        vm.selectAllEvent = selectAllEvent;
        vm.selectAdminUnit = selectAdminUnit;
        vm.searchAdministartiveUnits = searchAdministartiveUnits;
        vm.searchAdministrativeUnitById = searchAdministrativeUnitById;
        initData();

        function initData(){
            User.getLoggedUser(function (userLogged) {
                if(userLogged.administrativeUnitId === vm.idAdministrativeUnitDPGI){
                    searchAdministartiveUnits();
                }else{
                    searchAdministrativeUnitById(userLogged.administrativeUnitId);
                }
            });

            Poa.search({
                page: 0,
                size: 10000,
                project: '',
                dependence: '',
                year: '',
                program: '',
                indicator: '',
                goalProject: '',
                poaType: '',
                poaState: vm.activatedStateId,
                sort: 'year,asc'
            },
                function (poas) {
                    vm.poas = poas;

                    if(vm.productAU.poaId !== null){
                        var flagSearchPoa = true;

                        for(var index in poas){
                            if(poas[index] && poas[index].id === vm.productAU.poaId){
                                flagSearchPoa = false;
                                break;
                            }
                        }
                        if(flagSearchPoa){
                            //search for poa in a state different of active
                            Poa.get({id: vm.productAU.poaId}, function (poa) {
                                vm.poas.push(poa);
                            });
                        }
                    }
            });
        }

        function searchAdministartiveUnits() {
            AdministrativeUnit.search({'name': '', 'acronym':''}, function (list) {
                vm.administrativeunits = list;

                if(vm.productAU.id !== null){
                    for(var index in vm.productAU.administrativeUnits){
                        for(var jindex in vm.administrativeunits){

                            if(vm.productAU.administrativeUnits[index].id &&
                                vm.administrativeunits[jindex].id &&
                                vm.productAU.administrativeUnits[index].id === vm.administrativeunits[jindex].id){
                                vm.administrativeunits[jindex]['select'] = true;
                            }
                        }
                    }
                    if(vm.productAU.administrativeUnits.length === vm.administrativeunits.length){
                        vm.selectAll = true;
                    }
                }
            });
        }

        function searchAdministrativeUnitById(id) {
            AdministrativeUnit.get({'id': id}, function (adminUnit) {
                vm.administrativeunits.push(adminUnit);

                if(vm.productAU.id !== null){
                    for(var index in vm.productAU.administrativeUnits){
                        for(var jindex in vm.administrativeunits){

                            if(vm.productAU.administrativeUnits[index].id &&
                                vm.administrativeunits[jindex].id &&
                                vm.productAU.administrativeUnits[index].id === vm.administrativeunits[jindex].id){
                                vm.administrativeunits[jindex]['select'] = true;
                            }
                        }
                    }
                }
            });
        }

        $timeout(function (){
            angular.element('.form-group:eq(0)>input').focus();
        });

        function cancel () {
            $state.go('product-au', null, {reload: true});
        }

        function save () {
            vm.productAU.year = getPoaYear();
            ProductAU.validate(
                {
                    product: vm.productAU.product,
                    year: vm.productAU.year,
                    id: vm.productAU.id,
                    administrativeUnitList: getAdminIdList()
                },
                function (data) {
                    if(data.response === true){
                        vm.isSaving = true;
                        if (vm.productAU.id !== null) {

                            if(vm.poaStateId === vm.reformedStateId){
                                vm.productAU.oldProduct = vm.oldProduct;
                            }
                            ProductAU.update(vm.productAU, onSaveSuccess, onSaveError);
                        } else {
                            ProductAU.save(vm.productAU, onSaveSuccess, onSaveError);
                        }
                    }else{
                        if (vm.productAU.id !== null) {
                            AlertService.error($translate.instant("metroquitoApp.productAU.invalidModification"));
                        }else{
                            AlertService.error($translate.instant("metroquitoApp.productAU.invalidCreation"));
                        }
                        $window.scrollTo(0,0);
                    }
                });
        }

        function getAdminIdList(){
            var list = [];
            for(var index in vm.productAU.administrativeUnits){
                if(vm.productAU.administrativeUnits[index]){
                    list.push(vm.productAU.administrativeUnits[index].id);
                }
            }
            return list;
        }

        function onSaveSuccess (result) {
            $scope.$emit('metroquitoApp:productAUUpdate', result);
            $state.go('product-au', null, {reload: true});
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }

        function selectAllEvent(){
            if(vm.selectAll){
                vm.productAU.administrativeUnits = JSON.parse(JSON.stringify(vm.administrativeunits));

                for(var index in vm.administrativeunits){
                    if(vm.administrativeunits[index].id){
                        vm.administrativeunits[index]['select'] = true;
                    }
                }
            }else{
                vm.productAU.administrativeUnits = [];
                for(var index in vm.administrativeunits){
                    if(vm.administrativeunits[index].id){
                        vm.administrativeunits[index].select = false;
                    }
                }
            }
        }

        function selectAdminUnit(adminUnit){
            if(adminUnit.select === true){
                var adminUnitSelected = JSON.parse(JSON.stringify(adminUnit));
                delete(adminUnitSelected.select);
                vm.productAU.administrativeUnits.push(adminUnitSelected);
            }else{
                for(var index in vm.productAU.administrativeUnits){
                    if(vm.productAU.administrativeUnits[index] && vm.productAU.administrativeUnits[index].id === adminUnit.id){
                        vm.productAU.administrativeUnits.splice(index, 1);
                        break;
                    }
                }
            }
        }

        function getPoaYear() {
            for(var index in vm.poas){
                if(vm.poas[index].id && vm.poas[index].id === vm.productAU.poaId){
                    vm.poaStateId = vm.poas[index].poaStateId;
                    return vm.poas[index].year;
                }
            }
            return vm.productAU.year;
        }
    }
})();
