class SidebarSearchController {

	constructor(catalogArticlesFactory, catalogArticlesModel, searchGridFactory, $state, $stateParams, $q,
				kLoadingService, kMessageService, appConstant, $timeout, kModalService) {
		'ngInject';
		this.catalogArticlesFactory = catalogArticlesFactory;
		this.model = catalogArticlesModel;
		this.searchGridFactory = searchGridFactory;
		this.$state = $state;
		this.$stateParams = $stateParams;
		this.$q = $q;
		this.kLoadingService = kLoadingService;
		this.kMessageService = kMessageService;
		this.appConstant = appConstant;
		this.$timeout = $timeout;
		this.kModalService = kModalService;

		this.catalogArticlesFactory.getURlParameters(this.$stateParams, this.model);
		this.model.gridOptionsArticles = this.griOptionsArticles();

		if (this.model.userRols === null) {
			this.searchUserRols();
		} else {
			if (this.searchGridFactory.gridOptionsClasificaciones.data.length === 0) {
				this.searchArticlesClassifications();
			}
		}

		if (this.$stateParams.search) {
			this.searchArticles('search');
		} else {
			this.$stateParams.search = true;
		}
	}

	/*
	 * Search the user Rols needed in Articles administration
	 */
	searchUserRols() {
		this.kLoadingService.show(null, '.k-layout');
		let defer = this.$q.defer();
		let promise = defer.promise;
		this.catalogArticlesFactory.searchUserRols(this.model, defer);

		promise.then(() => {
			if (this.searchGridFactory.gridOptionsClasificaciones.data.length === 0) {
				this.searchArticlesClassifications();
			} else {
				this.kLoadingService.hide();
			}
		}, ((message) => {
			this.kLoadingService.hide();
			this.kMessageService.showError(message);
		}));
	}

	/**
	 * Search filters articles Classification
	 */
	searchArticlesClassifications() {
		this.kLoadingService.show(null, '.k-layout');
		let defer = this.$q.defer();
		let promise = defer.promise;
		this.catalogArticlesFactory.searchClassificationFilters(this.model, defer);

		promise.then((data) => {
			this.searchGridFactory.gridOptionsClasificaciones.data = data;
			this.kLoadingService.hide();
		}, ((message) => {
			this.kLoadingService.hide();
			this.kMessageService.showError(message);
		}));
	}

