(function() {
    'use strict';
    angular
        .module('metroquitoApp')
        .factory('SubactivityMonitoring', SubactivityMonitoring);

    SubactivityMonitoring.$inject = ['$resource', 'DateUtils'];

    function SubactivityMonitoring ($resource, DateUtils) {
        var resourceUrl =  'api/subactivity-monitorings/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                        data.startDate = DateUtils.convertLocalDateFromServer(data.startDate);
                        data.finalDate = DateUtils.convertLocalDateFromServer(data.finalDate);
                    }
                    return data;
                }
            },
            'update': {
                method: 'PUT',
                transformRequest: function (data) {
                    data.startDate = DateUtils.convertLocalDateToServer(data.startDate);
                    data.finalDate = DateUtils.convertLocalDateToServer(data.finalDate);
                    return angular.toJson(data);
                }
            },
            'save': {
                method: 'POST',
                transformRequest: function (data) {
                    data.startDate = DateUtils.convertLocalDateToServer(data.startDate);
                    data.finalDate = DateUtils.convertLocalDateToServer(data.finalDate);
                    return angular.toJson(data);
                }
            },
            'getMonitoringBySubactivity':{
                method: 'GET',
                isArray: true,
                url: 'api/subactivity-monitorings-by-subactivity',
                parameters: {
                    subactivityId: null,
                    year: null,
                    month: null
                }
            }
        });
    }
})();
