(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('PoaDialogController', PoaDialogController);

    PoaDialogController.$inject = ['$timeout', '$scope', '$stateParams', 'entity', 'Poa', 'PoaType', 'PoaState', '$state', 'AlertService', '$translate'];

    function PoaDialogController ($timeout, $scope, $stateParams, entity, Poa, PoaType, PoaState, $state, AlertService, $translate) {
        var vm = this;

        //Constants
        vm.activatedStateId = 1;
        vm.revisedStateId = 2;
        vm.approvedStateId = 3;
        vm.reformedStateId = 4;
        vm.closedStateId = 5;

        vm.poa = entity;
        vm.poa.poaBeforeStateId = vm.poa.poaStateId;
        vm.cancel = cancel;
        vm.save = save;
        vm.poatypes = PoaType.query();
        vm.poastates = [];
        vm.openCalendar = openCalendar;
        vm.datePickerOpenStatus = {};
        vm.datePickerOpenStatus.year = false;
        vm.poaYear = null;
        vm.patternNumbers = '^[0-9]+$';
        vm.poastatesFilter = poastatesFilter;

        initData();

        function initData(){
            if(vm.poa.year !== null){
                vm.poaYear = new Date(vm.poa.year,0,1);
            }

            PoaState.query({sort: 'id,asc'}, function (poaList) {
                poastatesFilter(poaList);
            });
        }

        $timeout(function (){
            angular.element('.form-group:eq(0)>input').focus();
        });

        function cancel () {
            $state.go('poa', null, {reload: true});
        }

        function save () {
            vm.poa.year = vm.poaYear.getFullYear();

            Poa.validate(
                {
                    type: vm.poa.poaTypeId,
                    year: vm.poa.year,
                    id: vm.poa.id
                },
                function (data) {
                    if(data.response === true){
                        vm.isSaving = true;
                        if (vm.poa.id !== null) {
                            Poa.update(vm.poa, onSaveSuccess, onSaveError);
                        } else {
                            Poa.save(vm.poa, onSaveSuccess, onSaveError);
                        }
                    }else{
                        if (vm.poa.id !== null) {
                            AlertService.error($translate.instant("metroquitoApp.poa.invalidModification"));
                        }else{
                            AlertService.error($translate.instant("metroquitoApp.poa.invalidCreation"));
                        }
                    }
                });
        }

        function onSaveSuccess (result) {
            $scope.$emit('metroquitoApp:poaUpdate', result);
            $state.go('poa', null, {reload: true});
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }

        function openCalendar(date) {
            vm.datePickerOpenStatus[date] = true;
        }

        vm.yearOption = {
            minMode: 'year',
            minDate: new Date(new Date().getFullYear(),0,1),
            maxDate: new Date(new Date().getFullYear() + 1,0,1)
        };

        $scope.$watch('vm.year', updateAsync);
        function updateAsync() {
            vm.yearOption = {
                minMode: 'year',
                minDate: new Date(new Date().getFullYear(),0,1),
                maxDate: new Date(new Date().getFullYear() + 1,0,1)
            };

            $scope.$evalAsync();
        }

        function poastatesFilter(list){
            if(vm.poa.id === null){
                //when creating the POA the only state possible is Activated
                vm.poastates.push(list[vm.activatedStateId - 1]);

            }else{
                if(vm.poa.poaStateId === vm.activatedStateId){
                    vm.poastates.push(list[vm.activatedStateId - 1]);

                    //remove date's paremeters when the tests are over
                    var today = new Date();
                    var poaDate = new Date(vm.poa.year, 0, 1);

                    if(today >= poaDate){
                        vm.poastates.push(list[vm.revisedStateId - 1]);
                    }
                }

                if(vm.poa.poaStateId === vm.revisedStateId) {
                    vm.poastates.push(list[vm.revisedStateId - 1]);
                    vm.poastates.push(list[vm.approvedStateId - 1]);
                }

                if(vm.poa.poaStateId === vm.approvedStateId) {
                    vm.poastates.push(list[vm.approvedStateId - 1]);
                    vm.poastates.push(list[vm.reformedStateId - 1]);
                    vm.poastates.push(list[vm.closedStateId - 1]);
                }

                if(vm.poa.poaStateId === vm.reformedStateId) {
                    vm.poastates.push(list[vm.reformedStateId - 1]);
                    vm.poastates.push(list[vm.closedStateId - 1]);
                }

                if(vm.poa.poaStateId === vm.closedStateId) {
                    vm.poastates.push(list[vm.closedStateId - 1]);
                }
            }
        }
    }
})();
