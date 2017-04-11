import SidebarOptionsModel from 'app/components/common/models/SidebarOptionsModel';

class SidebarEditController {

	constructor(appConstant, catalogArticlesModel, kModalService, kMessageService, catalogArticlesFactory, kLoadingService,
		$q) {
		'ngInject';
		this.appConstant = appConstant;
		this.model = catalogArticlesModel;
		this.kModalService = kModalService;
		this.kMessageService = kMessageService;
		this.catalogArticlesFactory = catalogArticlesFactory;
		this.kLoadingService = kLoadingService;
		this.$q = $q;

		this.sidebarOptionsDetails();
	}

	sidebarOptionsDetails() {
		let optionDefault = new SidebarOptionsModel(this.appConstant.ID_SECCION_DATOS_BASICOS, 'Datos básicos',
			this.appConstant.IMG_ICON_DAT_BAS);

		this.sidebarOptions = [
			optionDefault,
			new SidebarOptionsModel(this.appConstant.ID_SECCION_PROVEEDOR, 'Proveedor',
				this.appConstant.IMG_ICON_PROVEEDORES),
			new SidebarOptionsModel(this.appConstant.ID_SECCION_COMPLEMENTARIOS, 'Complementarios',
				this.appConstant.IMG_ICON_COMPLEMENTARIOS),
			new SidebarOptionsModel(this.appConstant.ID_SECCION_DATOS_MERCANCIAS, 'Datos mercancías',
				this.appConstant.IMG_ICON_MERCANCIAS),
			new SidebarOptionsModel(this.appConstant.ID_SECCION_REG_SANITARIO, 'Registro sanitario',
				this.appConstant.IMG_ICON_REG_SAN),
			new SidebarOptionsModel(this.appConstant.ID_SECCION_IMAGENES, 'Imágenes artículo',
				this.appConstant.IMG_ICON_IMAGES),
		];

		this.model.optionSelected = optionDefault;
		this.searchArticleFieldsDetails();
	}

	changeOption(option) {
		this.kMessageService.hide();

		this.catalogArticlesFactory.lookingForChangesInImagesSection(this.model);
		if(option.id !== this.model.optionSelected.id){
			if(this.model.mapValueChange.size === 0){
				this.forceChangeOption(option);
			}else{
				//Valicadiones para el registro sanitario
				if(this.model.mapValueChange.size === 1 &&
					this.model.mapValueChange.get(this.appConstant.TAG_TIENE_REG_SAN) !== undefined &&
					this.model.fieldsMap[this.appConstant.TAG_TIENE_REG_SAN].valorActual === undefined){
					this.forceChangeOption(option);
				}else{
					this.confirmChangeOption(option);
				}
			}
		}
	}

	confirmChangeOption(option){
		this.kModalService.showConfirm({
			scopeClass: this,
			message: this.kMessageService.renderMessage('changeFieldsOption'),
			acceptFn: () => {
				this.forceChangeOption(option);
			},
			cancelFn: () => {},
			size: this.kModalService.MODAL_SIZE.SMALL,
			btnAceptLabel: 'Si',
			btnCancelLabel: 'No'
		});
	}

	forceChangeOption(option){
		this.catalogArticlesFactory.resetEditValues(this.model);
		this.model.optionSelected = option;
		if(option.id > 0){
			this.searchArticleFieldsDetails();
		}
	}

	searchArticleFieldsDetails(){
		if(this.model.fieldsMap.size === 0 ||
			!this.model.fieldsMap[this.catalogArticlesFactory.returnSearchCriteryBySectionId(this.model.optionSelected.id)]){
			this.kLoadingService.show(null, '.k-layout');
			let defer = this.$q.defer();
			let promise = defer.promise;

			this.catalogArticlesFactory.searchArticleFieldsDetails(this.model, defer);
			promise.then(() => {
				this.catalogArticlesFactory.prepareImgForEditArticle(this.model);
				if(this.model.optionSelected.id === this.appConstant.ID_SECCION_REG_SANITARIO){
					this.catalogArticlesFactory.prepareSanRegForEditArticle(this.model);
				}
				//Logica para datos basicos
				if(this.model.optionSelected.id === this.appConstant.ID_SECCION_DATOS_BASICOS && this.model.editArticle){
					this.catalogArticlesFactory.searchFieldLabelOnList(this.model.fieldsMap[this.appConstant.TAG_UNIDAD_MEDIDA]);
					this.catalogArticlesFactory.searchFieldLabelOnList(this.model.fieldsMap[this.appConstant.TAG_PAISES]);
				}

				//Logica para datos complementarios
				if(this.model.optionSelected.id === this.appConstant.ID_SECCION_COMPLEMENTARIOS && this.model.editArticle){
					this.catalogArticlesFactory.searchFieldLabelOnList(this.model.fieldsMap[this.appConstant.TAG_DEDUCIBLE]);
					this.catalogArticlesFactory.searchFieldLabelOnList(this.model.fieldsMap[this.appConstant.TAG_COMPUESTO_TRANSG]);
				}

				this.kLoadingService.hide();
			},((message) => {
				this.kLoadingService.hide();
				this.kMessageService.showError(message);
			}));
		}else{
			this.catalogArticlesFactory.regSanInit(this.model);
		}
	}
}

export default SidebarEditController;
