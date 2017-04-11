(function() {
    'use strict';
    angular
        .module('metroquitoApp')
        .factory('CostCenter', CostCenter);

    CostCenter.$inject = ['$resource'];

    function CostCenter ($resource) {
        var resourceUrl =  'api/cost-centers/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'search': {
                method: 'GET',
                isArray: true,
                url: 'api/cost-centers-filter',
                params: {
                    code: null,
                    description: null
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
            'getDescriptionsList': {
                method: 'GET',
                url: 'api/cost-centers/getDescriptionsList',
                isArray: true
            },
            'validate': {
                method: 'GET',
                params: {
                    id: null,
                    code: null,
                    description: null
                },
                url: 'api/cost-centers-validate',
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
