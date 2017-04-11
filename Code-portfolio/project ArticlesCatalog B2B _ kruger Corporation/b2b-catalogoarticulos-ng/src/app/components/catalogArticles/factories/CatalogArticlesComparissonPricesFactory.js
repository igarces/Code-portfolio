class CatalogArticlesComparissonPricesFactory {

	constructor(catalogArticlesService, kConstantFactory, actionsLayout, kMessageService, $timeout) {
		'ngInject';
		this.catalogArticlesService = catalogArticlesService;
		this._layoutActions = actionsLayout;
		this._kMessageService = kMessageService;
		this.$timeout = $timeout;

		kConstantFactory.$getConstant('articles')
			.then((data) => {
				this._kConstantFactory = data;
			});
	}

	static instance(catalogArticlesService, kConstantFactory, actionsLayout, kMessageService, $timeout) {
		'ngInject';
		return new CatalogArticlesComparissonPricesFactory(catalogArticlesService, kConstantFactory, actionsLayout,
			kMessageService, $timeout);
	}

	saveComparisonPricesArticles(model, promise) {
		let params = {
			codigoCompania: model.codigoCompania,
			codigoProveedor: model.codigoProveedor,
			userId: model.userId,
			bitacoraArticuloPrecioTransients: model.comparissonPricesList
		};

		return this.catalogArticlesService.saveComparisonPricesArticles(params)
			.success((data)=> {


				promise.resolve(data);
			})
			.error((message) => {
				promise.reject(message);
			});
	}

	sendComparisonPricesArticles(model, promise) {
		let listBitacoras = this.listDataSend(model);
		let params = {
			codigoCompania: model.codigoCompania,
			codigoProveedor: model.codigoProveedor,
			nombreProveedor: model.nombreProveedor,
			codigoJDEProveedor: model.codigoJDEProveedor,
			userId: model.userId,
			userCompleteName: model.userName,
			bitacoraArticuloPrecioTransients: listBitacoras
		};

		return this.catalogArticlesService.sendComparisonPricesArticles(params)
			.success((data)=> {
				promise.resolve(data);
			})
			.error((message) => {
				promise.reject(message);
			});
	}

	listDataSend(model){
		let sendList = model.griComparisonPrice.data;
		let bitacoraList = [];

		for(let index in sendList){
			if(sendList[index]){
				if(sendList[index].bitacoraArticuloPvp){
					bitacoraList.push(sendList[index].bitacoraArticuloPvp);
				}
				if(sendList[index].bitacoraArticuloCostoNeto){
					bitacoraList.push(sendList[index].bitacoraArticuloCostoNeto);
				}
				if(sendList[index].bitacoraArticuloUniMan){
					bitacoraList.push(sendList[index].bitacoraArticuloUniMan);
				}
				if(sendList[index].bitacoraArticuloIva){
					bitacoraList.push(sendList[index].bitacoraArticuloIva);
				}
				if(sendList[index].bitacoraArticuloImpVerde){
					bitacoraList.push(sendList[index].bitacoraArticuloImpVerde);
				}
			}
		}
		return bitacoraList;
	}

	prepareDataComparissonPrices(model) {
		model.onlyChangeComparissonPrices = new Map();
		let message = null; 

		for (let newArticle in model.griOptionsComparisonPriceArticles.data) {
			if (model.griOptionsComparisonPriceArticles.data[newArticle]) {
				let articulo = model.griOptionsComparisonPriceArticles.data[newArticle];

				if(articulo.bitacoraArticuloPvp.codigoBitacoraArticuloProveedorPrecio !== undefined &&
					articulo.bitacoraArticuloPvp.valorPrecioProveedor !== undefined){

					articulo.bitacoraArticuloPvp.valorPrecioProveedor = Number(articulo.bitacoraArticuloPvp.valorPrecioProveedor)
						.toFixed(this._kConstantFactory.NUMBER_DECIMAL_DIGITS);

					model.onlyChangeComparissonPrices.set(articulo.bitacoraArticuloPvp.codigoBitacoraArticuloProveedorPrecio,
						articulo.bitacoraArticuloPvp.valorPrecioProveedor);
				}

				if(articulo.bitacoraArticuloCostoNeto.codigoBitacoraArticuloProveedorPrecio !== undefined &&
					articulo.bitacoraArticuloCostoNeto.valorPrecioProveedor !== undefined){

					articulo.bitacoraArticuloCostoNeto.valorPrecioProveedor = Number(articulo.bitacoraArticuloCostoNeto
						.valorPrecioProveedor).toFixed(this._kConstantFactory.NUMBER_DECIMAL_DIGITS);

					model.onlyChangeComparissonPrices.set(articulo.bitacoraArticuloCostoNeto.codigoBitacoraArticuloProveedorPrecio,
						articulo.bitacoraArticuloCostoNeto.valorPrecioProveedor);
				}

				if(articulo.bitacoraArticuloUniMan.codigoBitacoraArticuloProveedorPrecio !== undefined &&
					articulo.bitacoraArticuloUniMan.valorPrecioProveedor !== undefined){

					model.onlyChangeComparissonPrices.set(articulo.bitacoraArticuloUniMan.codigoBitacoraArticuloProveedorPrecio,
						articulo.bitacoraArticuloUniMan.valorPrecioProveedor);
				}

				//Marcar checkbox de impuestos IVA por defecto
				if(articulo.bitacoraArticuloIva.valorPrecioProveedor === undefined &&
					articulo.bitacoraArticuloIva.valorPrecioNegociacion !== undefined){

					articulo.bitacoraArticuloIva.valorPrecioProveedor = articulo.bitacoraArticuloIva.valorPrecioNegociacion;
				}

				if(articulo.bitacoraArticuloIva.codigoBitacoraArticuloProveedorPrecio !== undefined &&
					articulo.bitacoraArticuloIva.valorPrecioProveedor !== undefined){

					model.onlyChangeComparissonPrices.set(articulo.bitacoraArticuloIva.codigoBitacoraArticuloProveedorPrecio,
						articulo.bitacoraArticuloIva.valorPrecioProveedor);
				}

				//Marcar checkbox de impuestos IVE por defecto
				if(articulo.bitacoraArticuloImpVerde.valorPrecioProveedor === undefined &&
					articulo.bitacoraArticuloImpVerde.valorPrecioNegociacion !== undefined){

					articulo.bitacoraArticuloImpVerde.valorPrecioProveedor = articulo.bitacoraArticuloImpVerde.valorPrecioNegociacion;
				}

				if(articulo.bitacoraArticuloImpVerde.codigoBitacoraArticuloProveedorPrecio !== undefined &&
					articulo.bitacoraArticuloImpVerde.valorPrecioProveedor !== undefined){

					model.onlyChangeComparissonPrices.set(articulo.bitacoraArticuloImpVerde.codigoBitacoraArticuloProveedorPrecio,
						articulo.bitacoraArticuloImpVerde.valorPrecioProveedor);
				}

				// Setear valores del excel
				this.setExcelBitacoraValues(model, articulo);

				if(articulo.bitacoraArticuloPvp.valorPrecioNegociacion === undefined || 
				articulo.bitacoraArticuloCostoNeto.valorPrecioNegociacion === undefined || 
				articulo.bitacoraArticuloUniMan.valorPrecioNegociacion === undefined){
					message = this._kMessageService.renderMessage('noEditPricesComparisson');
				}	
			}
		}

		return message;
	}

	setExcelBitacoraValues(model, articulo){
		if(model.mapBitacorasExcel !== null && model.mapBitacorasExcel !== undefined){
			let bitacoraExcel = model.mapBitacorasExcel[articulo.codigoArticulo];
			if(bitacoraExcel !== null && bitacoraExcel !== undefined){
				
				let bitacoraArticuloPvp = bitacoraExcel.bitacoraArticuloPvp;
				if(bitacoraArticuloPvp !== null && bitacoraArticuloPvp !== undefined && 
					Number(articulo.bitacoraArticuloPvp.valorPrecioNegociacion) !== 
					Number(bitacoraArticuloPvp.valorPrecioProveedor) &&
					articulo.bitacoraArticuloPvp.valorPrecioNegociacion !== undefined ){

					articulo.bitacoraArticuloPvp.valorPrecioProveedor = Number(bitacoraArticuloPvp.valorPrecioProveedor).toFixed(this._kConstantFactory.NUMBER_DECIMAL_DIGITS);
				}
				
				let bitacoraArticuloCostoNeto = bitacoraExcel.bitacoraArticuloCostoNeto;
				if(bitacoraArticuloCostoNeto !== null && bitacoraArticuloCostoNeto !== undefined && 
					Number(articulo.bitacoraArticuloCostoNeto.valorPrecioNegociacion) !== 
					Number(bitacoraArticuloCostoNeto.valorPrecioProveedor) &&
					articulo.bitacoraArticuloCostoNeto.valorPrecioNegociacion !== undefined){

					articulo.bitacoraArticuloCostoNeto.valorPrecioProveedor = Number(bitacoraArticuloCostoNeto.valorPrecioProveedor).toFixed(this._kConstantFactory.NUMBER_DECIMAL_DIGITS);
				}

				let bitacoraArticuloUniMan = bitacoraExcel.bitacoraArticuloUniMan;
				if(bitacoraArticuloUniMan !== null && bitacoraArticuloUniMan !== undefined && 
					Number(articulo.bitacoraArticuloUniMan.valorPrecioNegociacion) !== 
					Number(bitacoraArticuloUniMan.valorPrecioProveedor) &&
					articulo.bitacoraArticuloUniMan.valorPrecioNegociacion !== undefined){

					articulo.bitacoraArticuloUniMan.valorPrecioProveedor = Number(bitacoraArticuloUniMan.valorPrecioProveedor).toFixed(0);
				}

				let bitacoraArticuloIva = bitacoraExcel.bitacoraArticuloIva;
				if(bitacoraArticuloIva !== null && bitacoraArticuloIva !== undefined){

					articulo.bitacoraArticuloIva.valorPrecioProveedor = bitacoraArticuloIva.valorPrecioProveedor;
				}
				let bitacoraArticuloImpVerde = bitacoraExcel.bitacoraArticuloImpVerde;
				if(bitacoraArticuloImpVerde !== null && bitacoraArticuloImpVerde !== undefined){

					articulo.bitacoraArticuloImpVerde.valorPrecioProveedor = bitacoraArticuloImpVerde.valorPrecioProveedor;
				}
			}
		}
	}

	getComparissonPricesChangedData(model) {
		model.comparissonPricesList = [];

		for (let newArticle in model.griOptionsComparisonPriceArticles.data) {
			if (model.griOptionsComparisonPriceArticles.data[newArticle]) {
				let articulo = model.griOptionsComparisonPriceArticles.data[newArticle];

				let bitacoraPvp = this.searchChangeInBitacora(articulo.bitacoraArticuloPvp, model);
				if(bitacoraPvp !== null){
					model.comparissonPricesList.push(bitacoraPvp);
				}

				let bitacoraCostoNeto = this.searchChangeInBitacora(articulo.bitacoraArticuloCostoNeto, model);
				if(bitacoraCostoNeto !== null){
					model.comparissonPricesList.push(bitacoraCostoNeto);
				}

				let bitacoraArticuloUniMan = this.searchChangeInBitacora(articulo.bitacoraArticuloUniMan, model);
				if(bitacoraArticuloUniMan !== null){
					model.comparissonPricesList.push(bitacoraArticuloUniMan);
				}

				let bitacoraArticuloIva = this.searchChangeInBitacora(articulo.bitacoraArticuloIva, model);
				if(bitacoraArticuloIva !== null){
					model.comparissonPricesList.push(bitacoraArticuloIva);
				}

				let bitacoraArticuloImpVerde = this.searchChangeInBitacora(articulo.bitacoraArticuloImpVerde, model);
				if(bitacoraArticuloImpVerde !== null) {
					model.comparissonPricesList.push(bitacoraArticuloImpVerde);
				}
			}
		}


	}

	getComparissonPricesChangedDataToSend(model) {
		model.comparissonPricesToSend = new Map();

		for (let newArticle in model.griOptionsComparisonPriceArticles.data) {
			if (model.griOptionsComparisonPriceArticles.data[newArticle]) {
				let articulo = model.griOptionsComparisonPriceArticles.data[newArticle];

				let flagSend = false;
				let articuloToSend = {
					codigoArticulo: articulo.codigoArticulo,
					codigoBarras: articulo.codigoBarras,
					descripcionArticulo: articulo.descripcionArticulo,
				};

				let bitacoraPvp = this.searchChangeInBitacora(articulo.bitacoraArticuloPvp, model);
				if(bitacoraPvp !== null){
					flagSend = true;
					articuloToSend['bitacoraArticuloPvp'] = bitacoraPvp;
				}

				let bitacoraCostoNeto = this.searchChangeInBitacora(articulo.bitacoraArticuloCostoNeto, model);
				if(bitacoraCostoNeto !== null){
					flagSend = true;
					articuloToSend['bitacoraArticuloCostoNeto'] = bitacoraCostoNeto;
				}

				let bitacoraArticuloUniMan = this.searchChangeInBitacora(articulo.bitacoraArticuloUniMan, model);
				if(bitacoraArticuloUniMan !== null){
					flagSend = true;
					articuloToSend['bitacoraArticuloUniMan'] = bitacoraArticuloUniMan;
				}

				let bitacoraArticuloIva = this.searchChangeInBitacora(articulo.bitacoraArticuloIva, model);
				if(bitacoraArticuloIva !== null){
					flagSend = true;
					articuloToSend['bitacoraArticuloIva'] = bitacoraArticuloIva;
				}

				let bitacoraArticuloImpVerde = this.searchChangeInBitacora(articulo.bitacoraArticuloImpVerde, model);
				if(bitacoraArticuloImpVerde !== null) {
					flagSend = true;
					articuloToSend['bitacoraArticuloImpVerde'] = bitacoraArticuloImpVerde;
				}

				if(flagSend){
					model.comparissonPricesToSend.set(articulo.codigoArticulo, articuloToSend);
				}
			}
		}
	}

	searchChangeInBitacora(bitacoraArticulo, model){
		if(bitacoraArticulo && bitacoraArticulo.valorPrecioProveedor !== null &&
			bitacoraArticulo.valorPrecioProveedor !== undefined){

			if(Number(bitacoraArticulo.valorPrecioProveedor) !== Number(bitacoraArticulo.valorPrecioNegociacion)) {
				if(bitacoraArticulo.codigoBitacoraArticuloProveedorPrecio === null ||
					bitacoraArticulo.codigoBitacoraArticuloProveedorPrecio === undefined){

					return bitacoraArticulo;
				}else{
					let valorPrecioProveedorSaved =
						model.onlyChangeComparissonPrices.get(bitacoraArticulo.codigoBitacoraArticuloProveedorPrecio);

					if(Number(valorPrecioProveedorSaved) !== Number(bitacoraArticulo.valorPrecioProveedor)){
						return bitacoraArticulo;
					}
				}
			}
		}
		return null;
	}

	getHistorialComparisonPricesArticles(article, model, promise) {
		let params = {
			codigoCompania: model.codigoCompania,
			codigoProveedor: model.codigoProveedor,
			codigoArticulo: article.codigoArticulo
		};

		return this.catalogArticlesService.getHistorialComparisonPricesArticles(params)
			.success((data)=> {
				model.historialPricesBitacora = data;
				promise.resolve(data);
			})
			.error((message) => {
				promise.reject(message);
			});
	}

	getArticlesToSend(model, promise){
		let params = {
			codigoCompania: model.codigoCompania,
			codigoProveedor: model.codigoProveedor
		};

		return this.catalogArticlesService.getArticlesToSend(params)
			.success((data)=> {
				if(model.comparissonPricesToSend.size > 0){
					this.successGetArticlesToSend(model, data);
				}

				promise.resolve(data);
			})
			.error((message) => {
				promise.reject(message);
			});
	}

	successGetArticlesToSend(model, data){
		for(let index in data){
			if(data[index]){
				let articleToSend = data[index];
				if(model.comparissonPricesToSend.get(articleToSend.codigoArticulo)){
					let articleToSendChanged = model.comparissonPricesToSend.get(articleToSend.codigoArticulo);
					if(articleToSendChanged.bitacoraArticuloPvp !== null &&
						articleToSendChanged.bitacoraArticuloPvp !== undefined){
						articleToSend.bitacoraArticuloPvp = articleToSendChanged.bitacoraArticuloPvp;
					}
					if(articleToSendChanged.bitacoraArticuloCostoNeto !== null &&
						articleToSendChanged.bitacoraArticuloCostoNeto !== undefined){
						articleToSend.bitacoraArticuloCostoNeto = articleToSendChanged.bitacoraArticuloCostoNeto;
					}
					if(articleToSendChanged.bitacoraArticuloUniMan !== null &&
						articleToSendChanged.bitacoraArticuloUniMan !== undefined){
						articleToSend.bitacoraArticuloUniMan = articleToSendChanged.bitacoraArticuloUniMan;
					}
					if(articleToSendChanged.bitacoraArticuloIva !== null &&
						articleToSendChanged.bitacoraArticuloIva !== undefined){
						articleToSend.bitacoraArticuloIva = articleToSendChanged.bitacoraArticuloIva;
					}
					if(articleToSendChanged.bitacoraArticuloImpVerde !== null &&
						articleToSendChanged.bitacoraArticuloImpVerde !== undefined){
						articleToSend.bitacoraArticuloImpVerde = articleToSendChanged.bitacoraArticuloImpVerde;
					}
					model.comparissonPricesToSend.delete(articleToSend.codigoArticulo);
				}
			}
		}
		if(model.comparissonPricesToSend.size > 0){
			let map = model.comparissonPricesToSend;
			map.forEach((value) => {
				data.push(value);
			});
		}
	}

	manageDiscountColumns(model, open){
		model.isOpenDiscount = open;
		let gridColumns = model.griOptionsComparisonPriceArticles.columnDefs;
		let position = gridColumns.length;
		for(let index in model.discountList){
			if(model.discountList[index]){
				let column = null;
				for(let jindex in gridColumns){
					if(gridColumns[jindex]){
						if(gridColumns[jindex].field === 'cbruto'){
							position = Number(jindex) + 1;
						}
						if(gridColumns[jindex].name === model.discountList[index].nombre){
							column = gridColumns[jindex];
							break;
						}
					}
				}

				if(column === null){
					let width = '40';
					if(model.discountList[index]['@id'].codigoTipoDescuento === this._kConstantFactory.COD_TIPO_DESC_DOCDE ||
						model.discountList[index]['@id'].codigoTipoDescuento === this._kConstantFactory.COD_TIPO_DESC_PPRO){
						width = '50';
					}

					if(model.discountList[index]['@id'].codigoTipoDescuento === this._kConstantFactory.COD_TIPO_DESC_DSCTO_OFE){
						width = '90';
					}

					column = {
						name: model.discountList[index].nombre,
						displayName: model.discountList[index].nombre,
						field: model.discountList[index].nombre,
						width: width,
						visible: true,
						cellClass: 'discountSize',
						enableSorting: false,
						cellTemplate: '<div class="ui-grid-cell-contents" style="padding-top: 0px !important;" ' +
						'ng-class="row.entity.cssFilaComparacionPrecio">' +
						'<span>{{row.entity.mapDesArtPro[col.displayName].valorDescuento}}</span>' +
						'<p ng-if="row.entity.mapDesArtPro[col.displayName].valorDescuentoParcial">' +
						'${{row.entity.mapDesArtPro[col.displayName].valorDescuentoParcial}}</p></div>'
					};
					model.griOptionsComparisonPriceArticles.columnDefs.splice(Number(position) + Number(index), 0, column);
				}

				if(open){
					column.visible = true;
				}else{
					column.visible = false;
				}		
			}
		}

		if(open){
			model.griOptionsComparisonPriceArticles.gridApi.grid.scrollTo(0,{name:'descripcionClasificacion'});
		}
	}

	uploadExcelPricesComparisson(model, fileExcel, promise){
		let fd = new FormData();
		fd.append('file', fileExcel);

		let data={
			codigoCompania: model.codigoCompania,
			codigoProveedor: model.codigoProveedor,
		};
		fd.append('data', angular.toJson(data));
		return this.catalogArticlesService.uploadExcelPricesComparisson(fd)
			.info((data, message)=>{
				model.resetFiltersSearch();
				if(data){
					model.filtersSearch.colCodigoBarras = data.filtrosBusquedaArticuloB2B.colCodigoBarras;
					model.paginationOptions.pageNumber = 1; 
					let message1 = this.successSearchPriceComparison(model, data);
					if(message1 !== null){
						message = message1;
					}

				}else{
					message = this._kMessageService.renderMessage('noArticlesToShow');
				}
				promise.resolve(message);
			})
			.error((message) => {
				promise.reject(message);
			});
	}

	successSearchPriceComparison(model, data){
		let message = null;
		model.mapBitacorasExcel = data.mapBitacorasExcel;
		if (data.colBitacoraArticuloProveedorTransient === null || data.colBitacoraArticuloProveedorTransient === undefined ) {
			model.griOptionsComparisonPriceArticles.data = [];
		} else {
			model.griOptionsComparisonPriceArticles.data = data.colBitacoraArticuloProveedorTransient;
			if (data.colBitacoraArticuloProveedorTransient !== null) {
				message = this.prepareDataComparissonPrices(model);
			}
		}
		model.griOptionsComparisonPriceArticles.totalItems = data.totalRegistros;
		if (data.totalRegistros === 0) {
			message = this._kMessageService.renderMessage('noArticlesToShow');
		}

		if(data.colTipoDescuento !== null && data.colTipoDescuento !== undefined){
			model.discountList = data.colTipoDescuento;
		}
		return message;
	}

}

export default CatalogArticlesComparissonPricesFactory;
