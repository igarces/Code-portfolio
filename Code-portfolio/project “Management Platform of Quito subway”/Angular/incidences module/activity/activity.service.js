(function() {
    'use strict';
    angular
        .module('metroquitoApp')
        .factory('Activity', Activity);

    Activity.$inject = ['$resource'];

    function Activity ($resource) {
        var resourceUrl =  'api/activities/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true },
            'getAll': { method: 'GET', isArray: true, url: 'api/all-activities' },
            'search': { method: 'GET', isArray: true, params: {name: null}},
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
