import manageFieldModule from './manageFieldModule';
import HeaderManageFieldController from './controllers/HeaderManageFieldController';
import SidebarManageFieldController from './controllers/SidebarManageFieldController';
import ContentManageFieldController from './controllers/ContentManageFieldController';

manageFieldModule.controller('headerManageFieldController', HeaderManageFieldController);
manageFieldModule.controller('sidebarManageFieldController', SidebarManageFieldController);
manageFieldModule.controller('contentManageFieldController', ContentManageFieldController);


export default manageFieldModule;
