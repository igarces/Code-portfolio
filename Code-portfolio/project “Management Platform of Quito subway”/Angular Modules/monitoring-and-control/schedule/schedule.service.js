(function() {
    'use strict';
    angular
        .module('metroquitoApp')
        .factory('Schedule', Schedule);

    Schedule.$inject = ['$resource', 'DateUtils'];

    function Schedule ($resource, DateUtils) {
        var resourceUrl =  'api/schedules/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true, transformResponse: function (data) {
                if (data) {
                    data = angular.fromJson(data);
                    for (var i = 0; i < data.length; i++){
                        if(data[i].active){
                            data[i].active = 'Activo';
                        }else
                            data[i].active = 'Inactivo';
                    }
                }
                return data;
            }},
            'search': {
                method: 'GET',
                url: 'api/schedules/search',
                parameters: {
                    dateFrom: null,
                    dateTo: null
                },
                isArray: true,transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                        for (var i = 0; i < data.length; i++){
                            if(data[i].active){
                                data[i].active = 'Activo';
                            }else
                                data[i].active = 'Inactivo';
                        }
                    }
                    return data;
                }
            },
            'exist': {
                method: 'GET',
                url: 'api/schedules/exist',
                parameters: {
                    name: null
                }
            },
            'changes': {
                method: 'GET',
                url: 'api/schedules/changes',
                parameters: {
                    idSchedule: null
                },
                isArray: true
            },
            'last': {
                method: 'GET',
                url: 'api/schedules/last',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                        data.dateDeclaredBase = DateUtils.convertDateTimeFromServer(data.dateDeclaredBase);
                        if(data.active){
                            data.active = 'Activo';
                        }else
                            data.active = 'Inactivo';
                    }
                    return data;
                }
            },
            'download': {
                method: 'GET',
                url: 'api/schedules/download',
                params: {
                    scheduleId: null
                },
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                        data.dateDeclaredBase = DateUtils.convertDateTimeFromServer(data.dateDeclaredBase);
                        if(data.active){
                            data.active = 'Activo';
                        }else
                            data.active = 'Inactivo';
                    }
                    return data;
                }
            },
            'state': {
                method: 'GET',
                params: {
                    idSchedule: null
                },
                url: 'api/schedules/state'
            },
            'chartS': {
                method: 'GET',
                url: 'api/schedules/chart-s'
            },
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                        data.dateDeclaredBase = DateUtils.convertDateTimeFromServer(data.dateDeclaredBase);
                        if(data.active){
                            data.active = 'Activo';
                        }else
                            data.active = 'Inactivo';
                    }
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
})();
