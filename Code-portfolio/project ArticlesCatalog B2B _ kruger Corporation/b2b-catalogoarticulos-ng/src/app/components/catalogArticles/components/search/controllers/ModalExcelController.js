/**
 * Created by igarces on 19/09/2016.
 */
class ModalExcelController {
	constructor($uibModalInstance, catalogArticlesModel, catalogArticlesFactory, $q, kMessageService, kLoadingService,
				appConstant, files, action, $interval) {

		'ngInject';
		this.$uibModalInstance = $uibModalInstance;
		this.model = catalogArticlesModel;
		this.catalogArticlesFactory = catalogArticlesFactory;
		this.$q = $q;
		this.appConstant = appConstant;
		this.files = files;
		this.action = action;
		this.kMessageService = kMessageService;
		this.kLoadingService = kLoadingService;
		this.$interval = $interval;

		this.message = '';
		this.message2 = null;
		this.message3 = null;
		this.button1 = '';
		this.button2 = '';
		this.listCatArticles = [];
		this.disabledButton = false;
		this.getInitialData();
	}

	getInitialData(){
		if(this.action === 'uploadExcelADM'){
			this.message = this.kMessageService.renderMessage('uploadExcelAdmArt');
			this.message4 = this.kMessageService.renderMessage('warningSearch');
			this.button1 = 'Buscar';
			this.button2 = 'Actualizar';
			this.kLoadingService.show(null, '.k-layout');

			let defer = this.$q.defer();
			let promise = defer.promise;

			this.catalogArticlesFactory.getAutorizacionUpdate(this.model, defer);
			promise.then((data)=>{
				this.listCatArticles = data;
				this.kLoadingService.hide();

				if(data.length === 0){
					this.disabledButton = true;
					this.message3 = this.kMessageService.renderMessage('noUpdatePermited');
				}else{
					this.message3 = this.kMessageService.renderMessage('warningUpdate');
				}

				if(data.length === 1){
					let cat = data[0];
					let fieldName = null;
					if(cat.atributoFrom === this.appConstant.TAG_REFERENCIA_PROVEEDOR){
						fieldName = 'Descripción artículo proveedor';
					}else{
						fieldName = 'Referencia proveedor';
					}
					this.message2 = this.kMessageService.renderMessage('noUpdatePermitedOneField', {field: fieldName});
				}

			});
		}
	}

	close() {
		this.$uibModalInstance.close('ok');
	}

	actionButton1() {
		if(this.action === 'uploadExcelADM'){
			this.uploadExcelADMSearch();
		}
	}

	actionButton2() {
		if(this.action === 'uploadExcelADM'){
			this.uploadExcelADMUpdate();
		}
	}

	uploadExcelADMSearch(){
		if(this.files.length){
			let excelFile = this.files[0];
			this.kLoadingService.show(null, '.k-layout');
			let defer = this.$q.defer();
			let promise = defer.promise;
			this.catalogArticlesFactory.uploadExcelSearch(this.model, excelFile, defer);

			promise.then((message) => {
				if (message !== null) {
					this.kMessageService.showInfo(message);
				}
				this.kLoadingService.hide();
				this.close();
			}, ((message) => {
				this.kLoadingService.hide();
				this.kMessageService.showError(message);
				this.close();
			}));
		}
	}

	uploadExcelADMUpdate(){
		if(this.files.length && this.listCatArticles.length > 0){
			let excelFile = this.files[0];
			this.kLoadingService.show(null, '.k-layout');
			let defer = this.$q.defer();
			let promise = defer.promise;
			this.catalogArticlesFactory.uploadExcelUpdate(this.model, excelFile, this.listCatArticles, defer);

			promise.then((message) => {
				if (message !== null) {
					this.kMessageService.showInfo(message);
				}

				this.kLoadingService.hide();
				this.close();
			}, ((message) => {
				this.kLoadingService.hide();
				this.kMessageService.showError(message);
				this.close();
			}));
		}
	}

	cancelAction() {
		this.$uibModalInstance.dismiss('cancel');
	}

}
export default ModalExcelController;
