import angular from 'angular';
import ContentLoadArticlesTemplate from './views/contentLoadArticles.tpl';
import 'angular-ui-grid';

let loadArticlesModule = angular.module('app.loadArticles.configuration', [
    ContentLoadArticlesTemplate.name,
    'ui.grid',
    'ui.grid.edit',
    'ui.grid.autoResize',
    'ui.grid.moveColumns',
    'ui.grid.resizeColumns',
	'ui.grid.pinning',
]);

loadArticlesModule.config(($stateProvider, kRouteProvider, kConstantProvider) => {
    let parent = kRouteProvider.parent();
    console.log(`${parent}load`);
    $stateProvider
        .state(`${parent}load`, {
            url: '/fluxAuthorization?pPC={}&pU={}&pWII={}&pFI={}&pC={}&cU={}&pWA={}&pWAN={}',
            views: {
                'center@fluxAuthorization': {
                    templateUrl: ContentLoadArticlesTemplate.name,
                    controller: 'contentLoadArticlesController',
                    controllerAs: 'contentLoadArticles',
                    resolve: {
                        appConstant: () => {
                            return kConstantProvider.$getConstant('articles');
                        }
                    }
                }
            }
        });
});

export default loadArticlesModule;
