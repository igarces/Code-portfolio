import angular from 'angular';

import {KRouter} from 'kCommon';
import futureRoutes from './routes.json!';
import kLayout from 'kLayout';
//import kInput from 'kInput';
import kMessage from 'kMessage';
import kLoading from 'kLoading';
import kModal from 'kModal';
import kContainer from 'kContainer';

import articleConstant from '../common/resources/constants/articles/constant';
import articleConstantDev from '../common/resources/constants/articles/constant_dev';
import articleConstantTest from '../common/resources/constants/articles/constant_test';
import articleConstantProd from '../common/resources/constants/articles/constant_prod';

import articleMessage from '../common/resources/messages/articlesMessage';

import 'angular-ui-grid';
import 'ng-file-upload';
import 'assets/css/theme.css!';
import './assets/css/articles.css!';

import kOutputMessage from 'kOutputMessage';

let catalogArticlesModule = angular.module('app.catalogArticles', [
    kLayout.name,
    //kInput.name,
    kMessage.name,
    kLoading.name,
    kModal.name,
    kContainer.name,
	'ngFileUpload',
	kOutputMessage.name
]);

catalogArticlesModule.config(($stateProvider, kServiceProvider, kConstantProvider, kMessageProvider, kLoadingProvider) => {
  
  kMessageProvider.$registry(articleMessage);

  kMessageProvider.$config({
    progressBar: true
  });

  kLoadingProvider.$config({
    logo: 'assets/img/cargando.gif'
  });

  kServiceProvider.$registry('b2bCatArtWs');
  kConstantProvider.$registry('articles', articleConstant, {
    dev: articleConstantDev,
    test: articleConstantTest,
    prod: articleConstantProd
  });

  
  $stateProvider.
    state('catalogArticles', {
      controller: 'layoutController',
      controllerAs: 'layout',
      template: `<k-layout api="layout.actionsLayout" left-region="true" footer-region="false"></k-layout>`,
      abstract: true
    });
});

catalogArticlesModule.config(KRouter.instance().routing(catalogArticlesModule, futureRoutes));

export default catalogArticlesModule;
