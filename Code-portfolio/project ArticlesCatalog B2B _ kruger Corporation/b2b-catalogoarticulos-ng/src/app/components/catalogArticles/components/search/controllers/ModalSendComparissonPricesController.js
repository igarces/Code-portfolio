class ModalSendComparissonPricesController {
	constructor(appConstant, $uibModalInstance, catalogArticlesModel, catalogArticlesComparissonPricesFactory, $q, kLoadingService,
				kMessageService, catalogArticlesFactory) {
		'ngInject';
		this.appConstant = appConstant;
		this.$uibModalInstance = $uibModalInstance;
		this.model = catalogArticlesModel;
		this.catalogArticlesComparissonPricesFactory = catalogArticlesComparissonPricesFactory;
		this.$q = $q;
		this.kLoadingService = kLoadingService;
		this.kMessageService = kMessageService;
		this.catalogArticlesFactory = catalogArticlesFactory;

		this.model.griComparisonPrice = this.griComparisonPrice();
		this.getArticlesToSend();
	}

	close() {
		this.$uibModalInstance.dismiss(this);
	}

	griComparisonPrice() {
		let digits = this.appConstant.NUMBER_DECIMAL_DIGITS;
		let gridOptions = {
			init: (gridCtrl, gridScope) => {
				gridScope.$on('ngGridEventData', () => {
				});
			},
			rowHeight: 20,
			enableColumnMenus: false,
			enableHorizontalScrollbar: 0,
			enableVerticalScrollbar: 2,
			columnDefs: [
				{
					displayName: 'Código barras',
					field: 'codigoBarras',
					minWidth: 100
				},
				{
					displayName: 'Descripción artículo',
					field: 'descripcionArticulo',
					minWidth: 250
				},
				{
					displayName: 'P.V.P. Prov.',
					field: 'bitacoraArticuloPvp.valorPrecioProveedor',
					cellClass: 'text-right',
					cellFilter: 'number: grid.appScope.modalSendComArt.appConstant.NUMBER_DECIMAL_DIGITS'
				},
				{
					displayName: 'C.Neto Prov.',
					field: 'bitacoraArticuloCostoNeto.valorPrecioProveedor',
					cellClass: 'text-right',
					cellFilter: 'number: grid.appScope.modalSendComArt.appConstant.NUMBER_DECIMAL_DIGITS'
				},
				{
					displayName: 'U.Manejo Prov.',
					field: 'bitacoraArticuloUniMan.valorPrecioProveedor',
					cellClass: 'text-right'
				},
				{
					displayName: 'I.V.A. Prov.',
					field: 'bitacoraArticuloIva.valorPrecioProveedor',
					cellClass: 'text-center',
					cellTemplate: '<div class="ui-grid-cell-contents"> ' +
					'<img ng-if="row.entity.bitacoraArticuloIva.valorPrecioProveedor == ' +
					'grid.appScope.modalSendComArt.appConstant.ESTADO_ACTVO" ' +
					'ng-src="{{grid.appScope.modalSendComArt.appConstant.IMG_ICON_ACTIVE}}"/>' +
					'<img ng-if="row.entity.bitacoraArticuloIva.valorPrecioProveedor == ' +
					'grid.appScope.modalSendComArt.appConstant.ESTADO_INACTIVO" ' +
					'ng-src="{{grid.appScope.modalSendComArt.appConstant.IMG_ICON_INACTIVE}}"/></div>',
				},
				{
					displayName: 'I.VERDE Prov.',
					field: 'bitacoraArticuloImpVerde.valorPrecioProveedor',
					cellClass: 'text-center',
					cellTemplate: '<div class="ui-grid-cell-contents"> ' +
					'<img ng-if="row.entity.bitacoraArticuloImpVerde.valorPrecioProveedor == ' +
					'grid.appScope.modalSendComArt.appConstant.ESTADO_ACTVO" ' +
					'ng-src="{{grid.appScope.modalSendComArt.appConstant.IMG_ICON_ACTIVE}}"/>' +
					'<img ng-if="row.entity.bitacoraArticuloImpVerde.valorPrecioProveedor == ' +
					'grid.appScope.modalSendComArt.appConstant.ESTADO_INACTIVO" ' +
					'ng-src="{{grid.appScope.modalSendComArt.appConstant.IMG_ICON_INACTIVE}}"/></div>',
				}
			]
		};
		return gridOptions;
	}

	getArticlesToSend(){
		let defer = this.$q.defer();
		let promise = defer.promise;

		this.kLoadingService.show(null, '.k-layout');

		this.catalogArticlesComparissonPricesFactory.getArticlesToSend(this.model, defer);

		promise.then((data) => {
			this.model.griComparisonPrice.data = data;
			this.kLoadingService.hide();
		}, ((message) =>{
			this.model.griComparisonPrice.data = [];
			this.kLoadingService.hide();
			this.kMessageService.showError(message);
		}));
	}

	okAction() {
		if(this.model.griComparisonPrice.data.length > 0){
			let defer = this.$q.defer();
			let promise = defer.promise;

			this.kLoadingService.show(null, '.k-layout');

			this.catalogArticlesComparissonPricesFactory.sendComparisonPricesArticles(this.model, defer);

			promise.then(() => {
				this.kLoadingService.hide();
				this.searchArticles();
			}, ((message) =>{
				this.kLoadingService.hide();
				this.kMessageService.showError(message);
			}));
		}else{
			this.close();
		}
	}

	cancelAction() {
		this.$uibModalInstance.dismiss('cancel');
	}

	searchArticles(){
		this.kLoadingService.show(null, '.k-layout');

		let defer = this.$q.defer();
		let promise = defer.promise;

		this.model.griOptionsComparisonPriceArticles.data = [];
		this.catalogArticlesFactory.searchArticles(this.model, defer, false);

		promise.then(() => {
			this.kLoadingService.hide();
			this.close();
			this.kMessageService.showInfo(this.kMessageService.renderMessage('priceDifferenceSent'));
		}, ((message) => {
			this.kLoadingService.hide();
			this.kMessageService.showError(message);
		}));
	}
}
export default ModalSendComparissonPricesController;
