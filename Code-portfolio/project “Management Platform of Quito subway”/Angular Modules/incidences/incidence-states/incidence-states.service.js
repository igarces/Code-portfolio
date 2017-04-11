(function() {
    'use strict';
    angular
        .module('metroquitoApp')
        .factory('IncidenceStates', IncidenceStates);

    IncidenceStates.$inject = ['$resource', 'DateUtils'];

    function IncidenceStates ($resource, DateUtils) {
        var resourceUrl =  'api/incidence-states/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'search': { method: 'GET', isArray: true, params: {incidenceId: null, owner: null}},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                        data.date = DateUtils.convertLocalDateFromServer(data.date);
                    }
                    return data;
                }
            },
            'update': {
                method: 'PUT',
                transformRequest: function (data) {
                    data.date = DateUtils.convertLocalDateToServer(data.date);
                    return angular.toJson(data);
                }
            },
            'save': {
                method: 'POST',
                transformRequest: function (data) {
                    data.date = DateUtils.convertLocalDateToServer(data.date);
                    return angular.toJson(data);
                }
            }
        });
    }
})();
