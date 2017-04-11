(function() {
    'use strict';
    angular
        .module('metroquitoApp')
        .factory('ActivityPoa', ActivityPoa);

    ActivityPoa.$inject = ['$resource', 'DateUtils'];

    function ActivityPoa ($resource, DateUtils) {
        var resourceUrl =  'api/activity-poas/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'findOneActivity': {
                method: 'GET',
                url: 'api/activity-poas/findOneActivity',
                parameters: {
                    id: null
                }
            },
            'queryHeadingSubheadings': {
                method: 'GET',
                url: 'api/activity-poas/headingSubheadings',
                isArray: true,
                parameters: {
                    activityPoaId: null
                }
            },
            'search': {
                method: 'GET',
                isArray: true,
                url: 'api/activity-poas-filter',
                parameters: {
                    description: null,
                    fromDate: null,
                    toDate: null,
                    responsible: null,
                    administrativeUnit: null,
                    productId: null,
                    adminUnitDirection: null
                }
            },
            'activityForUpdates': {
                method: 'GET',
                isArray: true,
                url: 'api/activity-poas-for-update',
                parameters: {
                    date: null,
                    administrativeUnit: null
                }
            },
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                        data.startDate = DateUtils.convertLocalDateFromServer(data.startDate);
                        data.finalDate = DateUtils.convertLocalDateFromServer(data.finalDate);
                        data.registrationDate = DateUtils.convertLocalDateFromServer(data.registrationDate);
                    }
                    return data;
                }
            },
            'update': {
                method: 'PUT',
                transformRequest: function (data) {
                    data.startDate = DateUtils.convertLocalDateToServer(data.startDate);
                    data.finalDate = DateUtils.convertLocalDateToServer(data.finalDate);
                    data.registrationDate = DateUtils.convertLocalDateToServer(data.registrationDate);
                    return angular.toJson(data);
                }
            },
            'updateList': {
                method: 'PUT',
                isArray: true,
                url: '/api/activity-poas-updateList',
                transformRequest: function (data) {
                    return angular.toJson(data);
                }
            },
            'updataActivity': {
                method: 'PUT',
                url: '/api/activity-poas-update',
                transformRequest: function (data) {
                    data.startDate = DateUtils.convertLocalDateToServer(data.startDate);
                    data.finalDate = DateUtils.convertLocalDateToServer(data.finalDate);
                    data.registrationDate = DateUtils.convertLocalDateToServer(data.registrationDate);
                    return angular.toJson(data);
                }
            },
            'save': {
                method: 'POST',
                transformRequest: function (data) {
                    data.startDate = DateUtils.convertLocalDateToServer(data.startDate);
                    data.finalDate = DateUtils.convertLocalDateToServer(data.finalDate);
                    data.registrationDate = DateUtils.convertLocalDateToServer(data.registrationDate);
                    return angular.toJson(data);
                }
            }
        });
    }
})();
