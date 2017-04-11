(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('HeadingSubheadingDialogController', HeadingSubheadingDialogController);

    HeadingSubheadingDialogController.$inject = ['$timeout', '$scope', '$stateParams', 'entity', 'HeadingSubheading', '$state', 'AlertService', '$translate'];

    function HeadingSubheadingDialogController ($timeout, $scope, $stateParams, entity, HeadingSubheading, $state, AlertService, $translate) {
        var vm = this;

        vm.headingSubheading = entity;
        vm.save = save;
        vm.cancel = cancel;
        vm.headingsubheadings = HeadingSubheading.query({sort: 'description,asc'});
        vm.patternNumbers = '^[0-9]+$';
        vm.pattern = '[\\S \-()]+';
        vm.headingFilter = headingFilter;
        vm.headingTypeChange = headingTypeChange;
        vm.selectedHeading = null;
        vm.changeAssociated = changeAssociated;
        vm.readOnlyCode = false;

        initData();

        function initData() {
            headingTypeChange();

            if(vm.headingSubheading.id != null && vm.headingSubheading.heading &&  vm.headingSubheading.hasSubheading){
                vm.readOnlyCode = true;
            }
        }

        $timeout(function (){
            angular.element('.form-group:eq(0)>input').focus();
        });

        function cancel () {
            $state.go('heading-subheading', null, {reload: true});
        }

        function save () {
            if(validateSubheadingCode()){
                HeadingSubheading.validate(
                    {
                        id: vm.headingSubheading.id,
                        code: vm.headingSubheading.code,
                        description: vm.headingSubheading.description
                    },
                    function (data) {
                        if(data.response === true){
                            vm.isSaving = true;
                            if(vm.headingSubheading.heading){
                                vm.headingSubheading.clarifications = null;
                                vm.headingSubheading.associatedHeadingId = null;
                            }

                            if (vm.headingSubheading.id !== null) {
                                HeadingSubheading.update(vm.headingSubheading, onSaveSuccess, onSaveError);
                            } else {
                                HeadingSubheading.save(vm.headingSubheading, onSaveSuccess, onSaveError);
                            }
                        }else{
                            if (vm.headingSubheading.id !== null) {
                                AlertService.error($translate.instant("metroquitoApp.headingSubheading.invalidModification"));
                            }else{
                                AlertService.error($translate.instant("metroquitoApp.headingSubheading.invalidCreation"));
                            }
                        }
                    });
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('metroquitoApp:headingSubheadingUpdate', result);
            cancel();
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }

        function headingFilter($select) {
            var headingList = [];

            for(var index in $select.items){
                if($select.items[index].heading){
                    headingList.push($select.items[index]);
                }
                if($select.items[index].id === vm.headingSubheading.associatedHeadingId){
                    vm.selectedHeading = $select.items[index];
                }
            }
            $select.items = headingList;
        }

        function headingTypeChange(){
            if(vm.headingSubheading.heading === false){
                vm.codeLength = 6;
            }else{
                vm.codeLength = 2;
                if(vm.headingSubheading.code !== null && vm.headingSubheading.code !== undefined &&
                    vm.headingSubheading.code.length > 2){

                    vm.headingSubheading.code = vm.headingSubheading.code.substring(0, 2);
                }
            }
        }

        function validateSubheadingCode() {
            if(vm.headingSubheading.heading === false){
                var headingCode = vm.headingSubheading.code.substring(0, 2);

                if(vm.selectedHeading !== null && headingCode !== vm.selectedHeading.code){
                    AlertService.error($translate.instant("metroquitoApp.headingSubheading.invalidSubheadingCode"));
                    return false;
                }
            }
            return true;
        }

        function changeAssociated($select) {
            vm.selectedHeading = $select.selected;
        }
    }
})();
