(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('SubactivityPoaController', SubactivityPoaController);

    SubactivityPoaController.$inject = ['$scope', '$state', 'SubactivityPoa', 'ParseLinks', 'AlertService', 'pagingParams',
        'paginationConstants', 'User', 'AdministrativeUnit', '$stateParams', 'nomenclatorsConstants'];

    function SubactivityPoaController ($scope, $state, SubactivityPoa, ParseLinks, AlertService, pagingParams, paginationConstants,
                                       User, AdministrativeUnit, $stateParams, nomenclatorsConstants) {
        var vm = this;

        vm.loadPage = loadPage;
        vm.predicate = pagingParams.predicate;
        vm.reverse = pagingParams.ascending;
        vm.transition = transition;
        vm.itemsPerPage = paginationConstants.itemsPerPage;
        vm.dateformat = 'dd/MM/yyyy';
        vm.idAdministrativeUnitDPGI = 8;
        vm.poaStateActivedId = nomenclatorsConstants.poaStateActivedId;
        vm.poaStateReformedId = nomenclatorsConstants.poaStateReformedId;
        vm.poaStateClosedId = nomenclatorsConstants.poaStateClosedId;
        vm.activityId = $stateParams.actId;
        vm.administrativeUnitList = [];
        vm.subactivitiesList = [];
        vm.searchByFilters = searchByFilters;
        vm.clear = clear;
        vm.cancel = cancel;

        initializeVariables(false);
        initData();
        loadAll();

        function initializeVariables(clean) {
            if(clean){
                vm.description = '';
                vm.fromDate = '';
                vm.toDate = '';
                vm.responsible = '';
                vm.administrativeUnit = '';
                vm.subactivityId = '';
            }else{
                vm.description = pagingParams.search.description;
                vm.fromDate = pagingParams.search.fromDate;
                vm.toDate = pagingParams.search.toDate;
                vm.responsible = pagingParams.search.responsible;
                vm.administrativeUnit = '';
                vm.subactivityId = pagingParams.search.subactivityId;
            }
        }

        function initData() {
            User.getLoggedUser(function (userLogged) {
                if(userLogged.administrativeUnitId === vm.idAdministrativeUnitDPGI){
                    vm.administrativeUnitList = AdministrativeUnit.search({'name': '', 'acronym':''});
                }else{
                    AdministrativeUnit.get({'id': userLogged.administrativeUnitId}, function (adminUnit) {
                        vm.administrativeUnitList.push(adminUnit);
                    });
                }
            });

            SubactivityPoa.search({
                page: 0,
                size: 10000,
                activityId: vm.activityId,
                sort: 'codeCompare,asc'
            }, function (list) {
                vm.subactivitiesList = list;
            });
        }

        function loadAll () {
            SubactivityPoa.search({
                page: pagingParams.page - 1,
                size: vm.itemsPerPage,
                description: vm.description,
                fromDate: vm.fromDate,
                toDate: vm.toDate,
                responsible: vm.responsible,
                administrativeUnitId: vm.administrativeUnit,
                subactivityId: vm.subactivityId ,
                activityId: vm.activityId,
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
                vm.subactivityPoas = data;
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
                description: vm.description,
                fromDate: vm.fromDate,
                toDate: vm.toDate,
                responsible: vm.responsible,
                subactivityId: vm.subactivityId,
                actId: vm.activityId
            });
        }

        function searchByFilters() {
            pagingParams.page = 1;
            vm.page = 1;
            vm.transition();
        }

        function cancel(){
            $state.go('activity-poa', null, {reload: true});
        }

        function clear(){
            initializeVariables(true);
            vm.page = 1;
            transition();
        }

        //date configurations
        vm.openCalendar = openCalendar;
        vm.datePickerOpenStatus = {};
        vm.datePickerOpenStatus.fromDate = false;
        vm.datePickerOpenStatus.toDate = false;

        function openCalendar(date) {
            vm.datePickerOpenStatus[date] = true;
        }

        vm.fromDateOption = {
            maxDate: vm.toDate
        };

        vm.toDateOption = {
            minDate: vm.fromDate
        };

        $scope.$watch('vm.toDate', updateAsync);
        $scope.$watch('vm.fromDate', updateAsync);

        function updateAsync(){
            vm.fromDateOption = {
                maxDate: vm.toDate
            };

            vm.toDateOption = {
                minDate: vm.fromDate
            };
            $scope.$evalAsync();
        }
        //end date configurations
    }
})();
