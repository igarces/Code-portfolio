(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('SubactivityPoaDialogController', SubactivityPoaDialogController);

    SubactivityPoaDialogController.$inject = ['$timeout', '$scope', '$state', 'entity', 'SubactivityPoa', 'ProcessStation', 'Priority',
        'User', 'ActivityPoa', 'DateUtils', 'nomenclatorsConstants', 'Site'];

    function SubactivityPoaDialogController ($timeout, $scope, $state, entity, SubactivityPoa, ProcessStation, Priority,
                                             User, ActivityPoa, DateUtils, nomenclatorsConstants, Site) {
        var vm = this;

        vm.subactivityPoa = entity;
        vm.saveStartDate = vm.subactivityPoa.startDate;
        vm.saveFinalDate = vm.subactivityPoa.FinalDate;
        vm.visitSiteStationId = nomenclatorsConstants.visitSiteStationId;
        vm.adminUnitGIFId = nomenclatorsConstants.adminUnitGIFId;
        vm.adminUnitEEIId = nomenclatorsConstants.adminUnitEEIId;
        vm.cancel = cancel;
        vm.datePickerOpenStatus = {};
        vm.openCalendar = openCalendar;
        vm.save = save;
        vm.processstations = ProcessStation.query();
        vm.priorities = Priority.query();
        vm.subactivitypoas = [];
        vm.dateformat = 'dd/MM/yyyy';
        vm.patternNumberDecimal = '^[0-9]+(\.[0-9]{1,2})?$';
        vm.patternNumbersCharc = '^[0-9 \\W]+$';
        vm.patternNumbers = '^[0-9]+$';
        vm.selectAll = false;
        vm.selectAllEvent = selectAllEvent;
        vm.selectResponsible = selectResponsible;
        vm.subactivityFilter = subactivityFilter;
        vm.changeActivity = changeActivity;
        vm.changeSubactivity = changeSubactivity;
        vm.minDate = null;
        vm.maxDate = null;
        vm.activity = null;
        vm.showStations = false;

        initData();

        function initData() {
            User.getLoggedUser(function (userLogged) {

                searchActivities(userLogged.administrativeUnitId);

                User.getUsersAdminUnit({adminUnit: userLogged.administrativeUnitId}, function (userList) {
                    vm.users = userList;

                    usersListInit();
                });

                if(userLogged.administrativeUnitId === vm.adminUnitGIFId || userLogged.administrativeUnitId === vm.adminUnitEEIId){
                    getStations();
                    vm.showStations = true;
                }
            });

            SubactivityPoa.search({
                page: 0,
                size: 10000,
                sort: 'code,asc'
            }, function (list) {
                vm.subactivitypoas = list;
            });
        }

        function searchActivities(adminUnitId){
            ActivityPoa.search({
                page: 0,
                size: 100000,
                description: null,
                fromDate: null,
                toDate: null,
                responsible: null,
                administrativeUnit: adminUnitId,
                productId: null,
                sort: 'id,asc'
            }, function (data) {
                vm.activitypoas = data;

                if(vm.subactivityPoa.subactivityPoaId === null || vm.subactivityPoa.subactivityPoaId === undefined){
                    for(var index in vm.activitypoas){
                        if(vm.activitypoas[index] && vm.activitypoas[index].id === vm.subactivityPoa.activityPoaId){
                            changeActivity(vm.activitypoas[index]);

                            break;
                        }
                    }
                }

            });
        }

        function getStations(){
            Site.getAll(function(sites){
                vm.stations = [];

                for(var index in sites){
                    if(sites[index] && sites[index].id && sites[index].typeId === vm.visitSiteStationId){
                        vm.stations.push(sites[index]);
                    }
                }
            });
        }

        function usersListInit(){
            if(vm.subactivityPoa.id !== null){
                for(var index in vm.subactivityPoa.users){
                    for(var jindex in vm.users){

                        if(vm.subactivityPoa.users[index].id &&
                            vm.users[jindex].id &&
                            vm.subactivityPoa.users[index].id === vm.users[jindex].id){
                            vm.users[jindex]['select'] = true;
                        }
                    }
                }
                if(vm.subactivityPoa.users.length === vm.users.length){
                    vm.selectAll = true;
                }
            }
        }

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function cancel () {
            $state.go('subactivity-poa', null, {reload: true});
        }

        function save () {
            vm.isSaving = true;
            var dataSave = JSON.parse(JSON.stringify(vm.subactivityPoa));
            if (vm.subactivityPoa.id !== null) {

                if(vm.saveStartDate !== vm.subactivityPoa.startDate || vm.saveFinalDate !== vm.subactivityPoa.FinalDate){
                    dataSave.changeDates = true;
                }else{
                    dataSave.changeDates = false;
                }

                SubactivityPoa.update(dataSave, onSaveSuccess, onSaveError);
            } else {
                SubactivityPoa.save(dataSave, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('metroquitoApp:subactivityPoaUpdate', result);
            $state.go('subactivity-poa', null, {reload: true});
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }

        vm.datePickerOpenStatus.startDate = false;
        vm.datePickerOpenStatus.finalDate = false;

        function openCalendar (date) {
            vm.datePickerOpenStatus[date] = true;
        }

        vm.startDateOption = {
            minDate: vm.minDate,
            maxDate: vm.subactivityPoa.finalDate
        };

        vm.finalDateOption = {
            minDate: vm.subactivityPoa.startDate,
            maxDate: vm.maxDate
        };

        $scope.$watch('vm.subactivityPoa.startDate', updateAsync);
        $scope.$watch('vm.subactivityPoa.finalDate', updateAsync);

        function updateAsync(){
            vm.startDateOption = {
                minDate: vm.minDate,
                maxDate: vm.subactivityPoa.finalDate == null ? vm.maxDate : vm.subactivityPoa.finalDate
            };

            vm.finalDateOption = {
                minDate: vm.subactivityPoa.startDate == null ? vm.minDate : vm.subactivityPoa.startDate,
                maxDate: vm.maxDate
            };

            if(vm.minDate != null && vm.subactivityPoa.startDate < vm.minDate){
                vm.subactivityPoa.startDate = null;
            }

            if(vm.maxDate !== null && (vm.subactivityPoa.finalDate > vm.maxDate || vm.subactivityPoa.finalDate < vm.minDate )){
                vm.subactivityPoa.finalDate = null;
            }

            $scope.$evalAsync();
        }

        function selectAllEvent(){
            if(vm.selectAll){
                vm.subactivityPoa.users = JSON.parse(JSON.stringify(vm.users));

                for(var index in vm.users){
                    if(vm.users[index].id){
                        vm.users[index]['select'] = true;
                    }
                }
            }else{
                vm.subactivityPoa.users = [];
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
                vm.subactivityPoa.users.push(userSelected);
            }else{
                for(var index in vm.subactivityPoa.users){
                    if(vm.subactivityPoa.users[index] && vm.subactivityPoa.users[index].id === user.id){
                        vm.subactivityPoa.users.splice(index, 1);
                        break;
                    }
                }
            }
        }

        function subactivityFilter($item) {
            if(vm.subactivityPoa.activityPoaId !== undefined && vm.subactivityPoa.activityPoaId !== null){
                if($item.activityPoaId === vm.subactivityPoa.activityPoaId && $item.level === 1){
                    return true;
                }
            }
            return false;
        }

        function changeActivity(activitySelect) {
            var activityPoa = activitySelect;
            vm.activity = activityPoa;

            if(activityPoa !== undefined && activityPoa !== null){
                vm.minDate = DateUtils.convertLocalDateFromServer(activityPoa.startDate);
                vm.maxDate = DateUtils.convertLocalDateFromServer(activityPoa.finalDate);
                updateAsync();
            }else{
                vm.minDate = null;
                vm.maxDate = null;
                updateAsync();
            }
        }

        function changeSubactivity(subactivitySelect) {
            var associatedSubactivity = subactivitySelect.selected;

            if(associatedSubactivity !== undefined && associatedSubactivity !== null){
                vm.minDate = DateUtils.convertLocalDateFromServer(associatedSubactivity.startDate);
                vm.maxDate = DateUtils.convertLocalDateFromServer(associatedSubactivity.finalDate);
                updateAsync();
            }else{
                changeActivity(vm.activity);
            }
        }

        //decimal number validation
        vm.max = 99999999.99;
        vm.subactivityPoa.plannedGoal = Number(vm.subactivityPoa.plannedGoal);
        if(vm.subactivityPoa.budget !== null && vm.subactivityPoa.budget !== undefined){
            var tmp = parseFloat(vm.subactivityPoa.budget).toFixed(2);

            vm.subactivityPoa.budget = tmp;
        }
        $scope.$watch('vm.subactivityPoa.budget', function(newValue,oldValue) {
            if (newValue != undefined && isNaN(newValue)) {
                if(oldValue === undefined || oldValue === null){
                    vm.subactivityPoa.budget = 0;
                }else{
                    vm.subactivityPoa.budget = oldValue
                }
            }

            var arr = String(newValue).split(".");
            if(arr.length === 2 && arr[1].length > 2){
                vm.subactivityPoa.budget = Math.floor(vm.subactivityPoa.budget * 100) / 100;
                vm.subactivityPoa.budget = vm.subactivityPoa.budget.toFixed(2);
            }

            if(vm.max!== undefined &&  vm.subactivityPoa.budget > vm.max){
                vm.subactivityPoa.budget = vm.max;
            }
        });

        vm.blur = function(){
            if(vm.subactivityPoa.budget !== null && vm.subactivityPoa.budget !== undefined){
                var tmp = parseFloat(vm.subactivityPoa.budget).toFixed(2);

                vm.subactivityPoa.budget = tmp;
            }
        }
    }
})();
