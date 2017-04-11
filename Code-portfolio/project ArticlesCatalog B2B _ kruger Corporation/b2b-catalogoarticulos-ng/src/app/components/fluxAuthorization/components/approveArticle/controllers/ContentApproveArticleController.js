import modalShowImage from 'app/components/common/views/modalShowImage.tpl';

class ContentApproveArticleController {

	constructor(actionsLayout, fluxAuthorizationModel, fluxAuthorizationFactory, $state, appConstant, kMessageService,
				kLoadingService, kModalService, $q, $uibModal, $filter) {
		'ngInject';
		actionsLayout.renderLeft(false);
		this.model = fluxAuthorizationModel;
		this.fluxAuthorizationFactory = fluxAuthorizationFactory;
		this.$state = $state;
		this.appConstant = appConstant;
		this.kMessageService = kMessageService;
		this.kLoadingService = kLoadingService;
		this.kModalService = kModalService;
		this.$q = $q;
		this.$uibModal = $uibModal;
		this.$filter = $filter;
		this.editarAprobacion = true;
	}

	clickBackButton(){
		this.kMessageService.hide();
		this.$state.go('fluxAuthorization.load');
	}

	clickSaveButton(){
		this.kMessageService.hide();
		this.model.articleChangeList = [];

		let errorMessage = this.fluxAuthorizationFactory.validateDataBeforSave(this.model);
		if(errorMessage !== null){
			this.kMessageService.showError(errorMessage);
		}else{
			this.kModalService.showConfirm({
				scopeClass: this,
				message: this.kMessageService.renderMessage('saveFluxAuthorization'),
				acceptFn: this.saveFluxAuthorization,
				cancelFn:  () => {},
				size: this.kModalService.MODAL_SIZE.SMALL,
				btnAceptLabel: 'Si',
				btnCancelLabel: 'No'
			});
		}

	}

	saveFluxAuthorization(){
		this.kLoadingService.show(null, '.k-layout');
		let defer = this.$q.defer();
		let promise = defer.promise;

		this.fluxAuthorizationFactory.saveFluxAuthorization(this.model, defer);

		promise.then((successMessage) =>{
			this.kLoadingService.hide();
			this.$state.go('fluxAuthorization.load');

			if(successMessage !== null){
				this.kMessageService.showInfo(successMessage);
			}
		}, ((message) => {
			this.kLoadingService.hide();
			this.kMessageService.showError(message);
		}));
	}

	searchValueLabelOnList(data, isNewValue = true){
		
		let value;
		if(isNewValue){
			value = data.valorNuevo;
		}else{
			value = data.valorActual;
		}

		if(value === 'false' || (data.pathObject === this.appConstant.TAG_SEMAFORO && value === '0')){
			return 'No';
		}

		if(value === 'true' || (data.pathObject === this.appConstant.TAG_SEMAFORO && value === '1')){
			return 'Si';
		}

		if (value === this.appConstant.CATALOGO_CODIGO_NO_APLICA +'/'+
						this.appConstant.CATALOGO_VALOR_NO_APLICA) {
			return '';
		}

		if(data.listSelectItemTrasient && data.listSelectItemTrasient.length > 0){
			let lista = data.listSelectItemTrasient;
			for(let index in lista){
				if(lista[index].value === value){
					return lista[index].label;
				}
			}
		}

		if(value === this.appConstant.CAMPO_VALUE_NINGUNO && data.pathObject === this.appConstant.TAG_DEDUCIBLE){
			return 'Ninguno';
		}

		if(value === null || value === this.appConstant.CAMPO_VALUE_NINGUNO){
			value = '';
		}

		if(data.pathObject === this.appConstant.TAG_FECHA_CADUCIDAD_REG_SAN || 
			data.pathObject === this.appConstant.TAG_FECHA_EMISION_REG_SAN ){
			return this.$filter('date')(value, "yyyy-MM-dd");
		}
	
		if(data.pathObject === this.appConstant.TAG_DATOS_GARANTIA && value !== undefined){
			let garantia = value;
			value = 'Estado: ';
			if(garantia.estadoGarantia === this.appConstant.ESTADO_ACTVO){
				value += 'Activo';

				if(garantia.tieMaxGarNor !== null && garantia.tieMaxGarNor !== undefined){
					value += ', ' + 'Tiempo máximo: ' + garantia.tieMaxGarNor + ' meses';
				}
			}else{
				value += 'Inactivo';
			}
		}
		return value;
	}

