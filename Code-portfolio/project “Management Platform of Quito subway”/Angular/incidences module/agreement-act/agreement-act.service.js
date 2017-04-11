(function() {
    'use strict';
    angular
        .module('metroquitoApp')
        .factory('AgreementAct', AgreementAct);

    AgreementAct.$inject = ['$resource'];

    function AgreementAct ($resource) {
        var resourceUrl =  'api/agreement-acts/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
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
            'export': {
                method: 'GET',
                url: 'api/export-agreement-acts',
                params: {
                    agreementActId: null,
                    informantCompleteName: null,
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
