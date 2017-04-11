class CatalogArticlesFactory {

	constructor(catalogArticlesService, kConstantFactory, actionsLayout, kMessageService, catalogArticlesComparissonPricesFactory, $interval,
		$timeout) {
		'ngInject';
		this.catalogArticlesService = catalogArticlesService;
		this._layoutActions = actionsLayout;
		this._kMessageService = kMessageService;
		this.catalogArticlesComparissonPricesFactory = catalogArticlesComparissonPricesFactory;
		this.$interval = $interval;
		this.$timeout = $timeout;
		kConstantFactory.$getConstant('articles')
			.then((data) => {
				this._kConstantFactory = data;
			});
	}

	static instance(catalogArticlesService, kConstantFactory, actionsLayout, kMessageService, catalogArticlesComparissonPricesFactory, $interval,
		$timeout) {
		'ngInject';
		return new CatalogArticlesFactory(catalogArticlesService, kConstantFactory, actionsLayout, kMessageService,
			catalogArticlesComparissonPricesFactory, $interval, $timeout);
	}

	getURlParameters($stateParams, model) {
		model.codigoCompania = $stateParams.pCodComp;
		model.codigoProveedor = $stateParams.pCodProv;
		model.codigoSistema = $stateParams.pCodSist;
		model.urlInicio = $stateParams.pUrlRet;
		model.userId = $stateParams.pUserId;
		model.userName = $stateParams.pUserName;
		model.origenImportado = $stateParams.pEsImportado;
		model.nombreProveedor = $stateParams.pNomProv;
		model.codigoJDEProveedor = $stateParams.pCodJDEProv;
		model.messageCPDate = $stateParams.pMensaje;
	}

	/**
	 * Search the user Rols needed in Articles administration
	 */
	searchUserRols(model, promise1) {
		let params = {
			userId: model.userId
		};
		return this.catalogArticlesService.searchUserRol(params)
			.success((data)=> {
				model.userRols = data;
				//model.userRols.push('ROLFORSYNC669');

				this.searchReportOption(model);

				promise1.resolve(data);
			})
			.error((message) => {
				promise1.reject(message);
			});
	}

	/**
	 * Search report option needed in filters side bar for search articles to define
	 * if Articles administration o price comparison was going to render
	 */
	searchReportOption(model) {
		let articleAdminRol = false;
		let priceComparatorRol = false;
		for (let index in model.userRols) {
			if (model.userRols[index]) {
				let rol = model.userRols[index];
				if (rol === this._kConstantFactory.ROL_USER_ADMIN_ARTICULOS) {
					articleAdminRol = true;
				}
				if (rol === this._kConstantFactory.ROL_USER_COMPARACION_PRECIO) {
					priceComparatorRol = true;
				}
			}
		}

		if (articleAdminRol && priceComparatorRol) {
			model.reportOptionRol = this._kConstantFactory.ROL_USER_ADMIN_ARTICULOS;
		}

		if (!articleAdminRol) {
			model.reportOptionRol = this._kConstantFactory.ROL_USER_COMPARACION_PRECIO;
		}

		if (!priceComparatorRol) {
			model.reportOptionRol = this._kConstantFactory.ROL_USER_ADMIN_ARTICULOS;
		}
	}

	/**
	 * Search filters articles Classification
	 */
	searchClassificationFilters(model, promise1) {
		let params = {
			codigoCompania: model.codigoCompania,
			codigoProveedor: model.codigoProveedor
		};
		return this.catalogArticlesService.searchClassificationFilters(params)
			.success((data)=> {
				promise1.resolve(data);
			})
			.error((message) => {
				promise1.reject(message);
			});
	}

	/**
	 * Search classification Id
	 */
	classificationIdList(model){
		let classificationIdList = [];
		let classificationsList = model.classificationsSelectedList;
		if (classificationsList.length > 0) {
			for (let index in classificationsList) {
				if (classificationsList[index]) {
					classificationIdList.push(classificationsList[index].codigoClasificacion);
				}
			}
		}
		return classificationIdList;
	}

	/**
	 * Search articles
	 */
	searchArticles(model, promise1, countAgainFlag) {
		let classificationIdList = this.classificationIdList(model);

		model.filtersSearch.listaClasificaciones = classificationIdList;
		model.filtersSearch.numeroPagina = model.paginationOptions.pageNumber;
		model.filtersSearch.codigoCompania = model.codigoCompania;
		model.filtersSearch.codigoProveedor = model.codigoProveedor;

		if (model.reportOptionRol === this._kConstantFactory.ROL_USER_COMPARACION_PRECIO) {

			if(model.isOpenDiscount){
				this.catalogArticlesComparissonPricesFactory.manageDiscountColumns(model, false);
			}

			let params = {
				filtrosBusquedaArticuloB2B: model.filtersSearch,
				totalRegistros: model.griOptionsComparisonPriceArticles.totalItems,
				countAgain: countAgainFlag
			};
			return this.catalogArticlesService.searchComparisonPricesArticles(params)
				.success((data)=> {
					promise1.resolve(this.catalogArticlesComparissonPricesFactory.successSearchPriceComparison(model, data));
				})
				.error((message) => {
					promise1.reject(message);
				});
		} else {
			if (model.filtersSearch.mostrarCaducados === null) {
				model.filtersSearch.mostrarCaducados = false;
			}

			if (model.filtersSearch.exigeRegSanitario === '') {
				model.filtersSearch.exigeRegSanitario = null;
			}

			let params = {
				filtrosBusquedaArticuloB2B: model.filtersSearch,
				totalRegistros: model.gridOptionsArticles.totalItems,
				countAgain: countAgainFlag
			};
			return this.catalogArticlesService.searchArticles(params)
				.success((data)=> {
					promise1.resolve(this.successSearchArticlesAdm(model, data));
				})
				.error((message) => {
					promise1.reject(message);
				});
		}
	}

	successSearchArticlesAdm(model, data){
		model.discountList = [];
		let message = null;
		if (data.colArticuloProveedor === null) {
			model.gridOptionsArticles.data = [];
		} else {
			model.gridOptionsArticles.data = data.colArticuloProveedor;
		}

		model.gridOptionsArticles.totalItems = data.totalRegistros;
		if (data.totalRegistros === 0) {
			message = this._kMessageService.renderMessage('noArticlesToShow');
		}
		return message;
	}

	/**
	 * unselect all grid rows including parent rows
	 */
	unSelectAllGridRows(rows) {
		let parents = [];
		for (let i in rows) {
			if (rows[i]) {
				if (rows[i].row) {
					rows[i].row.isSelected = false;
				} else {
					rows[i].isSelected = false;
				}
				parents.push(rows[i].treeNode.parentRow);
			}
		}
		return parents;
	}

	/**
	 * select grid rows
	 */
	selectGridRows(rows, gridOptions) {
		for (let i in rows) {
			if (rows[i]) {
				gridOptions.gridApi.selection.selectRow(rows[i].entity);
				let parentRow = rows[i].treeNode.parentRow;

				//Falta
				//if(parentRow.isSelected){
					//gridOptions.gridApi.selection.selectRow(parentRow.entity);
					//parentRow.grid.api.selection.selectRow(parentRow.entity);
					//parentRow.grid.api.selection.selectRow(gridOptions.gridApi.grid.renderContainers.body.visibleRowCache[0]);
				//}

				if (parentRow.treeNode.state === 'expanded') {

					let listParents = gridOptions.gridApi.grid.renderContainers.body.visibleRowCache;
					for(let iParent in listParents){
						if(listParents[iParent]){
							if(listParents[iParent].treeNode.aggregations[0].groupVal === parentRow.treeNode.aggregations[0].groupVal){
								gridOptions.gridApi.treeBase.expandRow(
									gridOptions.gridApi.grid.renderContainers.body.visibleRowCache[iParent]);
								break;
							}
						}
					}
				}
			}
		}
	}

	/**
	 * Search articles fields details to edit page
	 */
	searchArticleFieldsDetails(model, promise1) {
		let consultGeneralData = true;
		if (model.fieldsMap[this.returnSearchCriteryBySectionId(model.optionSelected.id)]) {
			consultGeneralData = false;
		}
		let params = {
			codigoCompania: model.articleToEdit['@id'].codigoCompania,
			codigoProveedor: model.codigoProveedor,
			codigoArticulo: model.articleToEdit['@id'].codigoArticulo,
			idSeccion: model.optionSelected.id,
			consultar: consultGeneralData
		};
		return this.catalogArticlesService.searchArticleFieldsDetails(params)
			.success((data)=> {
				model.codigoComprador = data.codigoComprador;
				if (data.renderedMap) {
					model.dinamicFeatures = data.renderedMap;
					this.decideRequiredSanReg(model);
				}
				if (model.fieldsMap.size === 0) {
					model.fieldsMap = data.mapCamposArticulos;
				} else {
					for (let key in data.mapCamposArticulos) {
						if (data.mapCamposArticulos[key]) {
							model.fieldsMap[key] = data.mapCamposArticulos[key];
						}
					}
				}
				this.discountLists(model);
				this.regSanInit(model);
				this.characteristicsListOrder(model);
				promise1.resolve(model.fieldsMap);
			})
			.error((message) => {
				promise1.reject(message);
			});
	}

	discountLists(model){
		if (model.optionSelected.id === this._kConstantFactory.ID_SECCION_DATOS_BASICOS) {
			model.discountList = [];
			model.discountUMList = [];

			let discounts = model.fieldsMap[this._kConstantFactory.TAG_DESCUESTOS].valorActual;

			for(let index in discounts){
				if(discounts[index]){
					let discount = discounts[index];
					if(discount.asignacionTipoDescuento.tipoDescuento['@id'].codigoTipoDescuento !==
						this._kConstantFactory.COD_TIPO_DESC_DOCDE){
						model.discountList.push(discount);
					}else{
						model.discountUMList.push(discount);
					}
				}
			}
		}
	}

	regSanInit(model) {
		if (model.optionSelected.id === this._kConstantFactory.ID_SECCION_REG_SANITARIO && 
			model.fieldsMap[this._kConstantFactory.TAG_APLICA_REG_SAN].valorActual === this._kConstantFactory.VALOR_APLICA_REGISTRO_SANITARIO ) {
			
			model.selectedSanitaryRegister = 0;
			if (model.fieldsMap[this._kConstantFactory.TAG_REG_SAN].valorActual &&
				model.fieldsMap[this._kConstantFactory.TAG_REG_SAN].valorActual.length > 0) {
				let sanitaryRegId = model.fieldsMap[this._kConstantFactory.TAG_REG_SAN].valorActual[0];
				if(sanitaryRegId === '0' || sanitaryRegId === 0 &&
					model.fieldsMap[this._kConstantFactory.TAG_REG_SAN].valorActual.length > 1){
					model.selectedSanitaryRegister = model.fieldsMap[this._kConstantFactory.TAG_REG_SAN].valorActual[1];
				}else{
					model.selectedSanitaryRegister = sanitaryRegId;
				}
			}
		}
	}

	decideRequiredSanReg(model) {
		model.requiredSanReg = false;
		if (model.dinamicFeatures[this._kConstantFactory.CARACT_VALIDACION_REG_SAN] && model.origenImportado === '1') {
			model.requiredSanReg = true;
		}
	}

	characteristicsListOrder(model){
		if (model.optionSelected.id === this._kConstantFactory.ID_SECCION_DATOS_MERCANCIAS) {
			let characteristicsListActual = model.fieldsMap[this._kConstantFactory.TAG_CARACTERISTICAS].valorActual;
			let characteristicsListNuevo = model.fieldsMap[this._kConstantFactory.TAG_CARACTERISTICAS].valorNuevo;
			for(var index in characteristicsListNuevo){
				if(characteristicsListNuevo[index]){
					characteristicsListNuevo[index].orden = Number(index) + 1;
					characteristicsListActual[index].orden = Number(index) + 1;
				}
			}
			 
		}
	}

	/**
	 * Search articles image by image type
	 */
	searchArticleImage(model, promise1, article, tipoImagen) {
		let params = {
			codigoCompania: model.codigoCompania,
			codigoArticulo: article['@id'].codigoArticulo,
			tipoImagenArticulo: tipoImagen,
		};
		return this.catalogArticlesService.searchArticleImage(params)
			.info((data, message)=> {
				if (data.byteLength === 0) {
					promise1.resolve(message);
				} else {
					let fileName = message;
					this.createFileToDownload(data, fileName);
					promise1.resolve(null);
				}
			})
			.error((message) => {
				promise1.reject(message);
			});
	}

	/**
	 * Search articles image by image type
	 */
	downloadExcel(model, promise1, isTemplate, discount){
		let params;
		let isArticleAdminOption = false;
		let totalRegistros;
		if(model.reportOptionRol === this._kConstantFactory.ROL_USER_ADMIN_ARTICULOS){
			isArticleAdminOption = true;
			totalRegistros = 0;
		}else{
			totalRegistros = model.griOptionsComparisonPriceArticles.data.length;
		}

		if(isTemplate){
			params	= {
				filtrosBusquedaArticuloB2B: null,
				totalRegistros: 0,
				esAdminArticulos: isArticleAdminOption
			};
		}else{
			model.filtersSearch.listaClasificaciones = this.classificationIdList(model);
			model.filtersSearch.numeroPagina = model.paginationOptions.pageNumber;
			model.filtersSearch.codigoCompania = model.codigoCompania;
			model.filtersSearch.codigoProveedor = model.codigoProveedor;

			if(model.filtersSearch.mostrarCaducados === null){
				model.filtersSearch.mostrarCaducados = false;
			}

			params = {
				filtrosBusquedaArticuloB2B: model.filtersSearch,
				countAgain: false,
				totalRegistros: totalRegistros,
				esAdminArticulos: isArticleAdminOption,
				descargarConDescuentos: discount
			};
		}

		return this.catalogArticlesService.downloadExcel(params)
			.info((data, message)=>{
				if(data.byteLength === 0){
					promise1.resolve(message);
				}else{
					let fileName = message;
					this.createFileToDownload(data, fileName);
					promise1.resolve(null);
				}
			})
			.error((message) => {
				promise1.reject(message);
			});
	}

	uploadExcelSearch(model, fileExcel, promise){
		let fd = new FormData();
		fd.append('file', fileExcel);
		let data={
			codigoCompania: model.codigoCompania,
			codigoProveedor: model.codigoProveedor,
		};
		fd.append('data', angular.toJson(data));
		return this.catalogArticlesService.uploadExcelSearch(fd)
			.info((data, message)=>{
				model.resetFiltersSearch();
				if(data){
					model.filtersSearch.colCodigoBarras = data.filtrosBusquedaArticuloB2B.colCodigoBarras;

					let message1 = this.successSearchArticlesAdm(model, data);
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

	uploadExcelUpdate(model, fileExcel, listCatArticles, promise){
		let fd = new FormData();
		fd.append('file', fileExcel);
		let data={
			codigoCompania: model.codigoCompania,
			codigoProveedor: model.codigoProveedor,
			userId: model.userId,
			listCatalogo: this.obtenerListaCatalogos(listCatArticles)
		};
		fd.append('data', angular.toJson(data));
		return this.catalogArticlesService.uploadExcelUpdate(fd)
			.info((data, message)=>{
				model.resetFiltersSearch();
				if(data){
					model.idTarProActualizarArticulos = data.idTarProActualizarArticulos;
					model.filtersSearch.colCodigoBarras = data.filtrosBusquedaArticuloB2B.colCodigoBarras;
					this.successSearchArticlesAdm(model, data);
				}

				this.progressUpdateInterval(model);
				promise.resolve(message);
			
			})
			.error((message) => {
				promise.reject(message);
			});
	}

	progressUpdateInterval(model){
		model.showUploadButton = false;
		model.intervalUpdate = this.$interval(() => {
			this.progressUpdate(model)
			}, 5000, 0);
	}

	progressUpdate(model){
		console.log("progess update method");
		let params = {
			idTarea: model.idTarProActualizarArticulos
		};
		return this.catalogArticlesService.progressUpdate(params)
			.success((data)=>{
				if(data === false){
					this.$interval.cancel(model.intervalUpdate);
					this._kMessageService.showInfo(this._kMessageService.renderMessage('successMassiveUpdate'));

					this.$timeout(() => {
						model.showUploadButton = true;
					}, 500);
					
				}else if(data !== null){
					console.log("progess update continua");
				}
			})
			.error((message) => {
				console.log(message);
			});
	}


	obtenerListaCatalogos(listCatArticles){
		let lista = [];

		for(let index in listCatArticles){
			if(listCatArticles[index]){
				let obj = {
					codigoCatalogoCamposArticulo : listCatArticles[index]['@id'].codigoCatalogoCamposArticulo,
					nombreDTO: listCatArticles[index].nombreDTO,
					atributoDTO: listCatArticles[index].atributoDTO
				};
				lista.push(obj);
			}
		}

		return JSON.stringify(lista);
	}

	/**
	 * create file to download
	 */
	createFileToDownload(fileData, fileName) {
		let file = new Blob([fileData], {
			type: 'application/octet-stream',
			name: fileName
		});
		let fileURL = window.URL.createObjectURL(file);

		////accedemos al boton descargar y le asignamos propiedades
		let link = document.createElement('a');
		link.href = fileURL;
		link.download = fileName;
		link.click();
		link.href = '#';
	}

	/**
	 * search for label to show when the value is a code of a Value Catalog
	 */
	searchFieldLabelOnList(field) {
		if (field) {
			let lista = field.listSelectItemTrasient;
			for (let index in lista) {
				if(lista[index]){
					if (lista[index].value === field.valorActual) {
						field.valorNuevo = lista[index];
						return lista[index].label;
					}
					if (field.valorActual === this._kConstantFactory.CATALOGO_CODIGO_NO_APLICA +'/'+
						this._kConstantFactory.CATALOGO_VALOR_NO_APLICA) {
						field.valorNuevo = undefined;
						//return '-';
						return this._kConstantFactory.CAMPO_VALUE_NO_DISPONIBLE;
					}
				}
			}
		}
		//return '-';
		return this._kConstantFactory.CAMPO_VALUE_NO_DISPONIBLE;
	}

	/**
	 * search for label to show in value demand tooltip
	 */
	searchLabelDemandValue(field) {

		if(field.valorSolicitado === 'false' || 
			(field.pathObject === this._kConstantFactory.TAG_SEMAFORO && field.valorSolicitado === '0')){
			return 'No';
		}

		if(field.valorSolicitado === 'true' || 
			(field.pathObject === this._kConstantFactory.TAG_SEMAFORO && field.valorSolicitado === '1')){
			return 'Si';
		}

		if(field.listSelectItemTrasient !== undefined && field.listSelectItemTrasient.length > 0){
			let lista = field.listSelectItemTrasient;
			for (let index in lista) {
				if (lista[index].value === field.valorSolicitado) {
					return lista[index].label;
				}
			}
		}

		if(field.valorSolicitado === this._kConstantFactory.CAMPO_VALUE_NINGUNO){
			return this._kMessageService.renderMessage('deleteValue');
		}
		// return '-';

		if(field.valorSolicitado !== null && field.valorSolicitado !== undefined){
			return field.valorSolicitado;
		}
		return this._kConstantFactory.CAMPO_VALUE_NO_DISPONIBLE;
	}

	/**
	 * save the edit field in a new Map
	 */
	changeValueEvent(field, tag, model) {
		if (model.mapValueChange.size > 0 && model.mapValueChange.get(tag)) {
			let fieldChanged = model.mapValueChange.get(tag);
			let flag = true;

			if (tag === this._kConstantFactory.TAG_UNIDAD_MEDIDA || tag === this._kConstantFactory.TAG_PAISES) {
				flag = false;
				if (fieldChanged.valorNuevo === undefined || fieldChanged.valorNuevo.value === fieldChanged.valorActual) {
					model.mapValueChange.delete(tag);
				}
			}

			if (tag === this._kConstantFactory.TAG_DEDUCIBLE) {
				flag = false;
				if(fieldChanged.valorActual === this._kConstantFactory.CAMPO_VALUE_NINGUNO &&
					fieldChanged.valorNuevo === this._kConstantFactory.CAMPO_VALUE_NINGUNO ||
					fieldChanged.valorNuevo === null){
					model.mapValueChange.delete(tag);
				}
				if (fieldChanged.valorNuevo.value && fieldChanged.valorNuevo.value === fieldChanged.valorActual) {
					model.mapValueChange.delete(tag);
				}
			}

			if(tag === this._kConstantFactory.TAG_UNIDAD_MANEJO){
				flag = false;
				if(fieldChanged.valorNuevo[0].articuloUnidadManejoDTO.valorUnidadManejo ===
					fieldChanged.valorActual[0].articuloUnidadManejoDTO.valorUnidadManejo){
					model.mapValueChange.delete(tag);
				}
			}

			if(tag === this._kConstantFactory.TAG_DATOS_GARANTIA){
				flag = false;
				if(fieldChanged.valorActual &&
					fieldChanged.valorNuevo.estadoGarantia === fieldChanged.valorActual.estadoGarantia &&
					fieldChanged.valorNuevo.tieMaxGarNor === fieldChanged.valorActual.tieMaxGarNor ){
					model.mapValueChange.delete(tag);
				}
			}

			if (field.codigoCatalogoCamposArticuloPadre && flag) {
				flag = false;
				if (fieldChanged.valorNuevo[model.selectedSanitaryRegister] ===
					fieldChanged.valorActual[model.selectedSanitaryRegister]) {
					model.mapValueChange.delete(tag);
				}
			}
			//No se puede cambiar este igual por tres iguales
			if (flag && fieldChanged.valorNuevo == fieldChanged.valorActual) {
				model.mapValueChange.delete(tag);
			}

		} else {
			model.mapValueChange.set(tag, field);
		}
	}

	/**
	 * save the edit article data
	 */
	saveArticlesData(model, promise) {
		let fieldArticlesList = [];
		let flagShowUMmessage = false;
		let flagShowSuccesMessage = false;
		//let fieldSanReg = null;

		let map = model.mapValueChange;
		map.forEach((value, key) => {
			let valorNuevo = value.valorNuevo;
			let valorActual = value.valorActual;
			let codigoObjeto = value.codigoObjetoRelacion;

			if (!value.valorNuevo || value.valorNuevo.value === undefined) {
				valorNuevo = value.valorNuevo;
			} else {
				valorNuevo = value.valorNuevo.value;
			}

			// if (valorNuevo === null && key === this._kConstantFactory.TAG_COMPUESTO_TRANSG) {
			// 	valorNuevo = this._kConstantFactory.CAMPO_VALUE_NINGUNO;
			// }

			//sanitary register case
			if (value.codigoCatalogoCamposArticuloPadre &&
				model.optionSelected.id === this._kConstantFactory.ID_SECCION_REG_SANITARIO) {
				codigoObjeto = model.selectedSanitaryRegister;
				valorNuevo = value.valorNuevo[model.selectedSanitaryRegister];
				valorActual = value.valorActual[model.selectedSanitaryRegister];
			}

			if (key === this._kConstantFactory.TAG_UNIDAD_MANEJO) {
				valorNuevo = valorNuevo[0].articuloUnidadManejoDTO.valorUnidadManejo;
				valorActual = valorActual[0].articuloUnidadManejoDTO.valorUnidadManejo;
				flagShowUMmessage = true;
			}

			// if ((key === this._kConstantFactory.TAG_DEDUCIBLE || 
			// 	key === this._kConstantFactory.TAG_COMPUESTO_TRANSG || 
			// 	key === this._kConstantFactory.TAG_FECHA_EMISION_REG_SAN) 
			// 	&& valorNuevo === null) {
			// 	valorNuevo = this._kConstantFactory.CAMPO_VALUE_NINGUNO;
			// }

			if (valorNuevo === null || valorNuevo === '') {
				valorNuevo = this._kConstantFactory.CAMPO_VALUE_NINGUNO;
			}

			if (key === this._kConstantFactory.TAG_CARACTERISTICAS){
				let valorNuevoTemp = this.getFieldNewValueCharacteristics(valorActual, valorNuevo);
				valorActual = JSON.stringify(valorActual);
				valorNuevo = JSON.stringify(valorNuevoTemp);
			}

			if (key === this._kConstantFactory.TAG_DATOS_GARANTIA){
				if(valorActual){
					valorActual = JSON.stringify(valorActual);
				}
				valorNuevo = JSON.stringify(valorNuevo);
			}

			let field = {
				campo: value.campo,
				codigoCatalogoCamposArticulo: value.codigoCatalogoCamposArticulo,
				codigoCatalogoCamposArticuloPadre: value.codigoCatalogoCamposArticuloPadre,
				codigoCatalogoSeccion: model.optionSelected.id,
				estadoCampo: value.estadoCampo,
				nivelAcceso: value.nivelAcceso,
				valorActual: valorActual,
				valorNuevo: valorNuevo,
				pathObject: key,
				nombreDTO: value.nombreDTO,
				codigoObjetoRelacion: codigoObjeto
			};
			fieldArticlesList.push(field);

			if(key === this._kConstantFactory.TAG_COMPUESTO_TRANSG && valorNuevo !== this._kConstantFactory.ESTADO_INACTIVO){
				this.addTransgenicImageField(model, fieldArticlesList);
			}
			
		});

		if(fieldArticlesList.length > 1){
			flagShowSuccesMessage = true;
		}

		let descripcionArticulo = model.fieldsMap[this._kConstantFactory.TAG_DESCRICION_ART].valorActual;
		let params = {
			codigoCompania: model.codigoCompania,
			codigoProveedor: model.codigoProveedor,
			codigoArticulo: model.articleToEdit['@id'].codigoArticulo,
			userId: model.userId,
			listaCamposArticulos: fieldArticlesList,
			codigoComprador: model.codigoComprador,
			nombreProveedor: model.nombreProveedor,
			userCompleteName: model.userName,
			descripcionArticulo: descripcionArticulo,
			codigoJDEProveedor: model.codigoJDEProveedor
		};
		return this.catalogArticlesService.saveArticlesData(params)
			.success((data)=> {
				this.resetEditValues(model);

				let message = this._kMessageService.renderMessage('successSave');

				if(flagShowUMmessage){
					let messageUM = this._kMessageService.renderMessage('successUMSave');
					if(flagShowSuccesMessage){
						message = messageUM + '<br>' + message;
					}else{
						message = messageUM;	
					}
				}	

				promise.resolve(message);
			})
			.error((message) => {
				promise.reject(message);
			});
	}

	addTransgenicImageField(model, fieldArticlesList){
		let transgenicImg = model.fieldsMap[this._kConstantFactory.TAG_IMGAGEN_TANSG];
		if (transgenicImg && transgenicImg.valorActual && transgenicImg.valorActual.codigoArchivo) {

			let valorActual = {
				nombreArchivo: transgenicImg.valorActual.nombreArchivo,
				codigoArchivo: transgenicImg.valorActual.codigoArchivo,
				tipoContenidoArchivo: transgenicImg.valorActual.tipoContenidoArchivo,
				valorTipoArchivo: this._kConstantFactory.TIPO_IMAGEN_DOC_JUSTIFICACION_NO_TRANSG
			};
			let valorNuevo = {
				nombreArchivo: transgenicImg.valorActual.nombreArchivo,
				codigoArchivo: transgenicImg.valorActual.codigoArchivo,
				estadoArchivo: this._kConstantFactory.ESTADO_INACTIVO,
				tipoContenidoArchivo: transgenicImg.valorActual.tipoContenidoArchivo,
				valorTipoArchivo: this._kConstantFactory.TIPO_IMAGEN_DOC_JUSTIFICACION_NO_TRANSG
			};

			let field = {
				campo: transgenicImg.campo,
				codigoCatalogoCamposArticulo: transgenicImg.codigoCatalogoCamposArticulo,
				codigoCatalogoCamposArticuloPadre: transgenicImg.codigoCatalogoCamposArticuloPadre,
				codigoCatalogoSeccion: model.optionSelected.id,
				estadoCampo: transgenicImg.estadoCampo,
				nivelAcceso: transgenicImg.nivelAcceso,
				valorActual: valorActual,
				valorNuevo: valorNuevo,
				pathObject: this._kConstantFactory.TAG_IMGAGEN_TANSG,
				nombreDTO: transgenicImg.nombreDTO,
				codigoObjetoRelacion: transgenicImg.valorActual.codigoArchivo
			};
			fieldArticlesList.push(field);
		}
	}

	getFieldNewValueCharacteristics(valorActual, valorNuevo){
		let valorNuevoSend = JSON.parse(JSON.stringify(valorNuevo));

		for(let index in valorActual){
			if(valorActual[index]){
				let characteristicActual = valorActual[index];

				if(characteristicActual.status === this._kConstantFactory.ESTADO_INACT_LITERAL){
					valorNuevoSend.push(JSON.parse(JSON.stringify(characteristicActual)));
					characteristicActual.status = this._kConstantFactory.ESTADO_ACT_LITERAL;
				}else{
					for(let jindex in valorNuevoSend){
						if(valorActual[jindex]) {
							let characteristicNueva = valorNuevoSend[jindex];

							if(characteristicNueva.secuencialCaracteristica === characteristicActual.secuencialCaracteristica){
								if(characteristicNueva.description !== characteristicActual.description ||
									characteristicNueva.orden !== characteristicActual.orden){
									characteristicNueva.status = 'MOD';
								}
								break;
							}

						}
					}
				}
			}
		}
		return valorNuevoSend;
	}

	/**
	 * reset values when edit is cancel
	 */
	resetEditValues(model) {
		//model.editArticle = false;
		let map = model.mapValueChange;
		map.forEach((value) => {
			if(value.valorActual !== undefined && value.valorActual !== null){
				value.valorNuevo = JSON.parse(JSON.stringify(value.valorActual));
			}else{
				value.valorNuevo = value.valorActual;
			}
			
			this.searchFieldLabelOnList(value);
		});

		model.mapValueChange = new Map();

		//lógica para el trabajo con las imagenes
		this.prepareImgForEditArticle(model);

		//Logica para el trabajo de la seccion Datos Mercancias
		this.resetValuesMerchandiseData(model);
	}

	resetValuesMerchandiseData(model) {
		if (model.optionSelected.id === this._kConstantFactory.ID_SECCION_DATOS_MERCANCIAS) {
			let fieldCaract = model.fieldsMap[this._kConstantFactory.TAG_CARACTERISTICAS];
			if(fieldCaract){
				if(fieldCaract.valorActual === undefined){
					fieldCaract.valorNuevo = undefined;
				}else{
					for(var index in fieldCaract.valorActual){
						if(fieldCaract.valorActual[index] &&
							fieldCaract.valorActual[index].status === this._kConstantFactory.ESTADO_INACT_LITERAL){
							fieldCaract.valorActual[index].status = this._kConstantFactory.ESTADO_ACT_LITERAL;
						}
					}
					fieldCaract.valorNuevo = JSON.parse(JSON.stringify(fieldCaract.valorActual));
				}
			}
		}
	}

	lookingForChangesInCaractList(model) {
		if (model.optionSelected.id === this._kConstantFactory.ID_SECCION_DATOS_MERCANCIAS) {
			model.mapValueChange.delete(this._kConstantFactory.TAG_CARACTERISTICAS);

			let fieldCaract = model.fieldsMap[this._kConstantFactory.TAG_CARACTERISTICAS];
			let fieldCaractValorActual = model.fieldsMap[this._kConstantFactory.TAG_CARACTERISTICAS].valorActual;
			let fieldCaractValorNuevo = model.fieldsMap[this._kConstantFactory.TAG_CARACTERISTICAS].valorNuevo;

			if(fieldCaractValorActual === undefined){
				fieldCaractValorActual = [];
			}

			if(fieldCaractValorNuevo === undefined){
				fieldCaractValorNuevo = [];
			}

			if (fieldCaractValorActual.length !== fieldCaractValorNuevo.length) {
				model.mapValueChange.set(this._kConstantFactory.TAG_CARACTERISTICAS, fieldCaract);
			} else {
				if (fieldCaractValorNuevo.length > 0) {
					for (let index in fieldCaractValorNuevo) {
						if (fieldCaractValorNuevo[index]) {
							let characteristic = fieldCaractValorNuevo[index];
							if (characteristic.secuencialCaracteristica === null) {
								model.mapValueChange.set(this._kConstantFactory.TAG_CARACTERISTICAS, fieldCaract);
								break;
							} else {
								this.compareCharacteristics(model, fieldCaractValorActual, characteristic, fieldCaract);
							}
						}
					}
				}
			}
		}
	}

	compareCharacteristics(model, fieldCaractValorActual, characteristic, fieldCaract){
		for (let index in fieldCaractValorActual) {
			if (fieldCaractValorActual[index] &&
				fieldCaractValorActual[index].secuencialCaracteristica === characteristic.secuencialCaracteristica) {

				let valorActual = fieldCaractValorActual[index];
				if (characteristic.description !== valorActual.description ||
					characteristic.orden !== valorActual.orden ||
					characteristic.status !== valorActual.status) {
					model.mapValueChange.set(this._kConstantFactory.TAG_CARACTERISTICAS, fieldCaract);
					break;
				}
			}
		}
	}
	/**
	 * return search critery of each section
	 */
	returnSearchCriteryBySectionId(id) {
		switch (id) {
			//case this._kConstantFactory.ID_SECCION_DATOS_BASICOS:
			//	return this._kConstantFactory.CRITERIO_BUSQUEDA_SEC_DATOS_BASICOS;
			//case this._kConstantFactory.ID_SECCION_PROVEEDOR:
			//	return this._kConstantFactory.CRITERIO_BUSQUEDA_SEC_PROVEEDOR;
			//case this._kConstantFactory.ID_SECCION_COMPLEMENTARIOS:
			//	return this._kConstantFactory.CRITERIO_BUSQUEDA_SEC_COMPLEMENTARIOS;
			//case this._kConstantFactory.ID_SECCION_REG_SANITARIO:
			//	return this._kConstantFactory.CRITERIO_BUSQUEDA_SEC_REG_SAN;
		}
	}

	/**
	 * search article image by image id. It's used in image section
	 */
	searchImageById(field, model, promise) {
		let valorActual = field.valorActual;
		if(model.optionSelected.id === this._kConstantFactory.ID_SECCION_REG_SANITARIO){
			valorActual = field.valorActual[model.selectedSanitaryRegister];
		}

		let params = {
			codigoCompania: model.codigoCompania,
			codigoArchivo: valorActual.codigoArchivo
		};
		return this.catalogArticlesService.searchImageById(params)
			.success((data)=> {
				valorActual['image64'] = data;
				promise.resolve();
			})
			.error((message) => {
				promise.reject(message);
			});
	}

	/**
	 * Prepare images for edit
	 */
	prepareImgForEditArticle(model) {
		if(model.editArticle){
			if (model.optionSelected.id === this._kConstantFactory.ID_SECCION_IMAGENES) {
				this.fillImagesField(model.fieldsMap[this._kConstantFactory.TAG_IMAGEN_GENERAL]);
				this.fillImagesField(model.fieldsMap[this._kConstantFactory.TAG_IMAGEN_COD_BARRAS]);
			}
			if (model.optionSelected.id === this._kConstantFactory.ID_SECCION_COMPLEMENTARIOS) {
				this.fillImagesFieldTransgenic(model.fieldsMap[this._kConstantFactory.TAG_IMGAGEN_TANSG]);
			}
			if (model.optionSelected.id === this._kConstantFactory.ID_SECCION_REG_SANITARIO) {
				this.fillImagesSanReg(model.fieldsMap[this._kConstantFactory.TAG_IMAGEN_REG_SAN], model);
				this.fillImagesSanReg(model.fieldsMap[this._kConstantFactory.TAG_DOC_REG_SAN], model);
			}
		}
	}

	/**
	 * Fill images new value
	 */
	fillImagesField(img) {
		if (img && img.valorActual && img.valorActual.codigoArchivo) {
			let descripcion = null;
			if (img.valorNuevo && img.valorNuevo.descripcionArchivo) {
				descripcion = img.valorNuevo.descripcionArchivo;
			}
			img.valorNuevo = {
				name: img.valorActual.nombreArchivo,
				descripcionArchivo: descripcion ? descripcion : img.valorActual.descripcionArchivo,
				size: img.valorActual.tamanioArchivo,
				tipoContenidoArchivo: img.valorActual.tipoContenidoArchivo
			};
		} else {
			img.valorNuevo = undefined;
		}
	}

	/**
	 * Fill images new value
	 */
	fillImagesFieldTransgenic(img) {
		if (img && img.valorActual && img.valorActual.codigoArchivo && 
			img.valorActual.estadoArchivo === this._kConstantFactory.ESTADO_ACTVO) {

			let descripcion = null;
			if (img.valorNuevo && img.valorNuevo.descripcionArchivo) {
				descripcion = img.valorNuevo.descripcionArchivo;
			}

			img.valorNuevo = {
				name: img.valorActual.nombreArchivo,
				descripcionArchivo: descripcion ? descripcion : img.valorActual.descripcionArchivo,
				size: img.valorActual.tamanioArchivo,
				tipoContenidoArchivo: img.valorActual.tipoContenidoArchivo
			};
		} else {
			img.valorNuevo = undefined;
		}
	}

	/**
	 * Fill images new value
	 */
	fillImagesSanReg(img, model) {
		if (img && img.valorActual[model.selectedSanitaryRegister] && img.valorActual[model.selectedSanitaryRegister].codigoArchivo) {
			let descripcion = null;
			if (img.valorNuevo[model.selectedSanitaryRegister] && img.valorNuevo[model.selectedSanitaryRegister].descripcionArchivo) {
				descripcion = img.valorNuevo[model.selectedSanitaryRegister].descripcionArchivo;
			}
			img.valorNuevo[model.selectedSanitaryRegister] = {
				name: img.valorActual[model.selectedSanitaryRegister].nombreArchivo,
				descripcionArchivo: descripcion ? descripcion : img.valorActual[model.selectedSanitaryRegister].descripcionArchivo,
				size: img.valorActual[model.selectedSanitaryRegister].tamanioArchivo,
				tipoContenidoArchivo: img.valorActual[model.selectedSanitaryRegister].tipoContenidoArchivo
			};
		} else {
			img.valorNuevo[model.selectedSanitaryRegister] = undefined;
		}
	}

	/**
	 * Prepare sanitary register fields for edit
	 */
	prepareSanRegForEditArticle(model) {
		if(model.editArticle &&  
			model.fieldsMap[this._kConstantFactory.TAG_APLICA_REG_SAN].valorActual === this._kConstantFactory.VALOR_APLICA_REGISTRO_SANITARIO){

			if (model.fieldsMap[this._kConstantFactory.TAG_TIENE_REG_SAN].valorNuevo === undefined) {
				model.fieldsMap[this._kConstantFactory.TAG_TIENE_REG_SAN].valorNuevo = false;

				model.mapValueChange.set(this._kConstantFactory.TAG_TIENE_REG_SAN,
					model.fieldsMap[this._kConstantFactory.TAG_TIENE_REG_SAN]);
			}

			if(model.selectedSanitaryRegister === undefined){
				model.selectedSanitaryRegister = 0;
			}

			//Llenarr los campos Pais y tamaño del reg san con los datos del articulo
			if (model.fieldsMap[this._kConstantFactory.TAG_REG_SAN].valorActual.length === 1 &&
				model.fieldsMap[this._kConstantFactory.TAG_TIENE_REG_SAN].valorNuevo &&
				model.selectedSanitaryRegister === 0) {
				this.fillSanRegFields(model);
			}
		}
	}

	fillSanRegFields(model) {
		let codSanRegNew = 0;
		let fieldPais = model.fieldsMap[this._kConstantFactory.TAG_PAIS_REG_SAN];
		if (fieldPais.valorNuevo[codSanRegNew] === null) {
			let articleCountry = this.searchFieldLabelOnList(model.fieldsMap[this._kConstantFactory.TAG_PAISES]);
			if (articleCountry === this._kConstantFactory.CAMPO_VALUE_NO_DISPONIBLE) {
				fieldPais.valorNuevo[codSanRegNew] = null;
			} else {
				fieldPais.valorNuevo[codSanRegNew] = articleCountry;
				model.mapValueChange.set(this._kConstantFactory.TAG_PAIS_REG_SAN, fieldPais);
			}
		}

		let fieldTamano = model.fieldsMap[this._kConstantFactory.TAG_TAMANO_REG_SAN];
		if (fieldTamano.valorNuevo[codSanRegNew] === null) {
			let articleSize = model.fieldsMap[this._kConstantFactory.TAG_TAMANO].valorActual;
			if (articleSize !== null) {
				fieldTamano.valorNuevo[codSanRegNew] = articleSize;
				model.mapValueChange.set(this._kConstantFactory.TAG_TAMANO_REG_SAN, fieldTamano);
			}
		}
	}

	prepareProviderDataForEditArticle(model) {
		let fieldUniManejo = model.fieldsMap[this._kConstantFactory.TAG_UNIDAD_MANEJO];
		if (fieldUniManejo) {
			let lista = fieldUniManejo.listSelectItemTrasient;
			for (let index in lista) {
				if (lista[index].value === fieldUniManejo.valorActual[0].valorTipoUnidadEmpaque) {
					fieldUniManejo.valorNuevo[0].valorTipoUnidadEmpaque = lista[index];
				}
			}
		}
	}

	lookingForChangesInImagesSection(model) {
		if (model.optionSelected.id === this._kConstantFactory.ID_SECCION_IMAGENES) {
			model.mapValueChange = new Map();
			this.lookingForChangesInImagesAux(this._kConstantFactory.TAG_IMAGEN_GENERAL, model);
			this.lookingForChangesInImagesAux(this._kConstantFactory.TAG_IMAGEN_COD_BARRAS, model);
		}

		if (model.optionSelected.id === this._kConstantFactory.ID_SECCION_COMPLEMENTARIOS) {
			model.mapValueChange.delete(this._kConstantFactory.TAG_IMGAGEN_TANSG);
			this.lookingForChangesInImagesAux(this._kConstantFactory.TAG_IMGAGEN_TANSG, model);
		}

		if (model.optionSelected.id === this._kConstantFactory.ID_SECCION_REG_SANITARIO) {
			model.mapValueChange.delete(this._kConstantFactory.TAG_IMAGEN_REG_SAN);
			model.mapValueChange.delete(this._kConstantFactory.TAG_DOC_REG_SAN);
			this.lookingForChangesInImagesSanRegAux(this._kConstantFactory.TAG_IMAGEN_REG_SAN, model);
			this.lookingForChangesInImagesSanRegAux(this._kConstantFactory.TAG_DOC_REG_SAN, model);
		}
	}

	lookingForChangesInImagesAux(tag, model) {
		let field = model.fieldsMap[tag];
		if (field.valorNuevo instanceof File) {
			model.mapValueChange.set(tag, field);
		} else {
			if (field.valorNuevo &&
				field.valorActual.descripcionArchivo !== field.valorNuevo.descripcionArchivo &&
				field.valorActual.codigoArchivo) {
				model.mapValueChange.set(tag, field);
			}
		}
	}

	lookingForChangesInImagesSanRegAux(tag, model) {
		let field = model.fieldsMap[tag];
		if (field.valorNuevo[model.selectedSanitaryRegister] instanceof File) {
			model.mapValueChange.set(tag, field);
		}
	}

	prepareArticlesImage(field, promise, tipoImagen, key, model) {
		let valorNuevo;

		let valorNuevoField = field.valorNuevo;
		let valorActualField = field.valorActual;
		let codigoRegSan = null;

		if(model.optionSelected.id === this._kConstantFactory.ID_SECCION_REG_SANITARIO){
			valorNuevoField = valorNuevoField[model.selectedSanitaryRegister];
			valorActualField = valorActualField[model.selectedSanitaryRegister];
			codigoRegSan = model.selectedSanitaryRegister;
		}

		if (valorNuevoField instanceof File) {
			let descripcionArchivo = valorNuevoField.descripcionArchivo;
			if (descripcionArchivo !== undefined) {
				delete(valorNuevoField.descripcionArchivo);
			}

			let reader = new FileReader();
			reader.onload = (() => {
				let completeContent = reader.result;
				//let refractorContent = completeContent.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
				let refractorContent = completeContent.replace(/^data.*base64,/, '');

				valorNuevo = {
					codigoArchivo: valorActualField ? valorActualField.codigoArchivo : null,
					nombreArchivo: valorNuevoField.name,
					descripcionArchivo: descripcionArchivo,
					tamanioArchivo: valorNuevoField.size,
					valorTipoArchivo: tipoImagen,
					tipoContenidoArchivo: valorNuevoField.type,
					contenidoArchivo: refractorContent,
					codigoRegistroSanitarioArticulo: codigoRegSan,
					key: key,
					estadoArchivo: this._kConstantFactory.ESTADO_ACTVO
				};
				promise.resolve(valorNuevo);
			});
			reader.readAsDataURL(valorNuevoField);
		} else {
			//Hubo cambio en la descripcion
			valorNuevo = {
				codigoArchivo: valorActualField.codigoArchivo,
				descripcionArchivo: valorNuevoField.descripcionArchivo,
				tamanioArchivo: valorNuevoField.size,
				nombreArchivo: valorNuevoField.name,
				valorTipoArchivo: tipoImagen,
				key: key
			};
			promise.resolve(valorNuevo);
		}
	}

	checkImageExtension(img){
		if(img){
			let tipoContenidoArchivo;
			if(img instanceof File){
				tipoContenidoArchivo = img.type;
			}else{
				tipoContenidoArchivo = img.tipoContenidoArchivo;
			}
			if(tipoContenidoArchivo){
				let extension = tipoContenidoArchivo.split('/')[0];
				if(extension === 'image'){
					return true;
				}
			}
		}
		return false;
	}

	validateDataOfArticles(model) {
		let mensaje = null;

		//Basic data Section validations
		if (model.optionSelected.id === this._kConstantFactory.ID_SECCION_DATOS_BASICOS) {
			mensaje = this.validateBasicDataOption(model);
			if (mensaje !== null) {
				return mensaje;
			}
		}

		//Provider Section validations
		if (model.optionSelected.id === this._kConstantFactory.ID_SECCION_PROVEEDOR) {
			mensaje = this.validateProviderOption(model);
			if (mensaje !== null) {
				return mensaje;
			}
		}

		//Sanitary Register Section validations
		if (model.optionSelected.id === this._kConstantFactory.ID_SECCION_REG_SANITARIO) {
			mensaje = this.validateSanitaryRegister(model);
			if (mensaje !== null) {
				return mensaje;
			}
		}

		//Merchandise data Section validations
		if (model.optionSelected.id === this._kConstantFactory.ID_SECCION_DATOS_MERCANCIAS) {
			mensaje = this.validateMerchandiseRequired(model);
			if (mensaje !== null) {
				return mensaje;
			}
		}

		mensaje = this.validateOnDemandValue(model);
		return mensaje;
	}

	validateOnDemandValue(model) {
		let map = model.mapValueChange;
		let demandValueProblem = [];
		let mensaje = null;

		map.forEach((value, key) => {
			let field = value;
			if (field.valorSolicitado) {
				if (key === this._kConstantFactory.TAG_UNIDAD_MEDIDA || key === this._kConstantFactory.TAG_PAISES ||
					key === this._kConstantFactory.TAG_DEDUCIBLE || key === this._kConstantFactory.TAG_APLICA_REG_SAN) {

					if(key === this._kConstantFactory.TAG_DEDUCIBLE && field.valorNuevo === null){
						if(field.valorSolicitado === this._kConstantFactory.CAMPO_VALUE_NINGUNO){
							model.mapValueChange.delete(key);
							demandValueProblem.push(field.etiquetaCampo);
						}
					}
					if (field.valorNuevo && field.valorNuevo.value === field.valorSolicitado) {
						this.searchFieldLabelOnList(field);
						model.mapValueChange.delete(key);
						demandValueProblem.push(field.etiquetaCampo);
					}

				} else {
					////No se pueden poner los tres iguales en comparacion de valor nuevo y valor actual
					if (field.codigoCatalogoCamposArticuloPadre) {
						if ((field.valorSolicitado[model.selectedSanitaryRegister] !== null &&
							field.valorNuevo[model.selectedSanitaryRegister] === field.valorSolicitado[model.selectedSanitaryRegister]) ||
							(field.valorSolicitado[model.selectedSanitaryRegister] === this._kConstantFactory.CAMPO_VALUE_NINGUNO &&
							field.valorNuevo[model.selectedSanitaryRegister] == null)){

							field.valorNuevo[model.selectedSanitaryRegister] = field.valorActual[model.selectedSanitaryRegister];
							model.mapValueChange.delete(key);
							demandValueProblem.push(field.etiquetaCampo);
						}
					} else {

						if(key === this._kConstantFactory.TAG_DATOS_GARANTIA){
							let garantiaSolicitada = JSON.parse(field.valorSolicitado);

							if(field.valorNuevo.estadoGarantia === garantiaSolicitada.estadoGarantia &&
								field.valorNuevo.tieMaxGarNor === garantiaSolicitada.tieMaxGarNor ){
								model.mapValueChange.delete(key);
								demandValueProblem.push(field.etiquetaCampo);
							}
						}else{
							if (field.valorNuevo === field.valorSolicitado || 
								((field.valorNuevo == null || field.valorNuevo === '') && field.valorSolicitado === this._kConstantFactory.CAMPO_VALUE_NINGUNO)) {
								field.valorNuevo = field.valorActual;
								model.mapValueChange.delete(key);
								demandValueProblem.push(field.etiquetaCampo);
							}
						}
					}

				}
			}
		});

		if (demandValueProblem.length > 0 && demandValueProblem.length === 1) {
			mensaje = this._kMessageService.renderMessage('demandValueValidation', {etiquetaCampo: demandValueProblem[0]});
		}
		if (demandValueProblem.length > 1) {
			let fieldNames = '';
			for (let index in demandValueProblem) {
				if (demandValueProblem[index]) {
					fieldNames += demandValueProblem[index] + ', ';
				}
			}
			mensaje = this._kMessageService.renderMessage('demandValueValidationVarious', {etiquetaCampo: fieldNames});
		}
		return mensaje;
	}

	validateBasicDataOption(model){
		let requiredField = [];
		let mensaje = null;
		if(model.dinamicFeatures[this._kConstantFactory.CARACT_VALIDACION_TIENE_PRESENTACIONES]){
			this.validateRequiredSimpleField(this._kConstantFactory.TAG_CANTIDAD_MEDIDA, model, requiredField);
			this.validateRequiredSimpleField(this._kConstantFactory.TAG_UNIDAD_MEDIDA, model, requiredField);
			this.validateRequiredSimpleField(this._kConstantFactory.TAG_TAMANO, model, requiredField);
			this.validateRequiredSimpleField(this._kConstantFactory.TAG_PRESENTACION, model, requiredField);
		}
		this.validateRequiredSimpleField(this._kConstantFactory.TAG_PAISES, model, requiredField);

		mensaje = this.buildRequiredMessage(requiredField);
		return mensaje;
	}

	validateProviderOption(model){
		let requiredField = [];
		let mensaje = null;
		let mensajeUM = null;

		let fieldMapField = model.fieldsMap[this._kConstantFactory.TAG_UNIDAD_MANEJO];
		if(fieldMapField.valorNuevo && fieldMapField.valorNuevo.length > 0){
			if(fieldMapField.valorNuevo[0].articuloUnidadManejoDTO.valorUnidadManejo === null ||
				fieldMapField.valorNuevo[0].articuloUnidadManejoDTO.valorUnidadManejo === undefined){

				fieldMapField.valorNuevo[0].articuloUnidadManejoDTO.valorUnidadManejo =
					JSON.parse(JSON.stringify(fieldMapField.valorActual[0].articuloUnidadManejoDTO.valorUnidadManejo));
				
				model.mapValueChange.delete(this._kConstantFactory.TAG_UNIDAD_MANEJO);
				requiredField.push(this._kMessageService.renderMessage('nameUniManProv'));
			}else if (Number(fieldMapField.valorNuevo[0].articuloUnidadManejoDTO.valorUnidadManejo) === 0){
				
				fieldMapField.valorNuevo[0].articuloUnidadManejoDTO.valorUnidadManejo =
					JSON.parse(JSON.stringify(fieldMapField.valorActual[0].articuloUnidadManejoDTO.valorUnidadManejo));
				
				model.mapValueChange.delete(this._kConstantFactory.TAG_UNIDAD_MANEJO);
				mensajeUM = this._kMessageService.renderMessage('valueUniManProv'); 
			}
		}
		this.validateRequiredSimpleField(this._kConstantFactory.TAG_REFERENCIA_PROVEEDOR, model, requiredField);

		mensaje = this.buildRequiredMessage(requiredField);

		if(mensaje !== null && mensajeUM !== null){
			mensaje = mensaje +'<br>'+mensajeUM;
		}else{
			if(mensajeUM !== null){
				mensaje = mensajeUM;
			}
		}

		return mensaje;
	}

	validateSanitaryRegister(model) {
		let requiredField = [];
		let mensaje = null;
		let messageImgChange = null;

		let regSanApplies = model.fieldsMap[this._kConstantFactory.TAG_APLICA_REG_SAN];
		if (regSanApplies.valorActual === this._kConstantFactory.VALOR_APLICA_REGISTRO_SANITARIO) {
			let regSanHave = model.fieldsMap[this._kConstantFactory.TAG_TIENE_REG_SAN];

			if (regSanHave.valorNuevo) {
				this.validateRequiredChildField(this._kConstantFactory.TAG_NUM_REG_SAN, model, requiredField);
				this.validateRequiredChildField(this._kConstantFactory.TAG_FECHA_CADUCIDAD_REG_SAN, model, requiredField);

				if (model.requiredSanReg) {
					this.validateRequiredChildField(this._kConstantFactory.TAG_MARCA_REG_SAN, model, requiredField);
					this.validateRequiredChildField(this._kConstantFactory.TAG_FECHA_EMISION_REG_SAN, model, requiredField);
					this.validateRequiredChildField(this._kConstantFactory.TAG_PAIS_REG_SAN, model, requiredField);
					this.validateRequiredChildField(this._kConstantFactory.TAG_TAMANO_REG_SAN, model, requiredField);
					this.validateRequiredChildField(this._kConstantFactory.TAG_MATERIAL_ENVASE, model, requiredField);
				}

				if(model.selectedSanitaryRegister === 0){
					this.validateRequiredImageSanReg(this._kConstantFactory.TAG_DOC_REG_SAN, model, requiredField);
					this.validateRequiredImageSanReg(this._kConstantFactory.TAG_IMAGEN_REG_SAN, model, requiredField);
				}else{
					if(model.mapValueChange.get(this._kConstantFactory.TAG_NUM_REG_SAN) ||
						model.mapValueChange.get(this._kConstantFactory.TAG_FECHA_CADUCIDAD_REG_SAN)){

						if(model.mapValueChange.get(this._kConstantFactory.TAG_NUM_REG_SAN)){
							messageImgChange = this.validateChangeSanRegNumber(model);
						}

						if(messageImgChange === null){
							let fieldDocSanReg = this.validateChangeImageSanReg(this._kConstantFactory.TAG_DOC_REG_SAN, model);
							let fieldImgSanReg = this.validateChangeImageSanReg(this._kConstantFactory.TAG_IMAGEN_REG_SAN, model);
							messageImgChange = this.messageRequiredChangeSanReg(fieldDocSanReg, fieldImgSanReg);
						}
					}
				}
			} else {
				this.validateRequiredSimpleField(this._kConstantFactory.TAG_OBSERVACION_REG_SAN, model, requiredField);
			}
		}

		mensaje = this.buildRequiredMessage(requiredField);

		if(mensaje !== null && messageImgChange !== null){
			mensaje = mensaje +'<br>'+messageImgChange;
		}else{
			if(messageImgChange !== null){
				mensaje = messageImgChange;
			}
		}
		return mensaje;
	}

	buildRequiredMessage(requiredField){
		let message = null;

		if (requiredField.length > 0 && requiredField.length === 1) {
			message = this._kMessageService.renderMessage('requiredField', {etiquetaCampo: requiredField[0]});
		}

		if (requiredField.length > 1) {
			let fieldNames = '';
			for (let index in requiredField) {
				if (requiredField[index]) {
					fieldNames += requiredField[index];

					if (Number(index) === requiredField.length - 2) {
						fieldNames += ' y ';
					} else {
						fieldNames += ', ';
					}
				}
			}
			message = this._kMessageService.renderMessage('requiredFieldVarious', {etiquetaCampo: fieldNames});
		}

		return message;
	}

	validateRequiredChildField(tag, model, requiredField = null) {
		let flagInvalid = false;
		let fieldMapField = model.fieldsMap[tag];

		if (fieldMapField.valorNuevo[model.selectedSanitaryRegister] === null ||
			fieldMapField.valorNuevo[model.selectedSanitaryRegister] === undefined) {
			flagInvalid = true;
		}

		if (flagInvalid && requiredField !== null) {
			requiredField.push(fieldMapField.etiquetaCampo);
		} else {
			return flagInvalid;
		}
	}

	validateRequiredSimpleField(tag, model, requiredField = null) {
		let flagInvalid = false;
		let fieldMapField = model.fieldsMap[tag];

		if (fieldMapField.nivelAcceso !== this._kConstantFactory.TIPO_MODIFICACION_CAMPO_LECTURA &&
			fieldMapField.estadoCampo === this._kConstantFactory.ESTADO_ACTVO &&
			(fieldMapField.valorNuevo === null || fieldMapField.valorNuevo === undefined ||
			fieldMapField.valorNuevo === '')) {

			if(fieldMapField.valorSolicitado === null || fieldMapField.valorNuevo === '' ||
				fieldMapField.valorSolicitado === undefined){
				flagInvalid = true;
			}else{
				if(fieldMapField.valorActual !== null &&
					fieldMapField.valorActual !== undefined &&
					tag !== this._kConstantFactory.TAG_UNIDAD_MEDIDA){
					flagInvalid = true;
				}
			}
		}

		if (flagInvalid && requiredField !== null) {
			fieldMapField.valorNuevo = fieldMapField.valorActual;
			this.searchFieldLabelOnList(fieldMapField);
			model.mapValueChange.delete(tag);
			requiredField.push(fieldMapField.etiquetaCampo);
		} else {
			return flagInvalid;
		}
	}

	validateRequiredImageSanReg(tag, model, requiredField){
		let fieldMapField = model.fieldsMap[tag];

		if(fieldMapField.valorNuevo[model.selectedSanitaryRegister] instanceof File === false) {
			requiredField.push(fieldMapField.etiquetaCampo);
		}
	}

	validateChangeImageSanReg(tag, model){
		let fieldMapField = model.fieldsMap[tag];

		if(fieldMapField.valorActual[model.selectedSanitaryRegister].codigoArchivo) {
			if(fieldMapField.valorNuevo[model.selectedSanitaryRegister] instanceof File){
				return true;
			}else{
				return false;
			}
		}else {
			return null;
		}
	}

	messageRequiredChangeSanReg(fieldDocSanReg, fieldImgSanReg){
		let message = null;
		let messageCase1 = this._kMessageService.renderMessage('changeDocSanReg');
		let messageCase2 = this._kMessageService.renderMessage('changeImgSanReg');

		if(fieldDocSanReg !== null && fieldImgSanReg !== null){
			if(!fieldDocSanReg && !fieldImgSanReg){
				message = this._kMessageService.renderMessage('changeImgDocSanReg');
			}else{
				if(!fieldDocSanReg){
					message = messageCase1;
				}
				if(!fieldImgSanReg){
					message = messageCase2;
				}
			}
		}else{
			if(fieldDocSanReg !== null && !fieldDocSanReg){
				message = messageCase1;
			}
			if(fieldImgSanReg !== null && !fieldImgSanReg){
				message = messageCase2;
			}
		}
		return message;
	}

	validateChangeSanRegNumber(model){
		let numberChange = model.mapValueChange.get(this._kConstantFactory.TAG_NUM_REG_SAN);
		let sanRegCodes = model.fieldsMap[this._kConstantFactory.TAG_REG_SAN].valorActual;

		if(sanRegCodes.length > 2){
			for(let index in sanRegCodes){
				if(sanRegCodes[index] && sanRegCodes[index] !== '0' && sanRegCodes !== model.selectedSanitaryRegister){
					let numberSanRegOther = numberChange.valorActual[sanRegCodes[index]];
					let numberSanRegChanged = numberChange.valorNuevo[model.selectedSanitaryRegister];
					if(numberSanRegOther === numberSanRegChanged){
						return  this._kMessageService.renderMessage('sanRegNumberRepeated',
							{SanRegNumber: numberSanRegChanged});
					}
				}
			}
		}
		return null;
	}

	validateFileErrors($newFiles) {
		let message = null;
		if ($newFiles && $newFiles.length > 0 && $newFiles[0].$error) {
			if ($newFiles[0].$error === 'maxSize') {
				return this._kMessageService.renderMessage('maxSizeImage', {tamano: this._kConstantFactory.FILE_SIZE});
			}
			if ($newFiles[0].$error === 'pattern') {
				return this._kMessageService.renderMessage('patternFile', {tipoArchivo: 'xls, xlsx'});
			}
			if ($newFiles[0].$error) {
				return this._kMessageService.renderMessage('errorFile');
			}
		}
		return message;
	}

	validateMerchandiseRequired(model){
		let requiredField = [];
		let message = null;

		let garantia = model.fieldsMap[this._kConstantFactory.TAG_DATOS_GARANTIA].valorNuevo;

		if(model.mapValueChange.get(this._kConstantFactory.TAG_DATOS_GARANTIA) &&
			garantia.estadoGarantia === this._kConstantFactory.ESTADO_ACTVO){

			if(garantia.tieMaxGarNor === undefined || garantia.tieMaxGarNor === null || garantia.tieMaxGarNor === 0){
				requiredField.push('Tiempo máximo de la Garantía');
			}
		}

		this.validateCharacteristicsRequired(model, requiredField);

		message = this.buildRequiredMessage(requiredField);
		return message;
	}

	validateCharacteristicsRequired(model, requiredField = []){
		let message = null;
		let characteristicsList = model.fieldsMap[this._kConstantFactory.TAG_CARACTERISTICAS].valorNuevo;
		let flagValidate = false;
		if(characteristicsList && characteristicsList.length > 0){
			for(var index in characteristicsList){
				if(characteristicsList[index] && characteristicsList[index].description === null ||
					characteristicsList[index].description === '' || characteristicsList[index].description === undefined){
					flagValidate = true;
					break;
				}
			}
		}
		if(flagValidate){
			message = this._kMessageService.renderMessage('requiredField', {etiquetaCampo: 'Descripción'});
			requiredField.push('Descripción de las Características');
		}
		return message;
	}

	messageConfirmationSaveDataArticle(model){
		let message = null;
		let messageCondTerm = this._kMessageService.renderMessage('termAndConditionsTitle') + '<br>' +
			this._kMessageService.renderMessage('termAndConditions');
		if(model.optionSelected.id === this._kConstantFactory.ID_SECCION_REG_SANITARIO){

			let regSanApplies = model.fieldsMap[this._kConstantFactory.TAG_APLICA_REG_SAN];
			if (regSanApplies.valorActual === this._kConstantFactory.VALOR_APLICA_REGISTRO_SANITARIO) {
				let regSanHave = model.fieldsMap[this._kConstantFactory.TAG_TIENE_REG_SAN];

				if (regSanHave.valorNuevo) {
					if(model.selectedSanitaryRegister === 0){
						//new san reg
						message = messageCondTerm;
					}else{
						if(model.mapValueChange.get(this._kConstantFactory.TAG_NUM_REG_SAN) ||
							model.mapValueChange.get(this._kConstantFactory.TAG_FECHA_CADUCIDAD_REG_SAN)){
							//number san reg changed or caducity date changed
							message = messageCondTerm;
						}
					}
				}
			}
		}
		return message;
	}


	messageFieldChange(model){
		let messageAuthorizationFields = null;
		let messageNotAuthorizationFields = null;
		let messageUnidadManejo = null;
		let message = null;

		let map = model.mapValueChange;
		map.forEach((value, key) => {

			if(value.nivelAcceso === this._kConstantFactory.TIPO_MODIFICACION_CAMPO_SIN_AUTORIZACION){
				if(messageNotAuthorizationFields === null){
					messageNotAuthorizationFields = '<li>' + value.etiquetaCampo + '</li>';
				}else{
					messageNotAuthorizationFields += '<li>' + value.etiquetaCampo + '</li>';
				}
			}
			if(value.nivelAcceso === this._kConstantFactory.TIPO_MODIFICACION_CAMPO_CON_AUTORIZACION){
				if(messageAuthorizationFields === null){
					messageAuthorizationFields = '<li>' + value.etiquetaCampo + '</li>';
				}else{
					messageAuthorizationFields += '<li>' +  value.etiquetaCampo + '</li>';
				}
			}
			if(key === this._kConstantFactory.TAG_UNIDAD_MANEJO){
				messageUnidadManejo = this._kMessageService.renderMessage('unidadManejoMessage');
				messageUnidadManejo += '<br> <br>';
			}

		});
		if(messageNotAuthorizationFields !== null){
			message = this._kMessageService.renderMessage('confirmationNoAuthorizationFields', {fields: messageNotAuthorizationFields});
		}
		if(messageAuthorizationFields !== null){
			let message1 = this._kMessageService.renderMessage('confirmationAuthorizationFields', {fields: messageAuthorizationFields});
			if(message === null){
				message = message1;
			}else{
				message += message1;
			}
		}

		if(messageUnidadManejo !== null){
			if(message === null){
				message = messageUnidadManejo;
			}else{
				message += messageUnidadManejo;
			}
		}
		return message;
	}

	searchSanitaryRegisterRecord(articuloObj, model, promise) {
		let params = {
			codigoCompania: model.codigoCompania,
			codigoArticulo: articuloObj['@id'].codigoArticulo
		};
		this.catalogArticlesService.searchSanitaryRegisterRecord(params)
			.success((data) => {
				promise.resolve(data);
			})
			.error((message) => {
				promise.reject(message);
			});
	}

	searchFileContent(file, model, promise){

		let secuencialCampoArticulo = file.secuencialCampoArticulo;
		if(model.optionSelected.id === this._kConstantFactory.ID_SECCION_REG_SANITARIO){
			secuencialCampoArticulo = file.mapSecuencialCampoArticulo[model.selectedSanitaryRegister];
		}

		let params = {
			codigoCompania: model.codigoCompania,
			secuencialCampoArticulo: secuencialCampoArticulo
		};
		this.catalogArticlesService.searchFileContent(params)
			.info((data, tipoFile) =>{
				file['image64'] = data;
				file['tipoFile'] = tipoFile;
				promise.resolve();
			})
			.error((message) => {
				promise.reject(message);
			});
	}

	getAutorizacionUpdate(model, promise){
		let listAtributoFrom = [];
		listAtributoFrom.push(this._kConstantFactory.TAG_REFERENCIA_PROVEEDOR);
		listAtributoFrom.push(this._kConstantFactory.TAG_DESCRIPCION_PROVEEDOR);
		let params = {
			codigoCompania: model.codigoCompania,
			colAtributoFrom: listAtributoFrom
		};

		this.catalogArticlesService.getAutorizacionUpdate(params)
		.success((data) => {
			promise.resolve(data);
		})
		.error((message) => {
			promise.reject(message);
		});
	}
}

export default CatalogArticlesFactory;
