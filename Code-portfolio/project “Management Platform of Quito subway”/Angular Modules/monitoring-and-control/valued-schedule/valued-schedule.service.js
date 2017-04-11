(function() {
    'use strict';
    angular
        .module('metroquitoApp')
        .factory('ValuedSchedule', ValuedSchedule);

    ValuedSchedule.$inject = ['$resource', 'DateUtils'];

    function ValuedSchedule ($resource, DateUtils) {
        var resourceUrl =  'api/valued-schedules/:id';

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
                        data.registrationDate = DateUtils.convertDateTimeFromServer(data.registrationDate);
                    }
                    return data;
                }
            },
            'getComparison': {
                method: 'GET',
                url: 'api/valued-schedules-compare/:id',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' },
            'getMonthList': {
                method: 'GET',
                url: 'api/valued-schedules-month-list/:id',
                isArray: true
            },
            'getFinancialExecution': {
                method: 'GET',
                url: 'api/valued-schedules-financial-execution',
                parameters: {
                    month: null,
                    valuedSchedule: null
                },
                // isArray: true
            },
            'export': {
                method: 'GET',
                url: 'api/export-valued-schedules',
                params: {
                    scheduleId: null
                },
                headers: {
                    //'Content-Type': 'application/vnd.ms-excel',
                    accept: 'application/vnd.ms-excel'
                },
                responseType: 'arraybuffer',
                cache: false,
                transformResponse: function (data) {
                    return {
                        response: new Blob([data], {
                            type: 'application/vnd.ms-excel'
                        })
                    };
                }
            },
            'exportFinancialExecution': {
                method: 'GET',
                url: 'api/export-financial-execution',
                params: {
                    scheduleId: null
                },
                headers: {
                    //'Content-Type': 'application/vnd.ms-excel',
                    accept: 'application/vnd.ms-excel'
                },
                responseType: 'arraybuffer',
                cache: false,
                transformResponse: function (data) {
                    return {
                        response: new Blob([data], {
                            type: 'application/vnd.ms-excel'
                        })
                    };
                }
            },
            'generatePepReport': {
                method: 'GET',
                url: 'api/pep-report',
                params: {
                    date: null,
                    finalDate: null
                },
                headers: {
                    accept: 'application/vnd.ms-excel'
                },
                responseType: 'arraybuffer',
                cache: false,
                transformResponse: function (data) {
                    return {
                        response: new Blob([data], {
                            type: 'application/vnd.ms-excel'
                        })
                    };
                }
            },
            'generatePoaPlmqReport': {
                method: 'GET',
                url: 'api/poa-plmq-report',
                params: {
                    fromDate: null,
                    toDate: null
                },
                headers: {
                    accept: 'application/vnd.ms-excel'
                },
                responseType: 'arraybuffer',
                cache: false,
                transformResponse: function (data) {
                    return {
                        response: new Blob([data], {
                            type: 'application/vnd.ms-excel'
                        })
                    };
                }
            }
        });
    }
})();
