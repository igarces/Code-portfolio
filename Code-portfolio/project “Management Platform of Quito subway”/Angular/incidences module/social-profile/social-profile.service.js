(function() {
    'use strict';
    angular
        .module('metroquitoApp')
        .factory('SocialProfile', SocialProfile);

    SocialProfile.$inject = ['$resource'];

    function SocialProfile ($resource) {
        this.socialProfile = null;

        var resourceUrl =  'api/social-profiles/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'search': { method: 'GET', isArray: true, params: {name: null, lastName: null, infrastructureTypeId: null, sexId: null}},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
            },
            'validate': {
                method: 'GET',
                params: {
                    identityCard: null,
                    id: null
                },
                url: 'api/social-profiles-validate',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return {
                        response: data
                    };
                }
            },
            'update': { method:'PUT' }
        });
    }
})();
