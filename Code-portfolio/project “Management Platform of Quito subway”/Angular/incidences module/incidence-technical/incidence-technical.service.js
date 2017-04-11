(function() {
    'use strict';
    angular
        .module('metroquitoApp')
        .factory('IncidenceTechnical', IncidenceTechnical);

    IncidenceTechnical.$inject = ['$resource'];

    function IncidenceTechnical ($resource) {
        this.incidenceId = null;
        this.stateIncidence = null;
        this.incidenceIdDetail= null;

        var resourceUrl =  'api/incidence-technicals/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'search': { method: 'GET', isArray: true,
                params: {
                    reportId: null,
                    incidenceNumber: null,
                    fromDate: null,
                    toDate: null,
                    state: null,
                    responsible: null,
                    administrativeUnitId: null
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
            'assign': { method:'PUT', url: 'api/assign-incidence-technicals', },
            'export': {
                method: 'GET',
                url: 'api/export-incidence-technicals',
                params: {
                    incidenceTechnicalId: null,
                    userName: null
                },
                headers: {
                    accept: 'application/pdf'
                },
                responseType: 'arraybuffer',
                cache: false,
                transformResponse: function (data) {
                    return {
                        response: new Blob([data], {
                            type: 'application/pdf'
                        })
                    };
                }
            }
        });
    }
})();
