import modalHistorialPrices from '../views/modalHistorialPrices.tpl';
import modalSanitaryRegisterRecord from '../views/modalSanitaryRegisterRecord.tpl';
import modalExcel from '../views/modalExcel.tpl';

class ContentSearchController {

	constructor(catalogArticlesFactory, catalogArticlesComparissonPricesFactory, $state, kMessageService, appConstant,
				kLoadingService, catalogArticlesModel, searchGridFactory, actionsLayout, $stateParams, $q, $uibModal,
				kModalService) {
		'ngInject';
		actionsLayout.renderLeft(true);
		this.$state = $state;
		this.kMessageService = kMessageService;
		this.kLoadingService = kLoadingService;
		this.model = catalogArticlesModel;
		this.searchGridFactory = searchGridFactory;
		this.catalogArticlesFactory = catalogArticlesFactory;
		this.catalogArticlesComparissonPricesFactory = catalogArticlesComparissonPricesFactory;
		this.appConstant = appConstant;
		this.$stateParams = $stateParams;
		this.$q = $q;
		this.$uibModal = $uibModal;
		this.kModalService = kModalService;

		this.catalogArticlesFactory.getURlParameters(this.$stateParams, this.model);
	}

	cleanFilters() {
		this.catalogArticlesFactory.filters.clear();
	}

	/**
	 * go to edit Article page
	 */
	editArticle(article) {
		this.kMessageService.hide();

		this.model.articleToEdit = article;
		//initialization data
		this.model.optionSelected = null;
		this.model.editArticle = false;
		this.model.fieldsMap = new Map();
		this.model.mapValueChange = new Map();
		this.model.selectedSanitaryRegister = null;

		this.$state.go('catalogArticles.search.edit');
	}

	searchArticleImage(article, tipoImagen) {
		this.kMessageService.hide();

		this.kLoadingService.show(null, '.k-layout');
		let defer = this.$q.defer();
		let promise = defer.promise;

		this.catalogArticlesFactory.searchArticleImage(this.model, defer, article, tipoImagen);
		promise.then((message) => {
			if (message !== null) {
				this.kMessageService.showInfo(this.kMessageService.renderMessage('noImageAvailable'));
			}
			this.kLoadingService.hide();
		}, ((message) => {
			this.kLoadingService.hide();
			this.kMessageService.showError(message);
		}));
	}

	downloadExcel(isTemplate = true) {
		this.kMessageService.hide();

		if(this.model.reportOptionRol === this.appConstant.ROL_USER_ADMIN_ARTICULOS){
			this.downloadExcelAux(isTemplate);
		}else{
			//is price comparison
			if(isTemplate){
				this.downloadExcelAux(isTemplate);
			}else{
				this.kModalService.showConfirm({
					scopeClass: this,
					message: this.kMessageService.renderMessage('downloadExcelPriceComparison'),
					acceptFn: () => {
						let discount = false;
						this.downloadExcelAux(false, discount);
					},
					cancelFn: () => {
						let discount = true;
						this.downloadExcelAux(false, discount);
					},
					size: this.kModalService.MODAL_SIZE.MEDIUM,
					btnAceptLabel: 'Descargar sin descuentos',
					btnCancelLabel: 'Descargar con descuentos'
				});
			}
		}
	}

	downloadExcelAux(isTemplate, discount = false){
		this.kLoadingService.show(null, '.k-layout');
		let defer = this.$q.defer();
		let promise = defer.promise;
		this.model.classificationsSelectedList = this.searchGridFactory.gridOptionsClasificaciones.gridApi.selection.getSelectedRows();

		this.catalogArticlesFactory.downloadExcel(this.model, defer, isTemplate, discount);
		promise.then((message) => {
			if (message !== null) {
				this.kMessageService.showInfo(this.kMessageService.renderMessage('noExcelAvailable'));
			}
			this.kLoadingService.hide();
		}, ((message) => {
			this.kLoadingService.hide();
			this.kMessageService.showError(message);
		}));
	}

