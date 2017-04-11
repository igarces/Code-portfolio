import EditFileDirectiveTpl from './EditSanitaryRegisterFileDirectiveTemplate.tpl';
import modalShowImage from 'app/components/common/views/modalShowImage.tpl';

/**
 * Created by igarces on 13/06/2016.
 */
class EditSanitaryRegisterFileDirective {
	constructor(kConstantFactory, catalogArticlesFactory, kLoadingService, $q, $uibModal, kMessageService) {
		this.kConstantFactory = kConstantFactory;
		this.catalogArticlesFactory = catalogArticlesFactory;
		this.kLoadingService = kLoadingService;
		this.constants = null;
		this.$q = $q;
		this.$uibModal = $uibModal;
		this.kMessageService = kMessageService;

		let directive = {
			restrict: 'E',
			transclude: true,
			templateUrl: EditFileDirectiveTpl.name,
			scope: {
				model: '=?',
				tag: '=?'
			},
			link: this.link.bind(this)
		};

		return directive;
	}

	static instance(kConstantFactory, catalogArticlesFactory, kLoadingService, $q, $uibModal, kMessageService) {
		'ngInject';
		return new EditSanitaryRegisterFileDirective(kConstantFactory, catalogArticlesFactory, kLoadingService, $q, $uibModal,
			kMessageService);
	}

	link(scope) {
		scope.appConstant = this.kConstantFactory.$getConstantSync('articles');
		this.constants = scope.appConstant;
		this.model = scope.model;
		this.tag = scope.tag;
		scope.editImageDirective = this;
	}

	searchImageById(field, task){
		if(field.valorNuevo[this.model.selectedSanitaryRegister] instanceof File){
			this.actionImage(field, task);
		}else{
			if(field.valorActual[this.model.selectedSanitaryRegister].image64 === undefined &&
				field.valorActual[this.model.selectedSanitaryRegister].codigoArchivo !== null){
				this.kLoadingService.show(null, '.k-layout');
				let defer = this.$q.defer();
				let promise = defer.promise;

				this.catalogArticlesFactory.searchImageById(field, this.model, defer);

				promise.then(()=>{
					this.kLoadingService.hide();
					this.actionImage(field, task);
				},((message)=>{
					this.kLoadingService.hide();
					this.kMessageService.showError(message);
				}));
			}else{
				this.actionImage(field, task);
			}
		}
	}

	actionImage(field, task){
		switch (task){
			case 'show':
				this.showImage(field);
				break;
			case 'download':
				this.downloadImage(field);
				break;
			case 'showDifferent':
				if(field.valorNuevo[this.model.selectedSanitaryRegister] instanceof File){
					this.showImage(field, true);
				}else{
					this.showImage(field, false);
				}
				break;
			case 'downloadDifferent':
				if(field.valorNuevo[this.model.selectedSanitaryRegister] instanceof File){
					this.downloadImageFile(field);
				}else{
					this.downloadImage(field);
				}
				break;
		}
	}

	showImage(field, newImage = false, image = null){
		this.$uibModal.open({
			animation: false,
			controller: 'modalShowImageController',
			controllerAs: 'modalShowImg',
			templateUrl: modalShowImage.name,
			size: 'md',
			windowClass: 'k-modal',
			resolve: {
				fieldImage: (() => {
					return field;
				}),
				newImage: (() => {
					return newImage;
				}),
				sanitaryRegisterSelected: (() => {
					return this.model.selectedSanitaryRegister;
				}),
				imageToShow: (() => {
					return image;
				})
			}
		});
	}

	downloadImage(field){
		let binaryString = window.atob(field.valorActual[this.model.selectedSanitaryRegister].image64);
		let len = binaryString.length;
		let bytes = new Uint8Array( len );
		for (let i = 0; i < len; i++)        {
			bytes[i] = binaryString.charCodeAt(i);
		}
		this.catalogArticlesFactory.createFileToDownload(bytes.buffer,
			field.valorActual[this.model.selectedSanitaryRegister].nombreArchivo);
	}

	downloadImageFile(field){
		this.kLoadingService.show(null, '.k-layout');
		let reader = new FileReader();
		reader.onload = (() => {
			let completeContent = reader.result;
			this.kLoadingService.hide();
			this.catalogArticlesFactory.createFileToDownload(completeContent, field.valorNuevo[this.model.selectedSanitaryRegister].name);
		});
		reader.readAsArrayBuffer(field.valorNuevo[this.model.selectedSanitaryRegister]);
	}

