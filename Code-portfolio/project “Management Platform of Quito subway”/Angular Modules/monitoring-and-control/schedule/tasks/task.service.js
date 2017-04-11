(function() {
    'use strict';
    angular
        .module('metroquitoApp')
        .factory('Task', Task);

    Task.$inject = ['$resource'];

    function Task ($resource) {
        var resourceUrl =  'api/tasks/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': { method: 'GET', isArray: true},
            'search': {
                method: 'GET',
                url: 'api/tasks/search',
                parameters: {
                    idSchedule: null
                },
                isArray: true
            },
            'getParent': {
                method: 'GET',
                url: 'api/tasks/parent',
                parameters: {
                    idSchedule: null
                }
            },
            'stations': {
                method: 'GET',
                url: 'api/tasks/stations',
                isArray: true
            },
            'update': { method:'PUT' }
        });
    }
})();