	searchFileContent(file, action){
		if(file.image64 === undefined && file['@id'].secuencialArchivoCampoArticulo !== null){
			this.kLoadingService.show(null, '.k-layout');
			let defer = this.$q.defer();
			let promise = defer.promise;

			this.fluxAuthorizationFactory.searchFileContent(file, this.model, defer);

			promise.then(()=>{
				this.kLoadingService.hide();
				this.actionImage(file, action);
			},((message)=>{
				this.kLoadingService.hide();
				this.kMessageService.showError(message);
			}));
		}else{
			this.actionImage(file, action);
		}
	}

	actionImage(file, action){
		switch (action){
			case 'show':
				this.showImage(file);
				break;
			case 'download':
				this.downloadFile(file);
				break;
		}
	}

	downloadFile(file){
		let binaryString = window.atob(file.image64);
		let len = binaryString.length;
		let bytes = new Uint8Array( len );
		for (let i = 0; i < len; i++)        {
			bytes[i] = binaryString.charCodeAt(i);
		}
		this.fluxAuthorizationFactory.createFileToDownload(bytes.buffer, file.nombreArchivo);
	}

	showImage(file){
		let newImage = false; 
		let image = file.image64;	
		this.$uibModal.open({
			animation: false,
			controller: 'modalShowImageController',
			controllerAs: 'modalShowImg',
			templateUrl: modalShowImage.name,
			size: 'md',
			windowClass: 'k-modal',
			resolve: {
				fieldImage: (() => {
					return null;
				}),
				newImage: (() => {
					return newImage;
				}),
				sanitaryRegisterSelected: (() => {
					return undefined;
				}),
				imageToShow: (() => {
					return image;
				})
			}
		});
	}

	checkImageExtension(img){
		if(img){
			let tipoContenidoArchivo = img.tipoContenidoArchivo;
			
			if(tipoContenidoArchivo){
				let extension = tipoContenidoArchivo.split('/')[0];
				if(extension === 'image'){
					return true;
				}
			}
		}
		return false;
	}

	changeFieldState(field){
		this.kMessageService.hide();
		if(field.pathObject == this.appConstant.TAG_COMPUESTO_TRANSG){
			for(let index in this.model.articleToApprove.listaCamposArticulos){
				if(this.model.articleToApprove.listaCamposArticulos[index] && 
					this.model.articleToApprove.listaCamposArticulos[index].pathObject == this.appConstant.TAG_IMGAGEN_TANSG){

					let relatedField = this.model.articleToApprove.listaCamposArticulos[index];		
					relatedField.estadoSolicitudNuevo = field.estadoSolicitudNuevo;
					this.kMessageService.showInfo(this.kMessageService.renderMessage('authorizationRelatedFields', {field1: field.etiquetaCampo, field2: relatedField.etiquetaCampo}));
					break;	
				}
			}
		}

		if(field.pathObject == this.appConstant.TAG_IMGAGEN_TANSG){
			for(let index in this.model.articleToApprove.listaCamposArticulos){
				if(this.model.articleToApprove.listaCamposArticulos[index] && 
					this.model.articleToApprove.listaCamposArticulos[index].pathObject == this.appConstant.TAG_COMPUESTO_TRANSG){

					let relatedField = this.model.articleToApprove.listaCamposArticulos[index];		
					relatedField.estadoSolicitudNuevo = field.estadoSolicitudNuevo;
					this.kMessageService.showInfo(this.kMessageService.renderMessage('authorizationRelatedFields', {field1: relatedField.etiquetaCampo, field2: field.etiquetaCampo}));
					break;	
				}
			}
		}
	}

}

export default ContentApproveArticleController;
