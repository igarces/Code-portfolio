(function() {
    'use strict';
    angular
        .module('metroquitoApp')
        .factory('ProductAU', ProductAU);

    ProductAU.$inject = ['$resource'];

    function ProductAU ($resource) {
        var resourceUrl =  'api/product-aus/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'search': {
                method: 'GET',
                isArray: true,
                url: 'api/product-aus/filter',
                parameters: {
                    productId: null,
                    product: null,
                    year: null,
                    administrativeUnit: null,
                    poaInActiveState: false,
                }
            },
            'getProductBudget': {
                method: 'GET',
                isArray: true,
                url: 'api/product-aus-budget',
                parameters: {
                    productId: null,
                    administrativeUnit: null
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
            'validate': {
                method: 'GET',
                params: {
                    product: null,
                    year: null,
                    id: null,
                    administrativeUnitList: []
                },
                url: 'api/product-aus-validate',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return {
                        response: data
                    };
                }
            }
        });
    }
})();
