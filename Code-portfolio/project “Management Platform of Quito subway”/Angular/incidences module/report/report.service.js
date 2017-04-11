(function() {
    'use strict';
    angular
        .module('metroquitoApp')
        .factory('Report', Report);

    Report.$inject = ['$resource', 'DateUtils'];

    function Report ($resource, DateUtils) {
        this.reportSaved =  null;
        this.incidenceTechnical = null;
        this.incidenceTechnicalIndex = null;
        var resourceUrl =  'api/reports/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true,
                params: {
                    reportNumber: null,
                    fromDate: null,
                    toDate: null,
                    activity: null,
                    subactivity: null,
                    responsible: null,
                    visitSiteId: null,
                    stationId: null,
                    stretchTunnelId: null,
                    specialSiteId: null
                }
            },
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                        data.visitStartDate = DateUtils.convertDateTimeFromServer(data.visitStartDate);
                        data.startTime = DateUtils.convertDateTimeFromServer(data.startTime);
                        data.endTime = DateUtils.convertDateTimeFromServer(data.endTime);
                        data.reportDate = DateUtils.convertLocalDateFromServer(data.reportDate);
                    }
                    return data;
                }
            },
            'update': {
                method: 'PUT',
                transformRequest: function (data) {
                    data.visitStartDate = DateUtils.convertDateTimeFromServer(data.visitStartDate);
                    data.startTime = DateUtils.convertDateTimeFromServer(data.startTime);
                    data.endTime = DateUtils.convertDateTimeFromServer(data.endTime);
                    data.reportDate = DateUtils.convertLocalDateToServer(data.reportDate);
                    return angular.toJson(data);
                }
            },
            'save': {
                method: 'POST'
            },
            'export': {
                method: 'GET',
                url: 'api/export-reports',
                params: {
                    reportId: null,
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
