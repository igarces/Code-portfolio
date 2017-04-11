import approveArticleModule from './approveArticleModule';
import ContentApproveArticleController from './controllers/ContentApproveArticleController';
import CharacteristicTableDirective from 'app/components/common/directives/CharacteristicsTableDirective';
import ModalShowImageController from 'app/components/common/controllers/ModalShowImageController';

//Controller
approveArticleModule.controller('contentApproveArticleController', ContentApproveArticleController);
approveArticleModule.controller('modalShowImageController', ModalShowImageController);

//Directive
approveArticleModule.directive('characteristicTable', CharacteristicTableDirective.instance);

export default approveArticleModule;