	uploadExcel($files, $newFiles){
		this.kMessageService.hide();

		let errorFile = this.catalogArticlesFactory.validateFileErrors($newFiles);
		if(errorFile === null){
			if($files.length > 0){
				if(this.model.reportOptionRol === this.appConstant.ROL_USER_ADMIN_ARTICULOS){
					let appConstantVar = this.appConstant;
					this.$uibModal.open({
						animation: false,
						controller: 'modalExcelController',
						controllerAs: 'modalExcel',
						templateUrl: modalExcel.name,
						size: 'md',
						windowClass: 'k-modal',
						backdrop: 'static',
						resolve: {
							appConstant: (() => {
								return appConstantVar;
							}),
							files: (() => {
								return $files;
							}),
							action: (() => {
								return 'uploadExcelADM';
							})
						}
					});
				}else{
					this.uploadExcelPricesComparisson($files);
				}
			}
		}else{
			this.kMessageService.showError(errorFile);
		}
	}

	uploadExcelPricesComparisson($files){
		let excelFile = $files[0];
		this.kLoadingService.show(null, '.k-layout');
		let defer = this.$q.defer();
		let promise = defer.promise;
		this.catalogArticlesComparissonPricesFactory.uploadExcelPricesComparisson(this.model, excelFile, defer);

		promise.then((message) => {
			if (message !== null) {
				this.kMessageService.showInfo(message);
			}
			this.kLoadingService.hide();
		}, ((message) => {
			this.kLoadingService.hide();
			this.kMessageService.showError(message);
		}));
	}

	/**
	 * Fix the decimal of selected value
	 *
	 * @param rowSelected
	 * @param value
	 */
	validatePriceValue(bitacoraArticulo, decimal = true) {
		if(bitacoraArticulo.valorPrecioProveedor !== null && bitacoraArticulo.valorPrecioProveedor !== undefined){
			if(Number(bitacoraArticulo.valorPrecioProveedor) === 0 ||
				Number(bitacoraArticulo.valorPrecioProveedor) === Number(bitacoraArticulo.valorPrecioNegociacion)){
				
				bitacoraArticulo.valorPrecioProveedor = 
				this.model.onlyChangeComparissonPrices.get(bitacoraArticulo.codigoBitacoraArticuloProveedorPrecio);
			}else{
				if(decimal){
					bitacoraArticulo.valorPrecioProveedor = Number(bitacoraArticulo.valorPrecioProveedor)
						.toFixed(this.appConstant.NUMBER_DECIMAL_DIGITS);
				}else{
					bitacoraArticulo.valorPrecioProveedor = Number(bitacoraArticulo.valorPrecioProveedor);
				}
			}
		}else{
			if(this.model.onlyChangeComparissonPrices.get(bitacoraArticulo.codigoBitacoraArticuloProveedorPrecio)){
				
				bitacoraArticulo.valorPrecioProveedor = 
				this.model.onlyChangeComparissonPrices.get(bitacoraArticulo.codigoBitacoraArticuloProveedorPrecio);
			}
		}
	}

	showHistorialPricesModal(article) {
		this.kMessageService.hide();

		let defer = this.$q.defer();
		let promise = defer.promise;

		this.model.historialPricesBitacora = [];

		this.catalogArticlesComparissonPricesFactory.getHistorialComparisonPricesArticles(article, this.model, defer);

		promise.then(() => {

			let appConstantVar = this.appConstant;
			this.$uibModal.open({
				animation: false,
				controller: 'modalHistorialPricesController',
				controllerAs: 'modalHisPri',
				templateUrl: modalHistorialPrices.name,
				size: 'lg',
				windowClass: 'k-modal',
				backdrop: 'static',
				resolve: {
					appConstant: (() => {
						return appConstantVar;
					})
				}
			});
		}, (message) => {
			this.kMessageService.showError(message);
		});
	}

	searchSanitaryRegisterRecord(entity){
		this.kMessageService.hide();

		let appConstantVar = this.appConstant;

		this.$uibModal.open({
			animation: false,
			controller: 'modalSanitaryRegisterRecordController',
			controllerAs: 'modalSanRegRecord',
			templateUrl: modalSanitaryRegisterRecord.name,
			size: 'lg',
			windowClass: 'k-modal',
			resolve: {
				articuloObj: (() => {
					return entity;
				}),
				appConstant: (() => {
					return appConstantVar;
				})
			}
		});
	}

	manageDiscountColumns(open){
		this.catalogArticlesComparissonPricesFactory.manageDiscountColumns(this.model, open);
	}
}

export  default ContentSearchController;
