class HeaderEditController {

	constructor(appConstant, catalogArticlesModel, $state, $q, catalogArticlesFactory, kLoadingService,
				kMessageService, kModalService) {
		'ngInject';
		this.appConstant = appConstant;
		this.model = catalogArticlesModel;
		this.$state = $state;
		this.$q = $q;
		this.catalogArticlesFactory = catalogArticlesFactory;
		this.kLoadingService = kLoadingService;
		this.kMessageService = kMessageService;
		this.kModalService = kModalService;
	}

	/**
	 * Return search articles page
	 */
	returnBack(){
		this.kMessageService.hide();

		this.$state.go('catalogArticles.search',{
				filters: this.model.filtersSearch,
				search: true }
		);
	}

	/**
	 * Return home page
	 */
	returnPageHome() {
		this.kLoadingService.show(null, '.k-layout');
		window.top.location.href=  this.model.urlInicio;
	}

	/**
	 * Edit selected article
	 */
	editArticle() {
		this.kMessageService.hide();

		this.model.editArticle = true;
		this.model.mapValueChange = new Map();

		//lógica para el trabajo con las imagenes.
		this.catalogArticlesFactory.prepareImgForEditArticle(this.model);

		//lógica para campos del registro sanitario
		if(this.model.optionSelected.id === this.appConstant.ID_SECCION_REG_SANITARIO){
			this.catalogArticlesFactory.prepareSanRegForEditArticle(this.model);
		}

		//Comentado hasta que se defina si se va a editar el tipo unidad empaque de la UM
		//lógica para el registro sanitario
		//if(this.model.optionSelected.id === this.appConstant.ID_SECCION_PROVEEDOR){
		//	this.catalogArticlesFactory.prepareProviderDataForEditArticle(this.model);
		//}
	}

	/**
	 * Cancel edit option
	 */
	cancelEditArticle() {
		this.kMessageService.hide();
		this.catalogArticlesFactory.resetEditValues(this.model);
		this.model.editArticle = false;
	}

	/**
	 * Save changes article edited
	 */
	saveArticleEdited() {
		this.catalogArticlesFactory.lookingForChangesInImagesSection(this.model);
		this.catalogArticlesFactory.lookingForChangesInCaractList(this.model);
		this.saveArticlesConfirmation();
	}

	saveArticlesConfirmation(){
		if(this.model.mapValueChange.size > 0){
			let validationMessage = this.catalogArticlesFactory.validateDataOfArticles(this.model);
			if(validationMessage === null){
				let messageFieldChange = this.catalogArticlesFactory.messageFieldChange(this.model);

				let messageConfirmation = this.catalogArticlesFactory.messageConfirmationSaveDataArticle(this.model);
				let btnAceptLabel = 'Si';
				let	btnCancelLabel = 'No';
				if(messageConfirmation === null){
					messageConfirmation = messageFieldChange + this.kMessageService.renderMessage('saveArticleDataConfirmation');
				}else{
					messageConfirmation = messageFieldChange + messageConfirmation;
					btnAceptLabel = 'Acepto';
					btnCancelLabel = 'No acepto';
				}

				this.kModalService.showConfirm({
					scopeClass: this,
					message: messageConfirmation,
					acceptFn: this.acceptConditions,
					cancelFn:  () => {},
					size: this.kModalService.MODAL_SIZE.MEDIUM,
					btnAceptLabel: btnAceptLabel,
					btnCancelLabel: btnCancelLabel,
					html: true
				});
			}else{
				this.kMessageService.showError(validationMessage);
			}
		}else{
			this.kMessageService.showInfo(this.kMessageService.renderMessage('noChangesToSave'));
		}
	}

	acceptConditions(){
		if(this.model.optionSelected.id === this.appConstant.ID_SECCION_IMAGENES ||
			this.model.optionSelected.id === this.appConstant.ID_SECCION_COMPLEMENTARIOS ||
			this.model.optionSelected.id === this.appConstant.ID_SECCION_REG_SANITARIO ){
			let promise = this.saveImagesAux();
			promise.then(() => {
				this.saveArticleEditedAux();
			},((error) => {
				this.kMessageService.showInfo(error);
			}));
		}else{
			//this.catalogArticlesFactory.lookingForChangesInCaractList(this.model);
			this.saveArticleEditedAux();
		}
	}

	saveArticleEditedAux(){
		this.kLoadingService.show(null, '.k-layout');
		let defer = this.$q.defer();
		let promise = defer.promise;

		this.catalogArticlesFactory.saveArticlesData(this.model, defer);
		promise.then((message) => {
			return this.searchFieldDetails(message);
		},((message) => {
			this.catalogArticlesFactory.prepareImgForEditArticle(this.model);
			this.kLoadingService.hide();
			this.kMessageService.showError(message);
		}));
	}

	saveImagesAux(){
		let defer = this.$q.defer();
		let promise = defer.promise;

		//this.catalogArticlesFactory.lookingForChangesInImagesSection(this.model);
		let promises = [];
		let map = this.model.mapValueChange;

		if(map.size === 0){
			defer.reject(this.kMessageService.renderMessage('noChangesToSave'));
		}

		map.forEach((value, key) => {
			let tipoImagen = key.split('/')[1];

			if(tipoImagen){
				let defer1 = this.$q.defer();
				let promise1 = defer1.promise;

				this.catalogArticlesFactory.prepareArticlesImage(value, defer1, tipoImagen, key, this.model);
				promises.push(promise1);
			}
		});

		this.$q.all(promises).then((data) => {
			for(let index in data){
				if(data[index]){
					let key = data[index].key;
					delete(data[index].key);
					let valorNuevo = data[index];

					let field = this.model.mapValueChange.get(key);

					if(this.model.optionSelected.id === this.appConstant.ID_SECCION_REG_SANITARIO){
						field.valorNuevo[this.model.selectedSanitaryRegister] = valorNuevo;

						if(field.valorActual[this.model.selectedSanitaryRegister].image64 !== undefined){
							delete(field.valorActual[this.model.selectedSanitaryRegister].image64);
						}
					}else{
						field.valorNuevo = valorNuevo;

						if(field.valorActual.image64 !== undefined){
							delete(field.valorActual.image64);
						}
					}
				}
			}
			defer.resolve();
			},((message) => {
				this.kMessageService.showError(message);
			}));
		return promise;
	}

	/**
	 * Reloading data
	 */
	searchFieldDetails(message){
		this.kLoadingService.show(null, '.k-layout');
		let defer1 = this.$q.defer();
		let promise1 = defer1.promise;

		this.catalogArticlesFactory.searchArticleFieldsDetails(this.model, defer1);
		promise1.then(() => {
			this.kLoadingService.hide();
			//this.kMessageService.showInfo(this.kMessageService.renderMessage('successSave'));
			this.kMessageService.showInfo(message);
			this.model.editArticle = false;
		},((message) => {
				this.kLoadingService.hide();
			this.kMessageService.showError(message);
		}));
	}
}

export default HeaderEditController;
