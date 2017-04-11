(function() {
    'use strict';
    angular
        .module('metroquitoApp')
        .factory('ActivityBreakdown', ActivityBreakdown);

    ActivityBreakdown.$inject = ['$resource'];

    function ActivityBreakdown ($resource) {
        var resourceUrl =  'api/activity-breakdowns/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' },
            'save': {
                method: 'POST',
                url: 'api/activity-breakdowns-list',
                transformRequest: function (data) {
                    return angular.toJson(data);
                }
            },
            'getBreakdownByActivity':{
                method: 'GET',
                isArray: true,
                url: 'api/activity-breakdowns-by-activity',
                parameters: {
                    activityId: null,
                }
            },
            'getBreakdownBySubactivity':{
                method: 'GET',
                isArray: true,
                url: 'api/activity-breakdowns-by-subactivity',
                parameters: {
                    subactivityId: null,
                    year: null
                }
            }
        });
    }
})();
