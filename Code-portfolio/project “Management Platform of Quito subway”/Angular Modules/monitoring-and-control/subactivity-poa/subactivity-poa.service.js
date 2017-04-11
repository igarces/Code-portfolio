(function() {
    'use strict';
    angular
        .module('metroquitoApp')
        .factory('SubactivityPoa', SubactivityPoa);

    SubactivityPoa.$inject = ['$resource', 'DateUtils'];

    function SubactivityPoa ($resource, DateUtils) {
        var resourceUrl =  'api/subactivity-poas/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'search': {
                method: 'GET',
                isArray: true,
                url: 'api/subactivity-poas-filter',
                parameters: {
                    description: null,
                    fromDate: null,
                    toDate: null,
                    responsible: null,
                    administrativeUnitId: null,
                    subactivityId: null,
                    activityId: null
                }
            },
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                        data.startDate = DateUtils.convertLocalDateFromServer(data.startDate);
                        data.finalDate = DateUtils.convertLocalDateFromServer(data.finalDate);
                        data.registrationDate = DateUtils.convertLocalDateFromServer(data.registrationDate);
                    }
                    return data;
                }
            },
            'update': {
                method: 'PUT',
                transformRequest: function (data) {
                    data.startDate = DateUtils.convertLocalDateToServer(data.startDate);
                    data.finalDate = DateUtils.convertLocalDateToServer(data.finalDate);
                    data.registrationDate = DateUtils.convertLocalDateToServer(data.registrationDate);
                    return angular.toJson(data);
                }
            },
            'save': {
                method: 'POST',
                transformRequest: function (data) {
                    data.startDate = DateUtils.convertLocalDateToServer(data.startDate);
                    data.finalDate = DateUtils.convertLocalDateToServer(data.finalDate);
                    data.registrationDate = DateUtils.convertLocalDateToServer(data.registrationDate);
                    return angular.toJson(data);
                }
            }
        });
    }
})();
