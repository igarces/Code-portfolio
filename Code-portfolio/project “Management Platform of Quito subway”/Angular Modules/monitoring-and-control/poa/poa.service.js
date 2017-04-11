(function() {
    'use strict';
    angular
        .module('metroquitoApp')
        .factory('Poa', Poa);

    Poa.$inject = ['$resource'];

    function Poa ($resource) {
        var resourceUrl =  'api/poas/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'search': {
                method: 'GET',
                isArray: true,
                url: 'api/poas/filter',
                parameters: {
                    project: null,
                    dependence: null,
                    year: null,
                    program: null,
                    indicator: null,
                    goalProject: null,
                    poaType: null,
                    poaState: null
                }
            },
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
            'validate': {
                method: 'GET',
                params: {
                    type: null,
                    year: null,
                    id: null
                },
                url: 'api/poas-validate',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return {
                        response: data
                    };
                }
            },
        });
    }
})();
