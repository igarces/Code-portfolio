import catalogArticlesModule from './catalogArticlesModule';
import CatalogArticlesModel from './models/CatalogArticlesModel';
import FiltersSearchArticlesModel from './models/FiltersSearchArticlesModel';
import AppCommonModel from 'components/common/models/AppCommonModel';
import CatalogArticlesFactory from './factories/CatalogArticlesFactory';
import CatalogArticlesComparissonPricesFactory from './factories/CatalogArticlesComparissonPricesFactory';
import {KLayoutFactory} from 'kLayout/lib';
import CatalogArticlesService from './services/CatalogArticlesService';
import LayoutController from './controllers/LayoutController';
import NgEnterDirective from 'components/common/directives/NgEnterDirective';
import ConvertToKb from 'components/common/filters/ConvertToKbFilter';

//Models
catalogArticlesModule.value('catalogArticlesModel', new CatalogArticlesModel());
catalogArticlesModule.value('filtersSearchArticlesModel', new FiltersSearchArticlesModel());
catalogArticlesModule.value('appCommonModel', new AppCommonModel());

//Factories
catalogArticlesModule.factory('catalogArticlesFactory', CatalogArticlesFactory.instance);
catalogArticlesModule.factory('catalogArticlesComparissonPricesFactory', CatalogArticlesComparissonPricesFactory.instance);
catalogArticlesModule.factory('actionsLayout', () => new KLayoutFactory());

//Services
catalogArticlesModule.service('catalogArticlesService', CatalogArticlesService);

//Controllers
catalogArticlesModule.controller('layoutController', LayoutController);

//Directives
catalogArticlesModule.directive('ngEnter', () => new NgEnterDirective());

//Filters
catalogArticlesModule.filter('kbytes', () => new ConvertToKb());

export default catalogArticlesModule;
