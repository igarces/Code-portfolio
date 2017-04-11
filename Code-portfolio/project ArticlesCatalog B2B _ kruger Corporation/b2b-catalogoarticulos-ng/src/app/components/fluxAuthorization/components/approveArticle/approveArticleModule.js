import angular from 'angular';
import ContentApproveArticleTemplate from './views/contentApproveArticle.tpl';
import CharacteristicsTableTpl from 'app/components/common/directives/characteristicsTableDirective.tpl';
import modalShowImage from 'app/components/common/views/modalShowImage.tpl';

let approveArticleModule = angular.module('app.fluxAuthorization.approveArticle', [
	ContentApproveArticleTemplate.name,
	CharacteristicsTableTpl.name,
	modalShowImage.name
]);

approveArticleModule.config(($stateProvider, kRouteProvider, kConstantProvider) => {
	let parent = kRouteProvider.parent();
	console.log(`${parent}approve`);

	$stateProvider
		.state(`${parent}approve`, {
			url: '/approve',
			views: {
				'center@fluxAuthorization': {
					templateUrl: ContentApproveArticleTemplate.name,
					controller: 'contentApproveArticleController',
					controllerAs: 'contentApproveArticle',
					resolve: {
						appConstant: () => {
							return kConstantProvider.$getConstant('articles');
						}
					}
				}
			}
		});
});

export default approveArticleModule;