	uploadImage($files, $newFiles, tag){
		let field = this.model.fieldsMap[tag];
		if($newFiles && $newFiles.length > 0 && $newFiles[0].$error){
			if($newFiles[0].$error === 'maxSize'){
				this.kMessageService.showError(this.kMessageService.renderMessage('maxSizeImage',
					{tamano: this.constants.FILE_SIZE}));
				this.catalogArticlesFactory.fillImagesSanReg(field, this.model);
				return;
			}
			if($newFiles[0].$error === 'pattern'){

				if(tag === this.constants.TAG_DOC_REG_SAN){
					this.kMessageService.showError(this.kMessageService.renderMessage('patternImageFile', {extensionType: '.pdf, .zip'}));
				}else{
					this.kMessageService.showError(this.kMessageService.renderMessage('patternImage'));
				}

				this.catalogArticlesFactory.fillImagesSanReg(field, this.model);
				return;
			}
			if($newFiles[0].$error){
				this.kMessageService.showError(this.kMessageService.renderMessage('errorFile'));
				this.catalogArticlesFactory.fillImagesSanReg(field, this.model);
				return;
			}
		}else{
			let tipoImagen = tag.split('/')[1];
			if($files.length > 0){
				field.valorNuevo[this.model.selectedSanitaryRegister].descripcionArchivo =
					field.valorActual[this.model.selectedSanitaryRegister] ?
					field.valorActual[this.model.selectedSanitaryRegister].descripcionArchivo: null;

				if(tipoImagen === this.constants.TIPO_IMAGEN_REG_SAN){
					this.model.imageTempIRS = field.valorNuevo[this.model.selectedSanitaryRegister];
				}

				if(tipoImagen === this.constants.TIPO_IMAGEN_DOC_REG_SAN){
					this.model.imageTempDRS = field.valorNuevo[this.model.selectedSanitaryRegister];
				}

			}else{
				if(tipoImagen === this.constants.TIPO_IMAGEN_REG_SAN){
					field.valorNuevo[this.model.selectedSanitaryRegister] = this.model.imageTempIRS;
				}
				if(tipoImagen === this.constants.TIPO_IMAGEN_DOC_REG_SAN){
					field.valorNuevo[this.model.selectedSanitaryRegister] = this.model.imageTempDRS;
				}

				//this.catalogArticlesFactory.fillImagesSanReg(field, this.model);
			}
		}
	}

	removeImage(field){
		field.valorNuevo[this.model.selectedSanitaryRegister] = undefined;
	}

	checkImageExtension(field, esValorNuevo = false){
		let img = field.valorActual[this.model.selectedSanitaryRegister];
		if(esValorNuevo){
			img = field.valorNuevo[this.model.selectedSanitaryRegister];
		}
		return this.catalogArticlesFactory.checkImageExtension(img);
	}

	extensionAllowed(tag){
		let extensionAllowed = 'image/*';
		if(tag === this.constants.TAG_DOC_REG_SAN){
			extensionAllowed = 'image/*,.pdf,.zip';
		}
		return extensionAllowed;
	}

	getDemandFile(field){
		if(field.valorSolicitado && field.valorSolicitado[this.model.selectedSanitaryRegister]){
			if(field.mapSecuencialCampoArticulo && field.mapSecuencialCampoArticulo[this.model.selectedSanitaryRegister]){
				this.kLoadingService.show(null, '.k-layout');
				let defer = this.$q.defer();
				let promise = defer.promise;

				this.catalogArticlesFactory.searchFileContent(field, this.model, defer);

				promise.then(()=>{
					this.kLoadingService.hide();
					this.fileDemandShowDownload(field);
				},((message)=>{
					this.kLoadingService.hide();
					this.kMessageService.showError(message);
				}));
			}
			// else{
			// 	this.fileDemandShowDownload(field);
			// }
		}
	}

	fileDemandShowDownload(field){
		let extension = field.tipoFile.split('/')[0];
		
		if(extension === 'image'){
			this.showImage(null, false, field.image64);
		}else{
			this.downloadFile(field.image64, field.valorSolicitado[this.model.selectedSanitaryRegister]);
		}
	}

	downloadFile(file, fileName){
		let binaryString = window.atob(file);
		let len = binaryString.length;
		let bytes = new Uint8Array( len );
		for (let i = 0; i < len; i++)        {
			bytes[i] = binaryString.charCodeAt(i);
		}
		this.catalogArticlesFactory.createFileToDownload(bytes.buffer, fileName);
	}
}

export default EditSanitaryRegisterFileDirective;

