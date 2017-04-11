import angular from 'angular';

import {KRouter} from 'kCommon';
import futureRoutes from './routes.json!';
import kLayout from 'kLayout';
import kInput from 'kInput';
import kMessage from 'kMessage';
import kLoading from 'kLoading';
import 'angular-ui-grid';
import kModal from 'kModal';
import kContainer from 'kContainer';

import articleConstant from '../common/resources/constants/articles/constant';
import articleConstantDev from '../common/resources/constants/articles/constant_dev';
import articleConstantTest from '../common/resources/constants/articles/constant_test';
import articleConstantProd from '../common/resources/constants/articles/constant_prod';

import articleMessage from '../common/resources/messages/articlesMessage';

import 'assets/css/theme.css!';
import './assets/css/fluxAuthorization.css!';

let fluxAuthorizationModule = angular.module('app.fluxAuthorization', [
	kLayout.name,
	kInput.name,
	kMessage.name,
	kLoading.name,
	kModal.name,
	kContainer.name,
]);

fluxAuthorizationModule.config(($stateProvider, kServiceProvider, kConstantProvider, kMessageProvider, kLoadingProvider) => {

	kMessageProvider.$registry(articleMessage);

	kMessageProvider.$config({
		progressBar: true
	});

	kLoadingProvider.$config({
		logo: 'assets/img/maxico.png'
	});

	kServiceProvider.$registry('b2bCatArtWs');
	kConstantProvider.$registry('articles', articleConstant/*, {
	 dev: articleConstantDev,
	 test: articleConstantTest,
	 prod: articleConstantProd
	 }*/);


	$stateProvider.
	state('fluxAuthorization', {
		controller: 'layoutController',
		controllerAs: 'layout',
		template: `<k-layout api="layout.actionsLayout" left-region="false" footer-region="false" header-region="false"></k-layout>`,
		abstract: true
	});
});

fluxAuthorizationModule.config(KRouter.instance().routing(fluxAuthorizationModule, futureRoutes));

export default fluxAuthorizationModule;
