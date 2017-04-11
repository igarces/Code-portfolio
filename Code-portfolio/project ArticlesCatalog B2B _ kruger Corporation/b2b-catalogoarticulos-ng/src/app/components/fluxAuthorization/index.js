import fluxAuthorizationModule from './fluxAuthorizationModule';
import FluxAuthorizationModel from './models/FluxAuthorizationModel';
import FluxAuthorizationFactory from './factories/FluxAuthorizationFactory';
import {KLayoutFactory} from 'kLayout/lib';
import FluxAuthorizationService from './services/FluxAuthorizationService';
import LayoutController from './controllers/LayoutController';

//Models
fluxAuthorizationModule.value('fluxAuthorizationModel', new FluxAuthorizationModel());

//Factories
fluxAuthorizationModule.factory('fluxAuthorizationFactory', FluxAuthorizationFactory.instance);
fluxAuthorizationModule.factory('actionsLayout', () => new KLayoutFactory());

//Services
fluxAuthorizationModule.service('fluxAuthorizationService', FluxAuthorizationService);

//Controllers
fluxAuthorizationModule.controller('layoutController', LayoutController);

export default fluxAuthorizationModule;
