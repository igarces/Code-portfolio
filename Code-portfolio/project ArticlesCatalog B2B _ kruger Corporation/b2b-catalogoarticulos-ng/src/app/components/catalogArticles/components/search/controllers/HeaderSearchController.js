import modalSendComparissonPrices from '../views/modalSendComparissonPrices.tpl';

class HeaderSearchController {
	constructor(appConstant, kLoadingService, catalogArticlesModel, catalogArticlesComparissonPricesFactory, $q, $uibModal,
				kMessageService, catalogArticlesFactory) {
		'ngInject';
		this.appConstant = appConstant;
		this.kLoadingService = kLoadingService;
		this.model = catalogArticlesModel;
		this.catalogArticlesComparissonPricesFactory = catalogArticlesComparissonPricesFactory;
		this.$q = $q;
		this.$uibModal = $uibModal;
		this.kMessageService = kMessageService;
		this.catalogArticlesFactory = catalogArticlesFactory;
	}

	returnPageHome() {
		this.kLoadingService.show(null, '.k-layout');
		window.top.location.href = this.model.urlInicio;
	}

	saveNewComparisonPricesArticles() {
		this.kMessageService.hide();

		this.kLoadingService.show(null, '.k-layout');
		let defer = this.$q.defer();
		let promise = defer.promise;
		this.catalogArticlesComparissonPricesFactory.getComparissonPricesChangedData(this.model);

		if(this.model.comparissonPricesList.length > 0){
			console.log('cantidad de bitacoras a guardar: ' + this.model.comparissonPricesList.length);
			this.catalogArticlesComparissonPricesFactory.saveComparisonPricesArticles(this.model, defer);
			promise.then(() => {
				return this.searchArticles();
			}, ((message) => {
				this.kLoadingService.hide();
				this.kMessageService.showError(message);
			}));
		}else{
			this.kLoadingService.hide();
			this.kMessageService.showInfo(this.kMessageService.renderMessage('noPriceDifference'));
		}
	}

	searchArticles(){
		let defer = this.$q.defer();
		let promise = defer.promise;

		this.model.griOptionsComparisonPriceArticles.data = [];
		this.catalogArticlesFactory.searchArticles(this.model, defer, false);

		promise.then(() => {
			this.kLoadingService.hide();
			this.kMessageService.showInfo(this.kMessageService.renderMessage('noPriceDifferenceSave'));
		}, ((message) => {
			this.kLoadingService.hide();
			this.kMessageService.showError(message);
		}));
	}

	searchAdmArticles(){
		this.kMessageService.hide();
		this.kLoadingService.show(null, '.k-layout');

		let defer = this.$q.defer();
		let promise = defer.promise;

		this.model.gridOptionsArticles.data = [];
		this.catalogArticlesFactory.searchArticles(this.model, defer, false);

		promise.then((message) => {
			this.kLoadingService.hide();
			if (message !== null) {
				this.kMessageService.showInfo(message);
			}
		}, ((message) => {
			this.kLoadingService.hide();
			this.kMessageService.showError(message);
		}));
	}

	showModalSendComparrissonPrices() {
		this.kMessageService.hide();

		this.catalogArticlesComparissonPricesFactory.getComparissonPricesChangedDataToSend(this.model);
		let appConstantVar = this.appConstant;
		this.$uibModal.open({
			animation: false,
			controller: 'modalSendComparissonPricesController',
			controllerAs: 'modalSendComArt',
			templateUrl: modalSendComparissonPrices.name,
			size: 'lg',
			windowClass: 'k-modal',
			resolve: {
				appConstant: (() => {
					return appConstantVar;
				})
			}
		});
	}
}

export default HeaderSearchController;
