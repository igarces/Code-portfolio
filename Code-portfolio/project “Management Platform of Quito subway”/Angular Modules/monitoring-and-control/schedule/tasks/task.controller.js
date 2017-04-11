(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('TaskController', TaskController);

    TaskController.$inject = ['$scope', '$state', '$rootScope', '$stateParams', 'DataUtils', 'entity', 'Schedule', 'Task','pagingParams', 'AlertService', 'paginationConstants' , 'ParseLinks', 'GeneralParameter' , 'nomenclatorsConstants'];

    function TaskController($scope,$state , $rootScope, $stateParams, DataUtils, entity, Schedule, Task, pagingParams, AlertService, paginationConstants, ParseLinks, GeneralParameter, nomenclatorsConstants) {
        var vm = this;

        vm.schedule = entity;
        vm.predicate = pagingParams.predicate;
        vm.reverse = pagingParams.ascending;
        vm.itemsPerPage = paginationConstants.itemsPerPage;
        vm.percent = nomenclatorsConstants.percent;
        vm.percentValue = 0;
        vm.cancel = cancel;
        vm.transition = transition;
        vm.loadTasks = loadTasks;

        getParent();
        loadTasks();
        loadScheduleData();
        parameter();

        function loadScheduleData(){
            Schedule.state(
                {
                    idSchedule: vm.schedule.id
                },
                onSuccess, onError);
            function onSuccess(data) {
                vm.scheduleDataInfo = data;
            }
            function onError(error) {
                AlertService.error(error.data.message);
            }
        }

        function getParent() {
            Task.getParent({
                idSchedule: vm.schedule.id
            },onSuccess, onError);
            function onSuccess(data) {
                vm.taskParent = data;
            }
            function onError(error) {
                AlertService.error(error.data.message);
            }
        }

        function loadTasks() {
            Task.search({
                idSchedule: vm.schedule.id,
                page: pagingParams.page - 1,
                size: vm.itemsPerPage,
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
                vm.tasks = data;
                vm.page = pagingParams.page;
            }
            function onError(error) {
                AlertService.error(error.data.message);
            }
        }

        function parameter(){
            GeneralParameter.query(onSuccess, onError);
            function onSuccess(data) {
                angular.forEach(data, function (value) {
                   if(vm.percent == value.parId){
                       vm.percentValue = parseInt(value.parValue);
                   }
                });
            }
            function onError(error) {
                AlertService.error(error.data.message);
            }
        }


        function cancel(){
            $state.go('schedule', null, {reload: true});
        }

        function transition () {
            $state.transitionTo($state.current, {
                id: vm.schedule.id,
                page: vm.page,
                sort: vm.predicate + ',' + (vm.reverse ? 'asc' : 'desc')
            });
        }
    }

})();