	/**
	 * Search articles
	 */
	searchArticles(countAgainFlag) {
		this.kMessageService.hide();

		if (!this.$stateParams.search) {
			this.$stateParams.search = true;
		} else {
			this.kLoadingService.show(null, '.k-layout');

			if(this.searchGridFactory.gridOptionsClasificaciones.gridApi){
				this.model.classificationsSelectedList = this.searchGridFactory.gridOptionsClasificaciones.gridApi.selection.getSelectedRows();
			}

			let colCodigoBarras = [];
			if (countAgainFlag === 'search') {
				countAgainFlag = true;
				colCodigoBarras = this.model.filtersSearch.colCodigoBarras;

				if (this.model.classificationsSelectedList.length > 0) {
					let rows = this.searchGridFactory.gridOptionsClasificaciones.gridApi.selection.getSelectedGridRows();
					this.$timeout(() => {
						this.catalogArticlesFactory.selectGridRows(rows, this.searchGridFactory.gridOptionsClasificaciones);
					}, 100);
				}
				this.filter();
			}

			let defer = this.$q.defer();
			let promise = defer.promise;

			if (countAgainFlag) {
				if(colCodigoBarras.length === 0){
					this.model.filtersSearch.colCodigoBarras = [];
				}
				if (this.model.reportOptionRol === this.appConstant.ROL_USER_COMPARACION_PRECIO) {
					if (this.model.griOptionsComparisonPriceArticles === null) {
						this.model.griOptionsComparisonPriceArticles = this.griOptionsComparisonPriceArticles();
					}

					this.model.griOptionsComparisonPriceArticles.data = [];
					this.model.paginationOptions.pageNumber = 1;
					if (this.model.griOptionsComparisonPriceArticles.gridApi) {
						this.model.griOptionsComparisonPriceArticles.gridApi.pagination.seek(this.model.paginationOptions.pageNumber);
					}
				}
				else {
					if (this.model.gridOptionsArticles === null) {
						this.model.gridOptionsArticles = this.griOptionsArticles();
					}

					this.model.gridOptionsArticles.data = [];
					this.model.paginationOptions.pageNumber = 1;
					if (this.model.gridOptionsArticles.gridApi) {
						this.model.gridOptionsArticles.gridApi.pagination.seek(this.model.paginationOptions.pageNumber);
					}
				}
			}

			this.catalogArticlesFactory.searchArticles(this.model, defer, countAgainFlag);

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
	}

	/**
	 * clean search filters
	 */
	cleanFilters() {
		this.kMessageService.hide();

		this.model.resetFiltersSearch();
		this.model.classificationsSelectedList = [];
		this.cleanClassificationFilter();
	}

	cleanClassificationFilter(){
		this.model.filterValue = null;
		this.filter();

		if(this.searchGridFactory.gridOptionsClasificaciones.gridApi){
			let classificationsSelectedList = this.searchGridFactory.gridOptionsClasificaciones.gridApi.selection.getSelectedRows();
			if (classificationsSelectedList.length > 0) {
				let rows = this.searchGridFactory.gridOptionsClasificaciones.gridApi.grid.rows;
				while (rows.length > 0) {
					rows = this.catalogArticlesFactory.unSelectAllGridRows(rows);
				}
			}
		}
	}

	changeAplicaRegSan(){
		this.model.resetFiltersSearchRegSan();
	}

	reportChange() {
		if (this.model.reportOptionRol === this.appConstant.ROL_USER_COMPARACION_PRECIO) {
			if (this.model.griOptionsComparisonPriceArticles !== null) {
				this.model.griOptionsComparisonPriceArticles.data = [];
			}
			else {
				this.model.griOptionsComparisonPriceArticles = this.griOptionsComparisonPriceArticles();
			}

			if(this.model.messageCPDate !== undefined){
				this.kModalService.showWarning(
					this, this.kMessageService.renderMessage('messageDatePricesComparisson', {date: this.model.messageCPDate}),
					() => {}, this.kModalService.MODAL_SIZE.SMALL);	
			}
		} else if (this.model.gridOptionsArticles !== null) {
			this.model.gridOptionsArticles.data = [];
		}

		this.cleanFilters();
	}

	filter(){
		let filter = this.model.filterValue;
		if(filter !== null && filter !== undefined){
			filter = this.model.filterValue.toUpperCase();
		}
		this.searchGridFactory.filterValueFunc(this.searchGridFactory.gridOptionsClasificaciones, filter);
		if(this.searchGridFactory.gridOptionsClasificaciones.gridApi){
			this.searchGridFactory.gridOptionsClasificaciones.gridApi.grid.refresh();
		}


		if(filter !== null && filter !== undefined && filter !== ''){
			this.$timeout(()=>{
				this.searchGridFactory.expandAll(this.searchGridFactory.gridOptionsClasificaciones);
			},200);
		}else{
			this.$timeout(()=>{
				this.searchGridFactory.collapseAll(this.searchGridFactory.gridOptionsClasificaciones);
			},200);
		}
	}

	/**
	 * Definition of articles grid options
	 */
	griOptionsArticles() {
		let pageSize = this.appConstant.ARTICLES_GRID_PAGE_SIZE;
		this.model.paginationOptions.pageSize = pageSize;

		let gridOptions = {
			init: (gridCtrl, gridScope) => {
				gridScope.$on('ngGridEventData', () => {
				});
			},
			onRegisterApi: (gridApi) => {
				gridOptions.gridApi = gridApi;
				gridApi.pagination.on.paginationChanged(null, (newPage, pageSize) => {
					this.model.paginationOptions.pageNumber = newPage;
					this.model.paginationOptions.pageSize = pageSize;
					this.searchArticles(false);
				});
			},
			data: [],
			rowHeight: 20,
			enableColumnMenus: false,
			minRowsToShow: pageSize + 1,
			paginationPageSize: pageSize,
			useExternalPagination: true,
			totalItems: pageSize,
			enablePaginationControls: false,
			enableColumnResizing: true,
			enableSorting: false,
			columnDefs: [
				{
					displayName: 'No',
					field: 'index',
					width: '35',
					pinnedLeft: true,
					cellClass: 'text-center',
					sort: {priority: 0, direction: 'asc'},
					cellTemplate: '<div class="ui-grid-cell-contents" ' +
					'ng-class="row.entity.dynamicProperties.claseArticulo">' +
					'<span>{{(grid.renderContainers.body.visibleRowCache.indexOf(row)+1) ' +
					'+ (grid.appScope.contentSearch.model.paginationOptions.pageSize ' +
					'* (grid.appScope.contentSearch.model.paginationOptions.pageNumber -1))}}</span></div>',
				},
				{
					displayName: 'Bloqueo',
					field: 'tieneBloqueoFlux',
					width: '45',
					pinnedLeft: true,
					cellClass: 'text-center',
					cellTemplate: '<div class="ui-grid-cell-contents" ' +
					'ng-class="row.entity.dynamicProperties.claseArticulo">' +
					'<img title="Artículo pendiente autorización"' +
					'ng-if="row.entity.articulo.tieneBloqueoFlux === grid.appScope.contentSearch.appConstant.ESTADO_ACTVO" ' +
					'ng-src="{{grid.appScope.contentSearch.appConstant.IMG_ICON_BLOCK}}"/></div>',
				},
				{
					displayName: 'Código barras',
					field: 'codigoBarras',
					width: '*',
					minWidth: 90,
					pinnedLeft: true,
					cellTemplate: '<div class="ui-grid-cell-contents" ' +
					'ng-class="row.entity.dynamicProperties.claseArticulo">' +
					'<a ng-click="grid.appScope.contentSearch.editArticle(row.entity)">' +
					'{{row.entity.articulo.codigoBarras}}' +
					'</a>' +
					'</div>',
				},
				{
					displayName: 'Descripción artículo',
					field: 'descripcionArticulo',
					width: '*',
					minWidth: 200,
					pinnedLeft: true,
					cellTemplate: '<div class="ui-grid-cell-contents" ' +
					'ng-class="row.entity.dynamicProperties.claseArticulo">' +
					'<span title="{{row.entity.articulo.descripcionArticulo}} ' +
					'{{row.entity.articulo.articuloMedidaDTO.referenciaMedida}}">' +
					'{{row.entity.articulo.descripcionArticulo}} {{row.entity.articulo.articuloMedidaDTO.referenciaMedida}}</span></div>',
				},
				{
					displayName: 'Clasificación',
					field: 'descripcionClasificacion',
					width: '*',
					minWidth: 120,
					pinnedLeft: true,
					cellTemplate: '<div class="ui-grid-cell-contents" ' +
					'ng-class="row.entity.dynamicProperties.claseArticulo">' +
					'<span title="{{row.entity.articulo.codigoClasificacion}} ' +
					'- {{row.entity.articulo.clasificacionDTO.descripcionClasificacion}}">' +
					'{{row.entity.articulo.codigoClasificacion}} ' +
					'- {{row.entity.articulo.clasificacionDTO.descripcionClasificacion}}</span></div>',
				},
				{
					displayName: 'Marca comercial',
					field: 'marcaComercialArticulo',
					width: '*',
					minWidth: 60,
					pinnedLeft: true,
					cellTemplate: '<div class="ui-grid-cell-contents" ' +
					'ng-class="row.entity.dynamicProperties.claseArticulo">' +
					'<span title="{{row.entity.articulo.articuloComercialDTO.marcaComercialArticulo.nombre}}">' +
					'{{row.entity.articulo.articuloComercialDTO.marcaComercialArticulo.nombre}}</span></div>',
				},
				//{
				//	displayName: 'Tamaño',
				//	field: 'referenciaMedida',
				//	width: '*',
				//	minWidth: 55,
				//	pinnedLeft: true,
				//	cellClass: 'whiteCell',
				//	cellTemplate: '<div class="ui-grid-cell-contents" ' +
				//	'ng-class="{\'redCell\':row.entity.articulo.tieneBloqueoFlux ' +
				//	'=== grid.appScope.contentSearch.appConstant.ESTADO_ACTVO}">' +
				//	'{{row.entity.articulo.articuloMedidaDTO.referenciaMedida}}</div>',
				//},
				{
					displayName: 'Código referencia',
					field: 'codigoReferenciaProveedor',
					width: '*',
					minWidth: 120,
					cellTemplate: '<div class="ui-grid-cell-contents" ' +
					'ng-class="row.entity.dynamicProperties.claseArticulo">' +
					'<span title="{{row.entity.codigoReferenciaProveedor}}">{{row.entity.codigoReferenciaProveedor}}</span></div>',
				},
				{
					displayName: 'Descripción proveedor',
					field: 'descripcionArticulo',
					width: '*',
					minWidth: 150,
					cellTemplate: '<div class="ui-grid-cell-contents" ' +
					'ng-class="row.entity.dynamicProperties.claseArticulo">' +
					'<span title="{{row.entity.descripcionArticulo}}">{{row.entity.descripcionArticulo}}</span></div>',
				},
				{
					displayName: 'Estado',
					field: 'estadoArticuloProveedor',
					width: '45',
					cellClass: 'text-center',
					cellTemplate: '<div class="ui-grid-cell-contents" ' +
					'ng-class="row.entity.dynamicProperties.claseArticulo">' +
					'<img ng-if="row.entity.estadoArticuloProveedor ' +
					'== grid.appScope.contentSearch.appConstant.ESTADO_ACTVO" ' +
					'ng-src="{{grid.appScope.contentSearch.appConstant.IMG_ICON_ACTIVE}}"/>' +
					'<img ng-if="row.entity.estadoArticuloProveedor ' +
					'!= grid.appScope.contentSearch.appConstant.ESTADO_ACTVO" ' +
					'ng-src="{{grid.appScope.contentSearch.appConstant.IMG_ICON_INACTIVE}}"/></div>',
				},
				{
					displayName: 'Aplica transgénico',
					field: 'aplicaTransgenico',
					width: '70',
					cellClass: 'text-center',
					cellTemplate: '<div class="ui-grid-cell-contents" ' +
					'ng-class="row.entity.dynamicProperties.claseArticulo">' +
					'<img ng-if="row.entity.articulo.aplicaTransgenico"' +
					'ng-src="{{grid.appScope.contentSearch.appConstant.IMG_ICON_ACTIVE}}"/>' +
					'<img ng-if="!row.entity.articulo.aplicaTransgenico"' +
					'ng-src="{{grid.appScope.contentSearch.appConstant.IMG_ICON_INACTIVE}}"/>' +
					'</div>',
				},
				{
					displayName: 'Transgénico',
					field: 'transgenico',
					width: '75',
					cellClass: 'text-center',
					cellTemplate: '<div class="ui-grid-cell-contents" ' +
					'ng-class="row.entity.dynamicProperties.claseArticulo">' +
					'<div ng-if="row.entity.articulo.aplicaTransgenico">'+
					'<img ng-if="row.entity.articulo.valorEstadoTransgenico == grid.appScope.contentSearch.appConstant.ESTADO_ACTVO" ' +
					'ng-src="{{grid.appScope.contentSearch.appConstant.IMG_ICON_ACTIVE}}"/>' +
					'<img ng-if="row.entity.articulo.valorEstadoTransgenico == grid.appScope.contentSearch.appConstant.ESTADO_INACTIVO" ' +
					'ng-src="{{grid.appScope.contentSearch.appConstant.IMG_ICON_INACTIVE}}"/>' +
					'</div></div>',
				},
				{
					displayName: 'Tiene reg. sanitario',
					field: 'esConfirmadoRegistroSanitario',
					width: '60',
					cellClass: 'text-center',
					cellTemplate: '<div class="ui-grid-cell-contents" ' +
					'ng-class="row.entity.dynamicProperties.claseArticulo">' +
					'<img ng-if="row.entity.esConfirmadoRegistroSanitario" ' +
					'ng-src="{{grid.appScope.contentSearch.appConstant.IMG_ICON_ACTIVE}}"/>' +
					'<img ng-if="!row.entity.esConfirmadoRegistroSanitario" ' +
					'ng-src="{{grid.appScope.contentSearch.appConstant.IMG_ICON_INACTIVE}}"/></div>',
				},
				{
					displayName: 'Observación',
					field: 'observacionRegistroSanitario',
					width: '*',
					minWidth: 150,
					cellTemplate: '<div class="ui-grid-cell-contents" ' +
					'ng-class="row.entity.dynamicProperties.claseArticulo">' +
					'<span title="{{row.entity.observacionRegistroSanitario}}">' +
					'{{row.entity.observacionRegistroSanitario}}</span></div>',
				},
				{
					displayName: 'Historial',
					field: 'historial',
					width: '60',
					cellClass: 'text-center',
					cellTemplate: '<div class="ui-grid-cell-contents" ' +
					'ng-class="row.entity.dynamicProperties.claseArticulo">' +
					'<a ng-if="row.entity.esConfirmadoRegistroSanitario" title="Ver historial reg. sanitario"' +
					'ng-click="grid.appScope.contentSearch.searchSanitaryRegisterRecord(row.entity)">' +
					'<img ng-src="{{grid.appScope.contentSearch.appConstant.IMG_ICON_DETAILS}}"/></a></div>',
				},
				{
					displayName: 'Documento transgénico',
					field: 'documentoTransgenico',
					width: '80',
					cellClass: 'text-center',
					cellTemplate: '<div class="ui-grid-cell-contents" ' +
					'ng-class="row.entity.dynamicProperties.claseArticulo">' +
					'<a ng-if="row.entity.articulo.aplicaTransgenico && '+
					'row.entity.articulo.valorEstadoTransgenico == grid.appScope.contentSearch.appConstant.ESTADO_INACTIVO" ' +
					'ng-click="grid.appScope.contentSearch.searchArticleImage(row.entity.articulo, ' +
					'grid.appScope.contentSearch.appConstant.TIPO_IMAGEN_DOC_JUSTIFICACION_NO_TRANSG)"' +
					'title="Descargar documento transgénico">' +
					'<img ng-src="{{grid.appScope.contentSearch.appConstant.IMG_ICON_DOWNLOAD}}"/></a></div>',
				},
				{
					displayName: 'Imagen artículo',
					field: 'imagenArtículo',
					width: '60',
					cellClass: 'text-center',
					cellTemplate: '<div class="ui-grid-cell-contents" ' +
					'ng-class="row.entity.dynamicProperties.claseArticulo">' +
					'<a ng-click="grid.appScope.contentSearch.searchArticleImage(row.entity.articulo, ' +
					'grid.appScope.contentSearch.appConstant.TIPO_IMAGEN_GENERAL_ARTICULO)"' +
					'title="Descargar imagen artículo">' +
					'<img ng-src="{{grid.appScope.contentSearch.appConstant.IMG_ICON_DOWNLOAD}}"/></a></div>',
				},
			]
		};
		return gridOptions;
	}

	/**
	 * Definition of articles grid options
	 */
	griOptionsComparisonPriceArticles() {
		let pageSize = this.appConstant.ARTICLES_GRID_PAGE_SIZE;
		this.model.paginationOptions.pageSize = pageSize;

		let gridOptions = {
			init: (gridCtrl, gridScope) => {
				gridScope.$on('ngGridEventData', () => {
				});
			},
			onRegisterApi: (gridApi) => {
				gridOptions.gridApi = gridApi;
				gridApi.pagination.on.paginationChanged(null, (newPage, pageSize) => {
					if(this.model.paginationOptions.pageNumber !== newPage){
						this.model.paginationOptions.pageNumber = newPage;
						this.model.paginationOptions.pageSize = pageSize;
						this.searchArticles(false);
					}
				});
			},
			data: [],
			rowHeight: 23,
			enableColumnMenus: false,
			minRowsToShow: pageSize + 1,
			paginationPageSize: pageSize,
			useExternalPagination: true,
			totalItems: pageSize,
			paginationPageSizes: [25, 50, 75],
			enablePaginationControls: false,
			columnDefs: [
				{
					displayName: 'No',
					field: 'index',
					width: '25',
					pinnedLeft: true,
					cellClass: 'text-center',
					enableSorting: false,
					cellTemplate: '<div class="ui-grid-cell-contents" ' +
					'ng-class="row.entity.cssFilaComparacionPrecio">' +
					'<span>{{(grid.renderContainers.body.visibleRowCache.indexOf(row)+1) ' +
					'+ (grid.appScope.contentSearch.model.paginationOptions.pageSize ' +
					'* (grid.appScope.contentSearch.model.paginationOptions.pageNumber -1))}}</span></div>'
				},
				{
					displayName: 'Código barras',
					field: 'codigoBarras',
					width: '*',
					minWidth: 110,
					pinnedLeft: true,
					enableSorting: false,
					cellTemplate: '<div class="ui-grid-cell-contents" ' +
					'ng-class="row.entity.cssFilaComparacionPrecio">' +
					'<a ng-if ="row.entity.tieneBitacoraArticuloProveedor === grid.appScope.contentSearch.appConstant.ESTADO_ACTVO" ' +
					'title="Mostrar histórico de precios"'+
					'ng-click="grid.appScope.contentSearch.showHistorialPricesModal(row.entity)">' +
					'<img ng-src="{{grid.appScope.contentSearch.appConstant.IMG_ICON_HISTORIAL_PRICES}}" style="margin-right:5px"/></a>' +
					'<span ng-class="{codBarrasPadding:row.entity.tieneBitacoraArticuloProveedor !== ' +
					'grid.appScope.contentSearch.appConstant.ESTADO_ACTVO}">' +
					'{{row.entity.codigoBarras}}</span></div>'
				},
				{
					displayName: 'Código referencia',
					field: 'codigoReferenciaProveedor',
					width: '*',
					minWidth: 100,
					pinnedLeft: true,
					enableSorting: false,
					cellTemplate: '<div class="ui-grid-cell-contents" ' +
					'ng-class="row.entity.cssFilaComparacionPrecio">' +
					'<span>{{row.entity.codigoReferenciaProveedor}}</span></div>'
				},
				{
					displayName: 'Descripción artículo',
					field: 'descripcionArticulo',
					width: '*',
					minWidth: 210,
					pinnedLeft: true,
					enableSorting: false,
					cellTemplate: '<div class="ui-grid-cell-contents" ' +
					'ng-class="row.entity.cssFilaComparacionPrecio">' +
					'<span title="{{row.entity.descripcionArticulo}} ' +
					'{{row.entity.referenciaMedida}}">' +
					'{{row.entity.descripcionArticulo}} {{row.entity.referenciaMedida}}</span></div>'
				},
				{
					displayName: 'P.V.P.Prov.',
					field: 'pvpProv',
					width: '*',
					minWidth: 85,
					pinnedLeft: true,
					cellClass: 'text-center',
					enableSorting: false,
					cellTemplate: '<div class="ui-grid-cell-contents" ' +
					'ng-class="row.entity.cssFilaComparacionPrecio">' +
					'<k-input-numeric type="double" ng-model="row.entity.bitacoraArticuloPvp.valorPrecioProveedor" ' +
					'placeholder="P.V.P." integer-places="8" disabled="row.entity.bitacoraArticuloPvp.valorPrecioNegociacion == undefined" ' +
					'decimal-places=grid.appScope.contentSearch.appConstant.NUMBER_DECIMAL_DIGITS ' +
					'on-blur="grid.appScope.contentSearch.validatePriceValue(row.entity.bitacoraArticuloPvp)"></k-input-numeric></div>'
				},
				{
					displayName: 'P.V.P.',
					field: 'pvp',
					width: '*',
					minWidth: 60,
					pinnedLeft: true,
					cellClass: 'text-right',
					enableSorting: false,
					cellTemplate: '<div class="ui-grid-cell-contents" ' +
					'ng-class="row.entity.cssFilaComparacionPrecio">' +
					'<span>{{row.entity.valorActual | number: grid.appScope.contentSearch.appConstant.NUMBER_DECIMAL_DIGITS}}</span></div>'
				},
				{
					displayName: 'C.Neto Prov.',
					field: 'cnetoProv',
					width: '*',
					minWidth: 85,
					pinnedLeft: true,
					cellClass: 'text-center',
					enableSorting: false,
					cellTemplate: '<div class="ui-grid-cell-contents" ' +
					'ng-class="row.entity.cssFilaComparacionPrecio">' +
					'<k-input-numeric type="double" ng-model="row.entity.bitacoraArticuloCostoNeto.valorPrecioProveedor" ' +
					'placeholder="C.Neto" integer-places="8" disabled="row.entity.bitacoraArticuloCostoNeto.valorPrecioNegociacion == undefined"' +
					'decimal-places=grid.appScope.contentSearch.appConstant.NUMBER_DECIMAL_DIGITS ' +
					'on-blur="grid.appScope.contentSearch.validatePriceValue(row.entity.bitacoraArticuloCostoNeto)">' +
					'</k-input-numeric></div>'
				},
				{
					displayName: 'C.Neto',
					field: 'cneto',
					width: '*',
					minWidth: 60,
					pinnedLeft: true,
					cellClass: 'text-right',
					enableSorting: false,
					cellTemplate: '<div class="ui-grid-cell-contents" ' +
					'ng-class="row.entity.cssFilaComparacionPrecio">' +
					'<span>{{row.entity.costoNeto | number: grid.appScope.contentSearch.appConstant.NUMBER_DECIMAL_DIGITS}}</span></div>'
				},
				{
					displayName: 'U.Manejo Prov.',
					field: 'umanejoProv',
					width: '*',
					minWidth: 60,
					pinnedLeft: true,
					cellClass: 'text-center',
					enableSorting: false,
					cellTemplate: '<div class="ui-grid-cell-contents" ' +
					'ng-class="row.entity.cssFilaComparacionPrecio">' +
					'<k-input-numeric type="integer" ng-model="row.entity.bitacoraArticuloUniMan.valorPrecioProveedor" ' +
					'placeholder="U.Manejo" integer-places="4" disabled="row.entity.bitacoraArticuloUniMan.valorPrecioNegociacion == undefined"' +
					'on-blur="grid.appScope.contentSearch.validatePriceValue(row.entity.bitacoraArticuloUniMan, false)">' +
					'</k-input-numeric></div>'
				},
				{
					displayName: 'U.Manejo',
					field: 'umanejo',
					width: '*',
					minWidth: 60,
					pinnedLeft: true,
					enableSorting: false,
					cellTemplate: '<div class="ui-grid-cell-contents" ' +
					'ng-class="row.entity.cssFilaComparacionPrecio">' +
					'<span ng-if="row.entity.articuloUnidadManejoProveedor.articuloUnidadManejoDTO.valorTipoUnidadEmpaque &&' +
					'row.entity.articuloUnidadManejoProveedor.articuloUnidadManejoDTO.valorUnidadManejo">' +
					'{{row.entity.articuloUnidadManejoProveedor.articuloUnidadManejoDTO.valorTipoUnidadEmpaque}} ' +
					'/ {{row.entity.articuloUnidadManejoProveedor.articuloUnidadManejoDTO.valorUnidadManejo}}</span></div>'
				},
				{
					displayName: 'Clasificación',
					name: 'descripcionClasificacion',
					field: 'descripcionClasificacion',
					width: '*',
					minWidth: 150,
					enableSorting: false,
					cellTemplate: '<div class="ui-grid-cell-contents" ' +
					'ng-class="row.entity.cssFilaComparacionPrecio">' +
					'<span title="{{row.entity.codigoClasificacion}} - {{row.entity.descripcionClasificacion}}">' +
					'{{row.entity.codigoClasificacion}} - {{row.entity.descripcionClasificacion}}</span></div>'
				},
				{
					displayName: 'Bodega',
					name: 'bodega',
					field: 'bodega',
					width: '*',
					minWidth: 90,
					enableSorting: false,
					cellTemplate: '<div class="ui-grid-cell-contents" ' +
					'ng-class="row.entity.cssFilaComparacionPrecio">' +
					'<span title="{{row.entity.descripcionBodega}}">' +
					'{{row.entity.descripcionBodega}}</span></div>'
				},
				{
					displayName: 'C.Bruto',
					field: 'cbruto',
					width: 60,
					minWidth: 60,
					headerCellTemplate: '<div class="ui-grid-cell-contents">' +
					'<span>{{col.displayName}}</span>' +
					'<a ng-if="!grid.appScope.contentSearch.model.isOpenDiscount" ' +
					'title="Mostrar cadena de descuentos"'+
					'ng-click="grid.appScope.contentSearch.manageDiscountColumns(true)">' +
					'<img ng-src="{{grid.appScope.contentSearch.appConstant.IMG_ICON_SHOW_COLUMN}}" style="margin-right:5px"/></a>' +
					'<a ng-if="grid.appScope.contentSearch.model.isOpenDiscount" ' +
					'title="Ocultar cadena de descuentos"'+
					'ng-click="grid.appScope.contentSearch.manageDiscountColumns(false)">' +
					'<img ng-src="{{grid.appScope.contentSearch.appConstant.IMG_ICON_HIDE_COLUMN}}" style="margin-right:5px"/></a>' +
					'</div>',
					cellClass: 'text-right',
					cellTemplate: '<div class="ui-grid-cell-contents" ' +
					'ng-class="row.entity.cssFilaComparacionPrecio">' +
					'<span>{{row.entity.costoBruto | number: grid.appScope.contentSearch.appConstant.NUMBER_DECIMAL_DIGITS}}</span></div>'
				},
				{
					displayName: 'I.V.A.(Prov)',
					field: 'ivaProv',
					width: '*',
					minWidth: 60,
					cellClass: 'text-center',
					enableSorting: false,
					cellTemplate: '<div class="ui-grid-cell-contents"' +
					'ng-class="row.entity.cssFilaComparacionPrecio">' +
					'<input type="checkbox" name="ivaProv" ' +
					'ng-true-value="{{grid.appScope.contentSearch.appConstant.ESTADO_ACTIVO_NUM}}" ' +
					'ng-false-value="{{grid.appScope.contentSearch.appConstant.ESTADO_INACTIVO_NUM}}" ' +
					'ng-model="row.entity.bitacoraArticuloIva.valorPrecioProveedor"/></div>'
				},
				{
					displayName: 'I.V.A.(V)',
					field: 'ivaV',
					width: '*',
					minWidth: 60,
					enableSorting: false,
					cellTemplate: '<div class="ui-grid-cell-contents" ' +
					'ng-class="row.entity.cssFilaComparacionPrecio">' +
					'<div ng-if="row.entity.articuloImpuestoIva.tipoImpuestoArticulo.porcentajeImpuesto != null">' +
					'<span>{{row.entity.articuloImpuestoIva.tipoImpuestoArticulo.porcentajeImpuesto | number:1}}%' +
					'</span></div></div>'
				},
				{
					displayName: 'I.Verde (Prov)',
					field: 'iverdeProv',
					width: '*',
					minWidth: 60,
					cellClass: 'text-center',
					enableSorting: false,
					cellTemplate: '<div class="ui-grid-cell-contents" ' +
					'ng-class="row.entity.cssFilaComparacionPrecio">' +
					'<input type="checkbox" name="iverdeProv" ' +
					'ng-true-value="{{grid.appScope.contentSearch.appConstant.ESTADO_ACTIVO_NUM}}" ' +
					'ng-false-value="{{grid.appScope.contentSearch.appConstant.ESTADO_INACTIVO_NUM}}" ' +
					'ng-model="row.entity.bitacoraArticuloImpVerde.valorPrecioProveedor"/></div>'
				},
				{
					displayName: 'I.Verde (V)',
					field: 'iverdeV',
					width: '*',
					minWidth: 60,
					enableSorting: false,
					cellTemplate: '<div class="ui-grid-cell-contents" ' +
					'ng-class="row.entity.cssFilaComparacionPrecio">' +
					'<div ng-if="row.entity.articuloImpuestoIve.tipoImpuestoArticulo.porcentajeImpuesto != null">' +
					'<span>{{row.entity.articuloImpuestoIve.tipoImpuestoArticulo.porcentajeImpuesto | number:1}}%</span></div></div>'
				},
			]
		};
		return gridOptions;
	}

}

export default SidebarSearchController;
