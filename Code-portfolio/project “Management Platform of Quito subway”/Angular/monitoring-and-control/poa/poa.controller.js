(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('PoaController', PoaController);

    PoaController.$inject = ['$scope', '$state', 'Poa', 'ParseLinks', 'AlertService', 'pagingParams', 'paginationConstants', 'PoaState', 'PoaType'];

    function PoaController ($scope, $state, Poa, ParseLinks, AlertService, pagingParams, paginationConstants, PoaState, PoaType) {
        var vm = this;

        vm.loadPage = loadPage;
        vm.poastates = PoaState.query();
        vm.poatypes = PoaType.query();
        vm.predicate = pagingParams.predicate;
        vm.reverse = pagingParams.ascending;
        vm.transition = transition;
        vm.itemsPerPage = paginationConstants.itemsPerPage;
        vm.openCalendar = openCalendar;
        vm.datePickerOpenStatus = {};
        vm.datePickerOpenStatus.year = false;
        vm.searchByFilters = searchByFilters;
        vm.clear = clear;
        vm.cancel = cancel;

        initializeVariables(false);
        loadAll();

        function initializeVariables(clean) {
            if(clean){
                vm.project = '';
                vm.dependence = '';
                vm.year = '';
                vm.program = '';
                vm.indicator = '';
                vm.goalProject = '';
                vm.poaType = '';
                vm.poaState = '';
            }else{
                vm.project = pagingParams.search.project;
                vm.dependence = pagingParams.search.dependence;
                vm.year = pagingParams.search.year;
                vm.program = pagingParams.search.program;
                vm.indicator = pagingParams.search.indicator;
                vm.goalProject = pagingParams.search.goalProject;
                vm.poaType = pagingParams.search.poaType;
                vm.poaState = pagingParams.search.poaState;
            }
        }

        function loadAll () {
            Poa.search({
                page: pagingParams.page - 1,
                size: vm.itemsPerPage,
                project: vm.project,
                dependence: vm.dependence,
                year: vm.year !== undefined && vm.year !== '' && vm.year !== null ? vm.year.getFullYear() : '' ,
                program: vm.program,
                indicator: vm.indicator,
                goalProject: vm.goalProject,
                poaType: vm.poaType === undefined ? '' : vm.poaType,
                poaState: vm.poaState === undefined ? '' : vm.poaState,
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
                vm.poas = data;
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
                project: vm.project,
                dependence: vm.dependence,
                year: vm.year,
                program: vm.program,
                indicator: vm.indicator,
                goalProject: vm.goalProject,
                poaType: vm.poaType,
                poaState: vm.poaState
            });
        }

        function openCalendar(date) {
            vm.datePickerOpenStatus[date] = true;
        }

        vm.yearOption = {
            minMode: 'year',
            minDate: new Date(2017,0,1)
        };

        $scope.$watch('vm.year', updateAsync);
        function updateAsync() {
            vm.yearOption = {
                minMode: 'year',
                minDate: new Date(2017,0,1)
            };

            $scope.$evalAsync();
        }

        function searchByFilters() {
            pagingParams.page = 1;
            vm.page = 1;
            transition();
        }

        function cancel(){
            $state.go('operating-plan', null, {reload: true});
        }

        function clear(){
            initializeVariables(true);
            vm.page = 1;
            transition();
        }
    }
})();
