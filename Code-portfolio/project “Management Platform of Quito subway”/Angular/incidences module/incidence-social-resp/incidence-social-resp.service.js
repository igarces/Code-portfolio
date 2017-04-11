(function() {
    'use strict';
    angular
        .module('metroquitoApp')
        .factory('IncidenceSocialResp', IncidenceSocialResp);

    IncidenceSocialResp.$inject = ['$resource', 'DateUtils'];

    function IncidenceSocialResp ($resource, DateUtils) {
        this.stateIncidence = null;
        this.verification = null;
        this.incidenceId = null;
        this.incidenceIdEdit = null;
        this.incidenceIdDetail = null;
        this.initSystemDate = null;
        this.markers = null;

        var resourceUrl =  'api/incidence-social-resps/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true,
                params: {
                    fromDate: null,
                    toDate: null,
                    incidenceNumber: null,
                    incidenceTypeId: null,
                    incidenceStateId: null,
                    responsible: null,
                    administrativeUnitId: null,
                    promotor: null
                }
            },
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                        data.incidenceRealDate = DateUtils.convertLocalDateFromServer(data.incidenceRealDate);
                        data.incidenceReportDate = DateUtils.convertLocalDateFromServer(data.incidenceReportDate);
                        data.complaintClaimRegistrationDate = DateUtils.convertLocalDateFromServer(data.complaintClaimRegistrationDate);
                    }
                    return data;
                }
            },
            'update': {
                method: 'PUT',
                transformRequest: function (data) {
                    data.incidenceRealDate = DateUtils.convertLocalDateToServer(data.incidenceRealDate);
                    data.incidenceReportDate = DateUtils.convertLocalDateToServer(data.incidenceReportDate);
                    data.complaintClaimRegistrationDate = DateUtils.convertLocalDateToServer(data.complaintClaimRegistrationDate);
                    return angular.toJson(data);
                }
            },
            'assign': {
                method: 'PUT',
                url: 'api/assign-incidence-social-resps',
                transformRequest: function (data) {
                    data.incidenceRealDate = DateUtils.convertLocalDateToServer(data.incidenceRealDate);
                    data.incidenceReportDate = DateUtils.convertLocalDateToServer(data.incidenceReportDate);
                    data.complaintClaimRegistrationDate = DateUtils.convertLocalDateToServer(data.complaintClaimRegistrationDate);
                    return angular.toJson(data);
                }
            },
            'save': {
                method: 'POST',
                transformRequest: function (data) {
                    data.incidenceRealDate = DateUtils.convertLocalDateToServer(data.incidenceRealDate);
                    data.incidenceReportDate = DateUtils.convertLocalDateToServer(data.incidenceReportDate);
                    data.complaintClaimRegistrationDate = DateUtils.convertLocalDateToServer(data.complaintClaimRegistrationDate);
                    return angular.toJson(data);
                }
            },
            'saveNew': {
                method: 'POST',
                url: 'api/save-incidence-social-resps',
                transformRequest: function (data) {
                    data.incidenceRealDate = DateUtils.convertLocalDateToServer(data.incidenceRealDate);
                    data.incidenceReportDate = DateUtils.convertLocalDateToServer(data.incidenceReportDate);
                    data.complaintClaimRegistrationDate = DateUtils.convertLocalDateToServer(data.complaintClaimRegistrationDate);
                    return angular.toJson(data);
                }
            },
            'accept': {
                method: 'POST',
                url: 'api/accept-incidence-social-resps',
                transformRequest: function (data) {
                    data.incidenceRealDate = DateUtils.convertLocalDateToServer(data.incidenceRealDate);
                    data.incidenceReportDate = DateUtils.convertLocalDateToServer(data.incidenceReportDate);
                    data.complaintClaimRegistrationDate = DateUtils.convertLocalDateToServer(data.complaintClaimRegistrationDate);
                    return angular.toJson(data);
                }
            },
            'export': {
                method: 'GET',
                url: 'api/export-incidence-social-resps',
                params: {
                    incidenceId: null,
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
