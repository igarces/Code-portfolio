(function() {
    'use strict';
    angular
        .module('metroquitoApp')
        .factory('PoaAudits', PoaAudits);

    PoaAudits.$inject = ['$resource', 'DateUtils'];

    function PoaAudits ($resource, DateUtils) {
        var resourceUrl =  'api/poa-audits/:id';

        return $resource(resourceUrl, {}, {
            'query': {
                method: 'GET',
                isArray: true,
                parameters: {
                    fromDate: null,
                    toDate: null
                }
            },
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                        data.dateHour = DateUtils.convertDateTimeFromServer(data.dateHour);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
})();
