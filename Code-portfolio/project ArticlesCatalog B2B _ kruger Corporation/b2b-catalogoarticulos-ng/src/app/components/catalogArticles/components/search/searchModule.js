import angular from 'angular';
import HeaderSearchTemplate from './views/headerSearch.tpl';
import SideBarSearchTemplate from './views/sidebarSearch.tpl';
import ContentSearchTemplate from './views/contentSearch.tpl';
import 'angular-ui-grid';
import kPagination from 'kPagination';
import kInput from 'kInput';
import modalSendComparissonPrices from './views/modalSendComparissonPrices.tpl';
import modalHistorialPrices from './views/modalHistorialPrices.tpl';
import modalSanitaryRegisterRecord from './views/modalSanitaryRegisterRecord.tpl';
import modalExcel from './views/modalExcel.tpl';

let searchModule = angular.module('app.search.configuration', [
	HeaderSearchTemplate.name,
	SideBarSearchTemplate.name,
	ContentSearchTemplate.name,
	//ModalTemplate.name,
	'ui.grid',
	'ui.grid.edit',
	'ui.grid.autoResize',
	'ui.grid.moveColumns',
	'ui.grid.resizeColumns',
	'ui.grid.pinning',
	'ui.grid.grouping',
	'ui.grid.selection',
	'ui.grid.pagination',
	kPagination.name,
	kInput.name,
	modalSendComparissonPrices.name,
	modalHistorialPrices.name,
	modalSanitaryRegisterRecord.name,
	modalExcel.name
]);

searchModule.config(($stateProvider, kRouteProvider, kServiceProvider, kConstantProvider) => {
	//kServiceProvider.$registry('maxArticulosService');
	let parent = kRouteProvider.parent();
	console.log(`${parent}search`);
	$stateProvider
		.state(`${parent}search`, {
			url: '/catalogArticles?nktxms={}&pCodComp={}&pCodProv={}&pCodJDEProv={}&pNomProv={}&pCodSist={}&pUrlRet={}&pUserId={}&pUserName={}' +
			'&pEsImportado={}&pMensaje={}',
			params: {
				filters: undefined,
				search: false
			},
			views: {
				'header@catalogArticles': {
					templateUrl: HeaderSearchTemplate.name,
					controller: 'headerSearchController',
					controllerAs: 'headerSearch',
					resolve: {
						appConstant: () => {
							return kConstantProvider.$getConstant('articles');
						}
					}
				},
				'left@catalogArticles': {
					templateUrl: SideBarSearchTemplate.name,
					controller: 'sidebarSearchController',
					controllerAs: 'sidebarSearch',
					resolve: {
						appConstant: () => {
							return kConstantProvider.$getConstant('articles');
						}
					}
				},
				'center@catalogArticles': {
					templateUrl: ContentSearchTemplate.name,
					controller: 'contentSearchController',
					controllerAs: 'contentSearch',
					resolve: {
						appConstant: () => {
							return kConstantProvider.$getConstant('articles');
						}
					}
				}
			}
		});
});

export default searchModule;
