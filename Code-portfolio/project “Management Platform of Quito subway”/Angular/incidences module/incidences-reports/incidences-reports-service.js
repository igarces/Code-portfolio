(function() {
    'use strict';
    angular
        .module('metroquitoApp')
        .factory('IncidencesReports', IncidencesReports);

    IncidencesReports.$inject = ['$resource'];

    function IncidencesReports ($resource) {

        // return {
        //     generateReportIncidenceSocialResp: generateReportIncidenceSocialResp
        // };

        // function generateReportIncidenceSocialResp() {
            var resourceUrl =  'api/incidence-social-resps-report';

            return $resource(resourceUrl, {}, {
                'citizenAttentionReport': {
                    method: 'GET',
                    url: 'api/report/citizen-attention-report',
                    params: {
                        fromDate: null,
                        toDate: null,
                        stationId: null,
                        stretchTunnelId: null
                    },
                    headers: {
                        accept: 'application/octet-stream'
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
                },
                'incidenceTechnicalReport': {
                    method: 'GET',
                    url: 'api/report/incidence-technical-report',
                    params: {
                        fromDate: null,
                        toDate: null,
                        stationId: null,
                        administrativeUnitId: null,
                        responsible: null,
                        activityId: null,
                        stateId: null
                    },
                    headers: {
                        accept: 'application/octet-stream'
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
                },
                'visitReport': {
                    method: 'GET',
                    url: 'api/report/visit-report',
                    params: {
                        fromDate: null,
                        toDate: null,
                        administrativeUnitId: null,
                        functionary: null,
                        activityId: null
                    },
                    headers: {
                        accept: 'application/octet-stream'
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
                },
                'incidenceSocialRespReport': {
                    method: 'GET',
                    url: 'api/report/incidence-social-resp-report',
                    params: {
                        fromDate: null,
                        toDate: null,
                        stationId: null,
                        stretchTunnelId: null,
                        incidenceTypeId: null,
                        socialPromoter: null,
                        incidenceStateId: null
                    },
                    headers: {
                        accept: 'application/octet-stream'
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
                },
                'incidenceGraphicReport': {
                    method: 'GET',
                    url: 'api/report/incidence-graphic-report',
                    params: {
                        fromDate: null,
                        toDate: null,
                        stationId: null,
                        stretchTunnelId: null,
                        socialPromoter: null,
                        incidenceStateId: null
                    },
                    headers: {
                        accept: 'application/octet-stream'
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
        // }
    }
})();
