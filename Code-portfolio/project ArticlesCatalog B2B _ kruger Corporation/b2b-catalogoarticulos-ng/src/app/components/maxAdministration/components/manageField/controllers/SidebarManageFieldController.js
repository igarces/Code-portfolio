import SidebarOptionsModel from '../../../../common/models/SidebarOptionsModel';

class SidebarManageFieldController {

	constructor(maxAdministrationFactory, maxAdministrationModel, appConstant, kLoadingService, kMessageService, $q, $state,
				kModalService) {
		'ngInject';
		this.maxAdministrationFactory = maxAdministrationFactory;
		this.model = maxAdministrationModel;
		this.appConstant = appConstant;
		this.kMessageService = kMessageService;
		this.kLoadingService = kLoadingService;
		this.$q = $q;
		this.$state = $state;
		this.kModalService = kModalService;

		this.model.sidebarOptions = [];
		this.model.selectedOption = null;

		this.model.codigoCompania = this.$state.params.pCodComp;
		this.model.userId = this.$state.params.pUserId;
		this.model.codigoFuncionario = this.$state.params.pCodFuncionario;
		this.model.codigoPerfil = this.$state.params.pCodPerfil;

		this.sidebarOptionsDetails();
	}

	sidebarOptionsDetails(){
		this.kLoadingService.show(null, '.k-layout');

		let defer = this.$q.defer();
		let promise = defer.promise;

		this.maxAdministrationFactory.searchFields(this.model, defer);

		promise.then((data) => {

			let defaultOption;
			for(let index in data){
				if(data[index]){
					let section = data[index];

					let imageSection = this.getImageByStyle(section.estilo);
					let option = new SidebarOptionsModel(section['@id'].codigoCatalogoCampoArticuloSeccion,
						section.nombreSeccion, imageSection, section.catalogoCamposArticuloCol);

					for(let jindex in option.list){
						if(option.list[jindex]){
							if(option.list[jindex].catalogoCampoArticuloHijosCol !== null &&
								option.list[jindex].catalogoCampoArticuloHijosCol.length > 0){
								option.list[jindex]['desplegar'] = true;
							}
						}

						if(option.list[jindex].atributoFrom === this.appConstant.TAG_COMPUESTO_TRANSG){
							option.list[jindex].catalogoCampoArticuloHijosCol = [];
							option.list[jindex].catalogoCampoArticuloHijosCol.push(option.list[Number(jindex) + 1]);
							option.list[jindex]['desplegar'] = true;
						}	
					}

					this.model.sidebarOptions.push(option);

					if(index === '0' || index === 0){
						defaultOption = option;
					}
				}
			}
			this.searchFieldList(defaultOption);
			this.kLoadingService.hide();

		}, ((message) => {
			this.kLoadingService.hide();
			this.kMessageService.showError(message);
		}));
	}

	getImageByStyle(style){
		switch (style){
			case 'datGen':
				return this.appConstant.IMG_ICON_DAT_GEN;
			case 'datBas':
				return this.appConstant.IMG_ICON_DAT_BAS;
			case 'datProv':
				return this.appConstant.IMG_ICON_PROVEEDORES;
			case 'datImg':
				return this.appConstant.IMG_ICON_IMAGES;
			case 'datMerc':
				return this.appConstant.IMG_ICON_MERCANCIAS;
			case 'datRegSan':
				return this.appConstant.IMG_ICON_REG_SAN;
			case 'datComp':
				return this.appConstant.IMG_ICON_COMPLEMENTARIOS;
		}
	}

	changeSection(option){
		this.changedFieldsList = this.maxAdministrationFactory.checkChangesFieldsData(this.model);

		if(this.changedFieldsList.length > 0){
			this.kLoadingService.hide();

			this.kModalService.showConfirm({
				scopeClass: this,
				message: this.kMessageService.renderMessage('changeFieldsOption'),
				acceptFn: () => {
					this.searchFieldList(option);
				},
				cancelFn:  () => {},
				size: this.kModalService.MODAL_SIZE.SMALL,
				btnAceptLabel: 'Si',
				btnCancelLabel: 'No'
			});
		}else{
			this.searchFieldList(option);
		}
	}

	searchFieldList(option) {
		this.model.selectedOption = option;
		//Clone the original list of fields
		this.model.fieldsList = JSON.parse(JSON.stringify(option.list));
	}
}

export default SidebarManageFieldController;
