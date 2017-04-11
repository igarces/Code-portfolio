class FluxAuthorizationFactory {

	constructor(fluxAuthorizationService, kConstantFactory, kMessageService) {
		'ngInject';
		this.fluxAuthorizationService = fluxAuthorizationService;
		this._kMessageService = kMessageService;
		kConstantFactory.$getConstant('articles')
			.then((data) => {
				this._kConstantFactory = data;
			});
	}

	static instance(fluxAuthorizationService, kConstantFactory, kMessageService) {
		'ngInject';
		return new FluxAuthorizationFactory(fluxAuthorizationService, kConstantFactory, kMessageService);
	}

	searchFluxCaseArticles(model, promise) {
		let params = {
			processCode: model.processCode
		};
		return this.fluxAuthorizationService.searchFluxCaseArticles(params)
		.success((data)=>{
			this.fixFieldData(model, data);
			promise.resolve();
		}).error((message) => {
			promise.reject(message);
		});
	}

	fixFieldData(model, data){
		for(var index in data){
			if(data[index]){
				let fieldList = data[index].listaCamposArticulos;
				for(var jindex in fieldList){
					if(fieldList[jindex]){
						if(fieldList[jindex].pathObject === this._kConstantFactory.TAG_CARACTERISTICAS){
							if(fieldList[jindex].valorActual === undefined){
								fieldList[jindex].valorActual = [];
							}else{
								fieldList[jindex].valorActual = JSON.parse(fieldList[jindex].valorActual);
							}

							if(fieldList[jindex].valorNuevo === undefined){
								fieldList[jindex].valorNuevo = [];
							}else{
								fieldList[jindex].valorNuevo = JSON.parse(fieldList[jindex].valorNuevo);
							}
						}

						if(fieldList[jindex].pathObject === this._kConstantFactory.TAG_DATOS_GARANTIA){
							if(fieldList[jindex].valorActual !== undefined){
								fieldList[jindex].valorActual = JSON.parse(fieldList[jindex].valorActual);
							}

							if(fieldList[jindex].valorNuevo !== undefined){
								fieldList[jindex].valorNuevo = JSON.parse(fieldList[jindex].valorNuevo);
							}
						}
					}
				}
			}
		}
		model.articlesList = data;
	}

	validateDataBeforSave(model){
		let mensaje = null;
		for(let index in model.articleToApprove.listaCamposArticulos){
			if(model.articleToApprove.listaCamposArticulos[index]){
				let data = model.articleToApprove.listaCamposArticulos[index];

				if(data.estadoSolicitudNuevo === this._kConstantFactory.ESTADO_SOLICITUD_APROBAR){
					if(data.observacionNueva === null || data.observacionNueva === undefined){
						return this._kMessageService.renderMessage('requiredField', {etiquetaCampo: 'Observación'});
					}else{
						model.articleChangeList.push(this.validateDataAux(data));
					}
				}

				if(data.estadoSolicitudNuevo === this._kConstantFactory.ESTADO_SOLICITUD_RECHAZAR){
					if(data.observacionNueva === null || data.observacionNueva === undefined){
						return this._kMessageService.renderMessage('requiredField', {etiquetaCampo: 'Observación'});
					}else{
						model.articleChangeList.push(this.validateDataAux(data));
					}
				}

				if(data.estadoSolicitudNuevo === this._kConstantFactory.ESTADO_SOLICITUD_NO_GESTIONAR){
					if(data.observacionNueva === null || data.observacionNueva === undefined){
						return this._kMessageService.renderMessage('requiredField', {etiquetaCampo: 'Observación'});
					}else{
						model.articleChangeList.push(this.validateDataAux(data));
					}
				}

				if(data.estadoSolicitudNuevo === this._kConstantFactory.ESTADO_SOLICITUD_PENDIENTE){
					if(data.observacionNueva !== data.observacion && data.observacionNueva !== null &&
						data.observacionNueva !== undefined && data.observacionNueva !== ''){
						model.articleChangeList.push(this.validateDataAux(data));
					}
				}
			}
		}
		if(model.articleChangeList.length === 0){
			return this._kMessageService.renderMessage('noChangesToSave');
		}
		return mensaje;
	}

	validateDataAux(data){
		let change = JSON.parse(JSON.stringify(data));
		change.estadoSolicitud = change.estadoSolicitudNuevo;
		delete(change.estadoSolicitudNuevo);
		change.observacion = change.observacionNueva;
		delete(change.observacionNueva);
		delete(change.listSelectItemTrasient);

		if(change.pathObject === this._kConstantFactory.TAG_CARACTERISTICAS ||
			change.pathObject === this._kConstantFactory.TAG_DATOS_GARANTIA){
			if(change.valorActual){
				change.valorActual = JSON.stringify(change.valorActual);
			}
			if(change.valorNuevo){
				change.valorNuevo = JSON.stringify(change.valorNuevo);
			}
		}

		if(change.pathObject === this._kConstantFactory.TAG_IMAGEN_GENERAL || 
			change.pathObject === this._kConstantFactory.TAG_IMAGEN_COD_BARRAS ||
			change.pathObject === this._kConstantFactory.TAG_IMGAGEN_TANSG ||
			change.pathObject === this._kConstantFactory.TAG_IMAGEN_REG_SAN ||
			change.pathObject === this._kConstantFactory.TAG_DOC_REG_SAN){

				if(change.valorActual){
					change.valorActual = change.valorActual.nombreArchivo;
				}

				if(change.valorNuevo){
					change.valorNuevo = change.valorNuevo.nombreArchivo;
				}
			}

		return change;
	}

	saveFluxAuthorization(model, promise){
		let article = model.articleToApprove;
		let params = {
			codigoArticulo: article.codigoArticulo,
			codigoProveedor: article.codigoProveedor,
			codigoBarras: article.codigoBarras,
			codigoCompania: model.codigoCompania,
			userId: model.userId,
			listaCamposArticulos: model.articleChangeList,
			processCode: model.processCode,
			workItemId: model.workItemId,
			flowId: model.flowId,
			userCompleteName: model.userName,
			userNotificacion: article.userNotificacion,
			nombreProveedor: article.nombreProveedor,
			codigoAreaTrabajo: model.codigoAreaTrabajo,
			nombreAreaTrabajo: model.nombreAreaTrabajo
		};
		this.fluxAuthorizationService.saveFluxAuthorization(params)
		.success((data) => {
			promise.resolve(data);
		})
		.error((message) => {
			promise.reject(message);
		});
	}

	searchFileContent(file, model, promise){
		let params = {
			codigoCompania: model.codigoCompania,
			secuencialArchivoCampoArticulo: file['@id'].secuencialArchivoCampoArticulo
		};
		this.fluxAuthorizationService.searchFileContent(params)
		.success((data) =>{
			file['image64'] = data;
			promise.resolve();
		})
		.error((message) => {
			promise.reject(message);
		});
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
}

export default FluxAuthorizationFactory;
