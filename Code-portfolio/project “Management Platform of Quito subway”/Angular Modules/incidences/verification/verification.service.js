(function() {
    'use strict';
    angular
        .module('metroquitoApp')
        .factory('Verification', Verification);

    Verification.$inject = ['$resource', 'DateUtils'];

    function Verification ($resource, DateUtils) {
        var resourceUrl =  'api/verifications/:id';
        this.verification = null;

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'search': { method: 'GET', isArray: true, params: {incidenceSocialRespsId: null}},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                        data.verificationDate = DateUtils.convertDateTimeFromServer(data.verificationDate);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' },
            'export': {
                method: 'GET',
                url: 'api/export-verifications',
                params: {
                    verificationId: null,
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
