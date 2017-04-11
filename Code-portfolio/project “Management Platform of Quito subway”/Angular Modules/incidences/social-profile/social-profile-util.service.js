(function () {
    'use strict';
    angular
        .module('metroquitoApp')
        .factory('SocialProfileUtil', SocialProfileUtil);

    SocialProfileUtil.$inject = [];

    function SocialProfileUtil() {
        return {
            getAffectedMedium: getAffectedMedium,
            findSexInList: findSexInList,
            findInfrastructureInList: findInfrastructureInList,
            findPropertyInList: findPropertyInList
        };

        function getAffectedMedium(socialProfile) {
            var affectedMedium = null;
            if (socialProfile !== undefined && socialProfile !== null) {
                if (socialProfile.affectedHouse) {
                    affectedMedium = 'Vivienda';
                }
                if (socialProfile.affectedBusiness) {
                    if (affectedMedium !== null) {
                        affectedMedium += ', ';
                        affectedMedium += 'Negocio';
                    } else {
                        affectedMedium = 'Negocio';
                    }
                }
                if (socialProfile.othersAffected) {
                    if (affectedMedium !== null) {
                        affectedMedium += ', ';
                        affectedMedium += socialProfile.othersAffected;
                    } else {
                        affectedMedium = socialProfile.othersAffected;
                    }
                }
            }
            return affectedMedium;
        }

        function findSexInList(genders, sexId) {
            for (var index in genders) {
                if (genders[index] && genders[index].id === sexId) {
                    return genders[index].name;
                }
            }
            return '';
        }

        function findInfrastructureInList(infrastructuretypenoms, infrastructureId) {
            for (var index in infrastructuretypenoms) {
                if (infrastructuretypenoms[index] && infrastructuretypenoms[index].id === infrastructureId) {
                    return infrastructuretypenoms[index].value;
                }
            }
            return '';
        }

        function findPropertyInList(propertytypenoms, propertyId) {
            for (var index in propertytypenoms) {
                if (propertytypenoms[index] && propertytypenoms[index].id === propertyId) {
                    return propertytypenoms[index].value;
                }
            }
            return '';
        }
    }
})();

