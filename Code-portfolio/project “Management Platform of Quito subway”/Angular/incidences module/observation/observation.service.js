(function() {
    'use strict';
    angular
        .module('metroquitoApp')
        .factory('Observation', Observation);

    Observation.$inject = ['$resource'];

    function Observation ($resource) {
        var resourceUrl =  'api/observations/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'search': { method: 'GET', isArray: true, params: {incidenceId: null, owner: null}},
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
