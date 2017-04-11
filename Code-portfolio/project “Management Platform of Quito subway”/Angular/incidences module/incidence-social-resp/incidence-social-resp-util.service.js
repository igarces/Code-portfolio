(function () {
    'use strict';
    angular
        .module('metroquitoApp')
        .factory('IncidenceSocialRespUtil', IncidenceSocialRespUtil);

    IncidenceSocialRespUtil.$inject = ['$q','Principal', 'User'];

    function IncidenceSocialRespUtil($q, Principal, User) {
        return {
            getIncidenceType: getIncidenceType,
            getCategory: getCategory,
            getUser: getUser
        };

        function getIncidenceType(incidencetypenoms, incidenceTypeId) {
            if(incidenceTypeId !== null && incidencetypenoms){
                for(var index in incidencetypenoms){
                    if(incidencetypenoms[index].id === incidenceTypeId){
                        return incidencetypenoms[index].value;
                    }
                }
            }
            return '';
        }

        function getCategory(categorynoms, categoryId) {
            if(categoryId !== null && categorynoms){
                for(var index in categorynoms){
                    if(categorynoms[index].id === categoryId){
                        return categorynoms[index].value;
                    }
                }
            }
            return '';
        }

        function getUser(users, userId){
            if(users && users.length && userId !== null && userId !== undefined){
                for(var index in users){
                    if(users[index] && users[index].id === userId){
                        return users[index];
                    }
                }
            }
            return null;
        }

        function getUserName() {
            var deferred = $q.defer();

            Principal.identity().then(function (account) {
                deferred.resolve(account.login);
                // User.get({login: account.login}, function (result) {
                //     return result.firstName + ' ' + result.lastName;
                // });
            }).catch(function() {
                deferred.reject('error');
            });

            return deferred.promise;
        }
    }
})();
