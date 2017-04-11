(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('HeadingSubheadingDetailController', HeadingSubheadingDetailController);

    HeadingSubheadingDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'HeadingSubheading'];

    function HeadingSubheadingDetailController($scope, $rootScope, $stateParams, entity, HeadingSubheading) {
        var vm = this;

        vm.headingSubheading = entity;

        var unsubscribe = $rootScope.$on('metroquitoApp:headingSubheadingUpdate', function(event, result) {
            vm.headingSubheading = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
