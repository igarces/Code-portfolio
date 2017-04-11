/**
 * Created by igarces on 15/08/2016.
 */

class ModalSanitaryRegisterRecordController{
	constructor(articuloObj, appConstant, $uibModalInstance, catalogArticlesModel, catalogArticlesFactory, $q, kMessageService,
				kLoadingService){
		this.articuloObj = articuloObj;
		this.$uibModalInstance = $uibModalInstance;
		this.model = catalogArticlesModel;
		this.catalogArticlesFactory = catalogArticlesFactory;
		this.$q = $q;
		this.kMessageService = kMessageService;
		this.kLoadingService = kLoadingService;
		this.appConstant = appConstant;

		this.sanitaryRegisterList = [];
		this.searchSanitaryRegisterRecord();
	}

	searchSanitaryRegisterRecord(){
		this.kLoadingService.show(null, '.k-layout');
		let defer = this.$q.defer();
		let promise = defer.promise;

		this.catalogArticlesFactory.searchSanitaryRegisterRecord(this.articuloObj, this.model, defer);
		promise.then((data) => {
			this.sanitaryRegisterList = data;
			this.kLoadingService.hide();
		},((message) => {
			this.kLoadingService.hide();
			this.kMessageService.showError(message);
		}));
	}

	close(){
		this.$uibModalInstance.dismiss(this);
	}
}
export default ModalSanitaryRegisterRecordController;
