import angular from 'angular';
import kInput from 'kInput';
import HeaderEditTemplate from './views/headerEdit.tpl';
import SidebarEditTemplate from './views/sidebarEdit.tpl';
import ContentEditTemplate from './views/contentEdit.tpl';
import ModalTransgenicTemplate from './views/modalTransgenic.tpl';
import optionGeneralArticleData from './views/optionGeneralArticleData.tpl';
import optionBasicData from './views/optionBasicData.tpl';
import optionProvider from './views/optionProvider.tpl';
import editDirectiveTpl from './directives/EditDirectiveTemplate.tpl';
import editImageDirectiveTpl from './directives/EditImageDirectiveTemplate.tpl';
import editSanitaryRegisterDirectiveTpl from './directives/EditSanitaryRegisterDirectiveTemplate.tpl';
import editSanitaryRegisterFileDirectiveTpl from './directives/EditSanitaryRegisterFileDirectiveTemplate.tpl';
import optionComplementary from './views/optionComplementary.tpl';
import optionImages from './views/optionImages.tpl';
import optionSanitaryRegister from './views/optionSanitaryRegister.tpl';
import optionMerchandiseData from './views/optionMerchandiseData.tpl';
import modalShowImage from 'app/components/common/views/modalShowImage.tpl';
import modalCharacteristic from './views/modalShowCharacteristic.tpl';
import CharacteristicsTableDirective from 'app/components/common/directives/characteristicsTableDirective.tpl';

let editModule = angular.module('app.catalogArticles.edit', [
	kInput.name,
	HeaderEditTemplate.name,
	SidebarEditTemplate.name,
	ContentEditTemplate.name,
	ModalTransgenicTemplate.name,
	optionGeneralArticleData.name,
	optionBasicData.name,
	optionProvider.name,
	editDirectiveTpl.name,
	editImageDirectiveTpl.name,
	editSanitaryRegisterDirectiveTpl.name,
	editSanitaryRegisterFileDirectiveTpl.name,
	optionComplementary.name,
	optionImages.name,
	optionSanitaryRegister.name,
	optionMerchandiseData.name,
	modalShowImage.name,
	modalCharacteristic.name,
	CharacteristicsTableDirective.name
]);

editModule.config(($stateProvider, kRouteProvider, kConstantProvider) => {
	let parent = kRouteProvider.parent();
	console.log(`${parent}edit`);

	$stateProvider.state(`${parent}edit`, {
			url: '/edit',
			views: {
				'header@catalogArticles': {
					templateUrl: HeaderEditTemplate.name,
					controller: 'headerEditController',
					controllerAs: 'headerEdit',
					resolve: {
						appConstant: () => {
							return kConstantProvider.$getConstant('articles');
						}
					}
				},
				'left@catalogArticles': {
					templateUrl: SidebarEditTemplate.name,
					controller: 'sidebarEditController',
					controllerAs: 'sidebarEdit',
					resolve: {
						appConstant: () => {
							return kConstantProvider.$getConstant('articles');
						}
					}
				},
				'center@catalogArticles': {
					templateUrl: ContentEditTemplate.name,
					controller: 'contentEditController',
					controllerAs: 'contentEdit',
					resolve: {
						appConstant: () => {
							return kConstantProvider.$getConstant('articles');
						}
					}
				}
			}
		});
});

export default editModule;
