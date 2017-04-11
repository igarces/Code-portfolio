(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('ChangesController', ChangesController);

    ChangesController.$inject = ['$state', 'entity', 'Schedule', 'AlertService', 'pagingParams', 'ParseLinks', 'paginationConstants'];

    function ChangesController($state ,entity, Schedule, AlertService, pagingParams, ParseLinks, paginationConstants) {
        var vm = this;

        vm.schedule = entity;
        vm.cancel = cancel;
        vm.itemsPerPage = paginationConstants.itemsPerPage;
        vm.predicate = pagingParams.predicate;
        vm.reverse = pagingParams.ascending;
        vm.transition = transition;

        loadChanges();

        function loadChanges() {
            Schedule.changes(
                {
                    idSchedule:vm.schedule.id,
                    page: pagingParams.page - 1,
                    size: vm.itemsPerPage,
                    sort: sort()
                }, onSuccess, onError);
            function sort() {
               return 'id';
            }
            function onSuccess(data, headers) {
                vm.changes = data;
                vm.links = ParseLinks.parse(headers('link'));
                vm.totalItems = headers('X-Total-Count');
                vm.queryCount = vm.totalItems;
                vm.page = pagingParams.page;
            }
            function onError(error) {
                AlertService.error(error.data.message);
            }
        }

        function transition () {
            $state.transitionTo($state.$current, {
                id: vm.schedule.id,
                page: vm.page
            });
        }

        function cancel(){
            $state.go('schedule', null, {reload: true});
        }

    }

})();
