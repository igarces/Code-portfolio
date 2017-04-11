import EditImageDirectiveTpl from './EditImageDirectiveTemplate.tpl';
import modalShowImage from 'app/components/common/views/modalShowImage.tpl';

/**
 * Created by igarces on 13/06/2016.
 */
class EditImageDirective {
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
			templateUrl: EditImageDirectiveTpl.name,
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
		return new EditImageDirective(kConstantFactory, catalogArticlesFactory, kLoadingService, $q, $uibModal,
			kMessageService);
	}

	link(scope) {
		scope.appConstant = this.kConstantFactory.$getConstantSync('articles');
		this.constants = scope.appConstant;
		this.model = scope.model;
		scope.editImageDirective = this;
	}

	searchImageById(field, task){
		if(field.valorNuevo instanceof File){
			this.actionImage(field, task);
		}else{
			if(field.valorActual.image64 === undefined && field.valorActual.codigoArchivo !== null){
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
				if(field.valorNuevo instanceof File){
					this.showImage(field, true);
				}else{
					this.showImage(field, false);
				}
				break;
			case 'downloadDifferent':
				if(field.valorNuevo instanceof File){
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
					return undefined;
				}),
				imageToShow: (() => {
					return image;
				})
			}
		});
	}

	downloadImage(field){
		//let binaryString = window.atob(field.valorActual.image64);
		//let len = binaryString.length;
		//let bytes = new Uint8Array( len );
		//for (let i = 0; i < len; i++)        {
		//	bytes[i] = binaryString.charCodeAt(i);
		//}
		//this.catalogArticlesFactory.createFileToDownload(bytes.buffer, field.valorActual.nombreArchivo);
		this.downloadFile(field.valorActual.image64, field.valorActual.nombreArchivo);
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

	downloadImageFile(field){
		this.kLoadingService.show(null, '.k-layout');
		let reader = new FileReader();
		reader.onload = (() => {
			let completeContent = reader.result;
			this.kLoadingService.hide();
			this.catalogArticlesFactory.createFileToDownload(completeContent, field.valorNuevo.name);
		});
		reader.readAsArrayBuffer(field.valorNuevo);
	}

	uploadImage($files, $newFiles, tag){
		let field = this.model.fieldsMap[tag];
		if($newFiles && $newFiles.length > 0 && $newFiles[0].$error){
			if($newFiles[0].$error === 'maxSize'){
				this.kMessageService.showError(this.kMessageService.renderMessage('maxSizeImage',
					{tamano: this.constants.FILE_SIZE}));

				this.catalogArticlesFactory.fillImagesField(field);
				return;
			}
			if($newFiles[0].$error === 'pattern'){
				this.kMessageService.showError(this.kMessageService.renderMessage('patternImage'));
				this.catalogArticlesFactory.fillImagesField(field);
				return;
			}
			if($newFiles[0].$error){
				this.kMessageService.showError(this.kMessageService.renderMessage('errorFile'));
				this.catalogArticlesFactory.fillImagesField(field);
				return;
			}
		}else{
			let tipoImagen = tag.split('/')[1];

			if($files.length > 0){
				field.valorNuevo.descripcionArchivo = field.valorActual ? field.valorActual.descripcionArchivo: null;

				if(tipoImagen === this.constants.TIPO_IMAGEN_GENERAL_ARTICULO){
					this.model.imageTempIGE = field.valorNuevo;
				}

				if(tipoImagen === this.constants.TIPO_IMAGEN_CODIGO_BARRAS){
					this.model.imageTempICB = field.valorNuevo;
				}

				if(tipoImagen === this.constants.TIPO_IMAGEN_DOC_JUSTIFICACION_NO_TRANSG){
					this.model.imageTempIJT = field.valorNuevo;

					field.valorNuevo.descripcionArchivo = null; 
				}
			}else{
				if(tipoImagen === this.constants.TIPO_IMAGEN_GENERAL_ARTICULO){
					field.valorNuevo = this.model.imageTempIGE;
				}
				if(tipoImagen === this.constants.TIPO_IMAGEN_CODIGO_BARRAS){
					field.valorNuevo = this.model.imageTempICB;
				}
				if(tipoImagen === this.constants.TIPO_IMAGEN_DOC_JUSTIFICACION_NO_TRANSG){
					field.valorNuevo = this.model.imageTempIJT;
				}
				//this.catalogArticlesFactory.fillImagesField(field);
			}
		}
	}

	removeImage(field){
		field.valorNuevo = undefined;
	}

	extensionAllowed(tag){
		let extensionAllowed = 'image/*';
		if(tag === this.constants.TAG_IMGAGEN_TANSG){
			extensionAllowed = 'image/*,.pdf,.zip,.rar';
		}
		return extensionAllowed;
	}

	checkImageExtension(field, esValorNuevo = false){
		let img = field.valorActual;
		if(esValorNuevo){
			img = field.valorNuevo;
		}
		return this.catalogArticlesFactory.checkImageExtension(img);
	}

	getDemandFile(field){
		if(field.valorSolicitado){
			if(field.image64 === undefined && field.secuencialCampoArticulo){
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
			}else{
				this.fileDemandShowDownload(field);
			}
		}
	}

	fileDemandShowDownload(field){
		let extension = field.tipoFile.split('/')[0];
		
		if(extension === 'image'){
			this.showImage(null, false, field.image64);
		}else{
			this.downloadFile(field.image64, field.valorSolicitado);
		}
	}
}

export default EditImageDirective;

