import maxAdministrationModule from './maxAdministrationModule';
import MaxAdministrationModel from './models/MaxAdministrationModel';
import AppCommonModel from 'components/common/models/AppCommonModel';
import MaxAdministrationFactory from './factories/MaxAdministrationFactory';
import {KLayoutFactory} from 'kLayout/lib';
import MaxAdministrationService from './services/MaxAdministrationService';
import LayoutController from './controllers/LayoutController';

//Models
maxAdministrationModule.value('maxAdministrationModel', new MaxAdministrationModel());
maxAdministrationModule.value('appCommonModel', new AppCommonModel());

//Factories
maxAdministrationModule.factory('maxAdministrationFactory', MaxAdministrationFactory.instance);
maxAdministrationModule.factory('actionsLayout', () => new KLayoutFactory());

//Services
maxAdministrationModule.service('maxAdministrationService', MaxAdministrationService);

//Controllers
maxAdministrationModule.controller('layoutController', LayoutController);

export default maxAdministrationModule;
