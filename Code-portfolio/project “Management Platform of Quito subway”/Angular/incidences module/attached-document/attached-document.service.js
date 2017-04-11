(function() {
    'use strict';
    angular
        .module('metroquitoApp')
        .factory('AttachedDocument', AttachedDocument);

    AttachedDocument.$inject = ['$resource'];

    function AttachedDocument ($resource) {
        var resourceUrl =  'api/attached-documents/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true, params: {reportId: null}},
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
