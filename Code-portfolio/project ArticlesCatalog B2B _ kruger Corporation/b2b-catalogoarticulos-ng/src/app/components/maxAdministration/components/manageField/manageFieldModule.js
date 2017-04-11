import angular from 'angular';
import HeaderManageFieldTemplate from './views/headerManageField.tpl';
import SideBarManageFieldTemplate from './views/sidebarManageField.tpl';
import ContentManageFieldTemplate from './views/contentManageField.tpl';

let manageFieldModule = angular.module('app.manageField.configuration', [
    HeaderManageFieldTemplate.name,
    SideBarManageFieldTemplate.name,
    ContentManageFieldTemplate.name,
]);

manageFieldModule.config(($stateProvider, kRouteProvider, kServiceProvider, kConstantProvider) => {
    //kServiceProvider.$registry('maxArticulosService');
    let parent = kRouteProvider.parent();
    console.log(`${parent}manageField`);
    $stateProvider
        .state(`${parent}manageField`, {
            url: '/maxAdministration?nktxms={}&pCodComp={}&pUserId={}&pCodFuncionario={}&pCodPerfil={}',
            views: {
                'header@maxAdministration': {
                    templateUrl: HeaderManageFieldTemplate.name,
                    controller: 'headerManageFieldController',
                    controllerAs: 'headerManageField',
					resolve: {
						appConstant: () => {
							return kConstantProvider.$getConstant('articles');
						}
					}
                },
                'left@maxAdministration': {
                    templateUrl: SideBarManageFieldTemplate.name,
                    controller: 'sidebarManageFieldController',
                    controllerAs: 'sidebarManageField',
					resolve: {
						appConstant: () => {
							return kConstantProvider.$getConstant('articles');
						}
					}
                },
                'center@maxAdministration': {
                    templateUrl: ContentManageFieldTemplate.name,
                    controller: 'contentManageFieldController',
                    controllerAs: 'contentManageField',
                    resolve: {
                        appConstant: () => {
                            return kConstantProvider.$getConstant('articles');
                        }
                    }
                }
            }
        });
});

export default manageFieldModule;
