(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('SocialProfileDeleteController',SocialProfileDeleteController);

    SocialProfileDeleteController.$inject = ['$uibModalInstance', 'entity', 'SocialProfile'];

    function SocialProfileDeleteController($uibModalInstance, entity, SocialProfile) {
        var vm = this;

        vm.socialProfile = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;
        
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            SocialProfile.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
