(function() {
    'use strict';
    angular
        .module('metroquitoApp')
        .factory('ActivityBudget', ActivityBudget);

    ActivityBudget.$inject = ['$resource'];

    function ActivityBudget ($resource) {
        var resourceUrl =  'api/activity-budgets/:id';

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
            'update': { method:'PUT' }
        });
    }
})();
