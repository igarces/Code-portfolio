(function() {
    'use strict';
    angular
        .module('metroquitoApp')
        .factory('HeadingSubheading', HeadingSubheading);

    HeadingSubheading.$inject = ['$resource'];

    function HeadingSubheading ($resource) {
        var resourceUrl =  'api/heading-subheadings/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'getAllSubheadings': {
                method: 'GET',
                isArray: true,
                url: 'api/heading-subheadings/subheadings'
            },
            'getAllSubheadingsComplete': {
                method: 'GET',
                isArray: true,
                url: 'api/heading-subheadings/subheadingscomplete'
            },
            'search': {
                method: 'GET',
                isArray: true,
                url: 'api/heading-subheadings/filter',
                parameters: {
                    code: null,
                    heading: null,
                    subheading: null
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
                    id: null,
                    code: null,
                    description: null
                },
                url: 'api/heading-subheadings-validate',
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
