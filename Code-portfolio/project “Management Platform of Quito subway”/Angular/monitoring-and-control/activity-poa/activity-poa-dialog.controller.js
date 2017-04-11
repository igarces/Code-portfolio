(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('ActivityPoaDialogController', ActivityPoaDialogController);

    ActivityPoaDialogController.$inject = ['$timeout', '$scope', '$stateParams', 'entity', 'ActivityPoa', 'ProductAU', 'CostCenter', 'Priority',
                                        'HeadingSubheading', 'User', '$state', 'AlertService', '$translate', '$window', 'nomenclatorsConstants', 'AdminUnitDirection'];

    function ActivityPoaDialogController ($timeout, $scope, $stateParams, entity, ActivityPoa, ProductAU, CostCenter, Priority,
                                          HeadingSubheading, User, $state, AlertService, $translate, $window, nomenclatorsConstants, AdminUnitDirection) {
        var vm = this;

        vm.activityPoa = entity;
        vm.activityPoa.plannedGoal = Number(vm.activityPoa.plannedGoal);
        vm.activityPoa.referentialAmount = parseFloat(0.00).toFixed(2);

        vm.saveStartDate = vm.activityPoa.startDate;
        vm.saveFinalDate = vm.activityPoa.FinalDate;
        vm.cancel = cancel;
        vm.datePickerOpenStatus = {};
        vm.openCalendar = openCalendar;
        vm.save = save;
        vm.changeMultiannual = changeMultiannual;
        vm.changeDrag = changeDrag;
        vm.selectAllEvent = selectAllEvent;
        vm.selectResponsible = selectResponsible;
        vm.productaus = [];
        CostCenter.search(
            {page: 0,
            size: 10000,
            code: '',
            description: '',
            active: true,
            sort: 'description,asc'}, function (list) {
                vm.costcenters = list;
                var flagSearchCostCenter = true;

                if(vm.activityPoa.costCenterId !== null){
                    for(var index in list){
                        if(list[index] && list[index].id === vm.activityPoa.costCenterId){
                            flagSearchCostCenter = false;
                            break;
                        }
                    }
                    if(flagSearchCostCenter){
                        CostCenter.get({id: vm.activityPoa.costCenterId}, function (costCenter) {
                            vm.costcenters.push(costCenter);
                        });
                    }
                }
            });
        vm.priorities = Priority.query();
        vm.headingsubheadings = HeadingSubheading.getAllSubheadings({sort: 'code,asc'});
        vm.users = [];
        vm.patternNumbersCharc = '^[0-9 \\W]+$';
        vm.patternNumbers = '^[0-9]+$';
        vm.dateformat = 'dd/MM/yyyy';
        vm.patternNumberDecimal = '^[0-9]+(\.[0-9]{1,2})?$';
        vm.selectAll = false;
        vm.currentYear = new Date().getFullYear();
        vm.changeProduct = changeProduct;
        vm.product = null;
        vm.adminUnitGRSAId = nomenclatorsConstants.adminUnitGRSAId;
        vm.adminUnitDPGIId = nomenclatorsConstants.adminUnitDPGIId;
        vm.isAdminUnitGRSA = false;

        initData();

        function initData(){
            User.getLoggedUser(function (userLogged) {
                if(userLogged.administrativeUnitId === vm.adminUnitGRSAId){
                    vm.isAdminUnitGRSA = true;
                    vm.directions = AdminUnitDirection.query();
                }

                var adminUnit = userLogged.administrativeUnitId === null ? '' : userLogged.administrativeUnitId;
                if(userLogged.administrativeUnitId === vm.adminUnitDPGIId){
                    adminUnit = '';
                }

                User.getUsersAdminUnit({adminUnit: userLogged.administrativeUnitId}, function (userList) {
                    vm.users = userList;
                    usersListInit();
                });

                ProductAU.search(
                    {
                        page: 0,
                        size: 10000,
                        productId: '',
                        product: '',
                        year: '' ,
                        administrativeUnit: adminUnit,
                        poaInActiveState: true,
                        sort: 'product,asc'
                    },
                    function (productList) {
                        vm.productaus = productList;

                        if(vm.activityPoa.productId !== null){
                            var flagSearchProduct = true;
                            for(var index in productList){
                                if(productList[index] && productList[index].id === vm.activityPoa.productId){
                                    vm.product = productList[index];
                                    flagSearchProduct = false;
                                    break;
                                }
                            }
                            if(flagSearchProduct){
                                //search for product with poa in a state different of active
                                ProductAU.get({id: vm.activityPoa.productId}, function (product) {
                                    vm.product = product;
                                    vm.productaus.push(product);
                                    validateDates();
                                });
                            }else{
                                validateDates();
                            }
                        }
                    }
                );

                if(vm.activityPoa.id === null){
                    vm.activityPoa.administrativeUnitId = userLogged.administrativeUnitId;
                }
            });
        }

        function usersListInit(){
            if(vm.activityPoa.id !== null){
                for(var index in vm.activityPoa.users){
                    for(var jindex in vm.users){

                        if(vm.activityPoa.users[index].id &&
                            vm.users[jindex].id &&
                            vm.activityPoa.users[index].id === vm.users[jindex].id){
                            vm.users[jindex]['select'] = true;
                        }
                    }
                }
                if(vm.activityPoa.users.length === vm.users.length){
                    vm.selectAll = true;
                }
            }
        }

        $timeout(function (){
            angular.element('.form-group:eq(0)>input').focus();
        });

        function cancel () {
            $state.go('activity-poa', null, {reload: true});
        }

        function validation(){
            if(vm.activityPoa.multiannual === true){
                var minDate;
                var maxDate;

                if(vm.product === null || vm.product === undefined){
                    minDate = new Date(vm.currentYear,0,1);
                    maxDate = new Date(vm.currentYear,11,31);
                }else{
                    minDate = new Date(vm.product.poaYear,0,1);
                    maxDate = new Date(vm.product.poaYear,11,31);
                }

                if(vm.activityPoa.startDate >= minDate && vm.activityPoa.finalDate <= maxDate){
                    AlertService.error($translate.instant("metroquitoApp.activityPoa.multiannualValidation"));
                    $window.scrollTo(0,0);
                    return false;
                }
            }

            if(vm.activityPoa.drag === true){
                var minDate;

                if(vm.product === null || vm.product === undefined){
                    minDate = new Date(vm.currentYear,0,1);
                }else{
                    minDate = new Date(vm.product.poaYear,0,1);
                }

                if(vm.activityPoa.startDate >= minDate){
                    AlertService.error($translate.instant("metroquitoApp.activityPoa.dragValidation", {poaYear: vm.product.poaYear}));
                    $window.scrollTo(0,0);
                    return false;
                }
            }

            return true;
        }

        function save () {
            if(validation()){
                vm.isSaving = true;
                var dataSave = JSON.parse(JSON.stringify(vm.activityPoa));

                dataSave.poaYear = vm.product.poaYear;
                if (vm.activityPoa.id !== null) {

                    if(vm.saveStartDate !== vm.activityPoa.startDate || vm.saveFinalDate !== vm.activityPoa.FinalDate){
                        dataSave.changeDates = true;
                    }else{
                        dataSave.changeDates = false;
                    }

                    ActivityPoa.update(dataSave, onSaveSuccess, onSaveError);
                } else {
                    ActivityPoa.save(dataSave, onSaveSuccess, onSaveError);
                }
            }

        }

        function onSaveSuccess (result) {
            $scope.$emit('metroquitoApp:activityPoaUpdate', result);
            $state.go('activity-poa', null, {reload: true});
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }

        vm.datePickerOpenStatus.startDate = false;
        vm.datePickerOpenStatus.finalDate = false;
        vm.datePickerOpenStatus.registrationDate = false;

        function openCalendar (date) {
            vm.datePickerOpenStatus[date] = true;
        }

        vm.startDateOption = {
            minDate: vm.activityPoa.multiannual === true ? null : new Date(vm.currentYear,0,1),
            maxDate: vm.activityPoa.finalDate
        };

        vm.finalDateOption = {
            minDate: vm.activityPoa.startDate
        };

        $scope.$watch('vm.activityPoa.startDate', updateAsync);
        $scope.$watch('vm.activityPoa.finalDate', updateAsync);

        function updateAsync(){
           validateDates();
        }

        function changeMultiannual(){
            validateDates();
        }

        function changeDrag(){
            validateDates();
        }

        function validateDates(){
            var minDate = null;
            var maxDate = null;

            if(vm.product === null || vm.product === undefined ){

                if(vm.activityPoa.productId === null){
                    minDate = new Date(vm.currentYear,0,1);
                    if(vm.activityPoa.multiannual !== true){
                        maxDate = new Date(vm.currentYear,11,31);
                    }
                }

            }else{
                minDate = new Date(vm.product.poaYear,0,1);

                if(vm.activityPoa.multiannual !== true){
                    maxDate = new Date(vm.product.poaYear,11,31);
                }

                if(vm.activityPoa.drag === true){
                    minDate = new Date(vm.currentYear,0,1);
                }
            }

            if(vm.activityPoa.startDate < minDate){
                vm.activityPoa.startDate = null;
            }
            if( maxDate !== null && (vm.activityPoa.finalDate > maxDate || vm.activityPoa.finalDate < minDate )){
                vm.activityPoa.finalDate = null;
            }

            vm.startDateOption = {
                minDate: minDate,
                maxDate: vm.activityPoa.finalDate === null ? maxDate : vm.activityPoa.finalDate
            };

            vm.finalDateOption = {
                minDate: vm.activityPoa.startDate === null ? minDate : vm.activityPoa.startDate,
                maxDate: maxDate,
            };

            $scope.$evalAsync();
        }

        function selectAllEvent(){
            if(vm.selectAll){
                vm.activityPoa.users = JSON.parse(JSON.stringify(vm.users));

                for(var index in vm.users){
                    if(vm.users[index].id){
                        vm.users[index]['select'] = true;
                    }
                }
            }else{
                vm.activityPoa.users = [];
                for(var index in vm.users){
                    if(vm.users[index].id){
                        vm.users[index].select = false;
                    }
                }
            }
        }

        function selectResponsible(user) {
            if(user.select === true){
                var userSelected = JSON.parse(JSON.stringify(user));
                delete(userSelected.select);
                vm.activityPoa.users.push(userSelected);
            }else{
                for(var index in vm.activityPoa.users){
                    if(vm.activityPoa.users[index] && vm.activityPoa.users[index].id === user.id){
                        vm.activityPoa.users.splice(index, 1);
                        break;
                    }
                }
            }
        }

        function changeProduct(product) {
            vm.product = product;

            validateDates();
        }


        //decimal number validation
        vm.max = 99999999.99;
        $scope.$watch('vm.activityPoa.referentialAmount', function(newValue,oldValue) {
            if (newValue != undefined && isNaN(newValue)) {
                if(oldValue === undefined || oldValue === null){
                    vm.activityPoa.referentialAmount = 0;
                }else{
                    vm.activityPoa.referentialAmount = oldValue
                }
            }

            var arr = String(newValue).split(".");
            if(arr.length === 2 && arr[1].length > 2){
                vm.activityPoa.referentialAmount = Math.floor(vm.activityPoa.referentialAmount * 100) / 100;
                vm.activityPoa.referentialAmount = vm.activityPoa.referentialAmount.toFixed(2);
            }

            if(vm.max!== undefined &&  vm.activityPoa.referentialAmount > vm.max){
                vm.activityPoa.referentialAmount = vm.max;
            }
        });

        vm.blur = function(){
            if(vm.activityPoa.referentialAmount !== null && vm.activityPoa.referentialAmount !== undefined){
                var tmp = parseFloat(vm.activityPoa.referentialAmount).toFixed(2);

                vm.activityPoa.referentialAmount = tmp;
            }
        }

        vm.addHeading = addHeading;
        vm.removeHeading = removeHeading;
        vm.activityPoa.activityPoaHeadingSubheadings = [];

        if (vm.activityPoa.id != null){
            vm.activityPoa.activityPoaHeadingSubheadings = [];
            ActivityPoa.queryHeadingSubheadings({activityPoaId: vm.activityPoa.id}, function (data) {
                for (var i = 0; i < data.length; i++){
                    var headingAdd = {
                        headingSubheadingId: data[i].headingSubheadingId,
                        headingSubheadingCode: data[i].headingSubheadingCode,
                        headingSubheadingDesc: data[i].headingSubheadingDesc,
                        amount: parseFloat(data[i].amount).toFixed(2)
                    };
                    vm.activityPoa.activityPoaHeadingSubheadings.push(headingAdd);
                }
            });
        }

        function getheadingDesc(id) {
            for (var i = 0; i < vm.headingsubheadings.length; i++){
                if(vm.headingsubheadings[i].id == id){
                    return vm.headingsubheadings[i].description;
                }
            }
        }

        function getheadingCode(id) {
            for (var i = 0; i < vm.headingsubheadings.length; i++) {
                if (vm.headingsubheadings[i].id == id) {
                    return vm.headingsubheadings[i].code;
                }
            }
        }

        vm.showAlertDuplicateHeadingSubheading = false;
        vm.showAlertreferentialAmount = false;
        vm.cleanMessage = cleanMessage;

        function cleanMessage() {
            vm.showAlertDuplicateHeadingSubheading = false;
            vm.showAlertreferentialAmount = false;
        }

        function addHeading() {
            if (vm.activityPoa.activityPoaHeadingSubheadings == null) {
                vm.activityPoa.activityPoaHeadingSubheadings = [];
            }
            if (!existHeading(getheadingCode(vm.activityPoa.headingSubheadingId))) {
                var headingAdd = {
                    activityPoaId: vm.activityPoa.id,
                    headingSubheadingId: vm.activityPoa.headingSubheadingId,
                    headingSubheadingCode: getheadingCode(vm.activityPoa.headingSubheadingId),
                    headingSubheadingDesc: getheadingDesc(vm.activityPoa.headingSubheadingId),
                    amount: vm.activityPoa.referentialAmount
                };
                if(vm.activityPoa.referentialAmount > 0.00) {
                    vm.activityPoa.activityPoaHeadingSubheadings.push(headingAdd);
                    vm.showAlertDuplicateHeadingSubheading = false;
                    vm.showAlertreferentialAmount = false;
                    }else{
                        vm.showAlertreferentialAmount = true;
                    }
            }else{
                vm.showAlertDuplicateHeadingSubheading = true;
            }
            vm.activityPoa.referentialAmount = parseFloat(0.00).toFixed(2);
            vm.activityPoa.headingSubheadingId = null;
        }

        function existHeading(code) {
            if (vm.activityPoa.activityPoaHeadingSubheadings != null && vm.activityPoa.activityPoaHeadingSubheadings.length > 0) {
                for (var i = 0; i < vm.activityPoa.activityPoaHeadingSubheadings.length; i++) {
                    if (code == vm.activityPoa.activityPoaHeadingSubheadings[i].headingSubheadingCode) {
                        return true;
                    }
                }
            }
            return false;
        }

        function removeHeading(heading) {
            var what, a = arguments, L = a.length, ax;
            while (L && vm.activityPoa.activityPoaHeadingSubheadings.length) {
                what = a[--L];
                while ((ax = vm.activityPoa.activityPoaHeadingSubheadings.indexOf(what)) !== -1) {
                    vm.activityPoa.activityPoaHeadingSubheadings.splice(ax, 1);
                }
            }
        }
    }
})();
