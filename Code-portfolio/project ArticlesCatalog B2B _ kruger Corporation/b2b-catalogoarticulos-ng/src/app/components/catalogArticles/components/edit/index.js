import editModule from './editModule';
import HeaderEditController from './controllers/HeaderEditController';
import SidebarEditController from './controllers/SidebarEditController';
import ContentEditController from './controllers/ContentEditController';
import ModalTransgenicController from './controllers/ModalTransgenicController';
import ModalShowImageController from 'app/components/common/controllers/ModalShowImageController';
import EditDirective from './directives/EditDirective';
import EditImageDirective from './directives/EditImageDirective';
import EditSanitaryRegisterDirective from './directives/EditSanitaryRegisterDirective';
import EditSanitaryRegisterFileDirective from './directives/EditSanitaryRegisterFileDirective';
import ModalShowCharacteristicController from './controllers/ModalShowCharacteristicController';
import CharacteristicTableDirective from 'app/components/common/directives/CharacteristicsTableDirective';

//Controller
editModule.controller('headerEditController', HeaderEditController);
editModule.controller('sidebarEditController', SidebarEditController);
editModule.controller('contentEditController', ContentEditController);
editModule.controller('modalTransgenicController', ModalTransgenicController);
editModule.controller('modalShowImageController', ModalShowImageController);
editModule.controller('modalShowCharacteristicController', ModalShowCharacteristicController);

//Directives
editModule.directive('fieldEdit', EditDirective.instance);
editModule.directive('fieldImage', EditImageDirective.instance);
editModule.directive('fieldSanitaryRegister', EditSanitaryRegisterDirective.instance);
editModule.directive('fieldFileSanitaryRegister', EditSanitaryRegisterFileDirective.instance);
editModule.directive('characteristicTable', CharacteristicTableDirective.instance);

export default editModule;
