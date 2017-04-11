import searchModule from './searchModule';
import SearchGridFactory from './factories/SearchGridFactory';
import HeaderSearchController from './controllers/HeaderSearchController';
import SidebarSearchController from './controllers/SidebarSearchController';
import ContentSearchController from './controllers/ContentSearchController';
import ModalSendComparissonPricesController from './controllers/ModalSendComparissonPricesController';
import ModalHistorialPricesController from './controllers/ModalHistorialPricesController';
import ModalSanitaryRegisterRecordController from './controllers/ModalSanitaryRegisterRecordController';
import ModalExcelController from './controllers/ModalExcelController';

searchModule.controller('headerSearchController', HeaderSearchController);
searchModule.controller('sidebarSearchController', SidebarSearchController);
searchModule.controller('contentSearchController', ContentSearchController);
searchModule.controller('modalSendComparissonPricesController', ModalSendComparissonPricesController);
searchModule.controller('modalHistorialPricesController', ModalHistorialPricesController);
searchModule.controller('modalSanitaryRegisterRecordController', ModalSanitaryRegisterRecordController);
searchModule.controller('modalExcelController', ModalExcelController);
searchModule.factory('searchGridFactory', SearchGridFactory.instance);

export default searchModule;
