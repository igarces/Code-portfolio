(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('MonitoringControlController', MonitoringControlController);

    MonitoringControlController.$inject = ['$scope', 'Principal', 'LoginService', '$state', 'SystemFunction'];

    function MonitoringControlController ($scope, Principal, LoginService, $state, SystemFunction) {
        var vm = this;

        vm.account = null;
        vm.isAuthenticated = null;
        vm.login = LoginService.open;
        vm.register = register;
        $scope.$on('authenticationSuccess', function() {
            getAccount();
        });

        getAccount();

        vm.permittedSF = [];
        vm.permitted = permitted;
        vm.permittedSF = SystemFunction.permitted();

        function permitted(systemFunctionId){
            var exist = false;
            vm.permittedSF.forEach(function (value) {
                if (systemFunctionId == value){
                    exist = true;
                }
            });
            return exist;
        }

        function getAccount() {
            Principal.identity().then(function(account) {
                vm.account = account;
                vm.isAuthenticated = Principal.isAuthenticated;
            });
        }
        function register () {
            $state.go('register');
        }
    }
})();
