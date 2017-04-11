class ContentManageFieldController {

	constructor(maxAdministrationFactory, $state, kMessageService, appConstant, kLoadingService, maxAdministrationModel,
				actionsLayout, $q) {
		'ngInject';
		actionsLayout.renderLeft(true);
		this.$state = $state;
		this.kMessageService = kMessageService;
		this.kLoadingService = kLoadingService;
		this.model = maxAdministrationModel;
		this.maxAdministrationFactory = maxAdministrationFactory;
		this.appConstant = appConstant;
		this.$q = $q;

		this.model.codigoCompania = this.$state.params.pCodComp;
		this.model.userId = this.$state.params.pUserId;
		this.model.codigoFuncionario = this.$state.params.pCodFuncionario;
		this.model.codigoPerfil = this.$state.params.pCodPerfil;
	}

	/**
	 * Edit column event
	 */
	changeEditableRadio(field, fatherField = null){
		if(field.valorTipoModificacionCampo === this.appConstant.TIPO_MODIFICACION_CAMPO_LECTURA){
			field.npValorModificacionAutorizacion = null;
		}else{
			field.npValorModificacionAutorizacion = this.appConstant.TIPO_MODIFICACION_CAMPO_CON_AUTORIZACION;
		}
		this.changeRadioTransgenicEditable(field, fatherField);
	}

	/**
	 * Visualizar, Autorizar column event
	 */
	changeRadioPadre(field){
		this.changeRadioTransgenic(field);

		if(field.atributoFrom === this.appConstant.TAG_REG_SAN){
			for(let index in field.catalogoCampoArticuloHijosCol){
				if(field.catalogoCampoArticuloHijosCol[index]){
					let child = field.catalogoCampoArticuloHijosCol[index];
					child.estado = field.estado;
				}
			}
		}
	}

	/**
	 * Visualizar column in child table event
	 */
	changeRadioChild(fatherField){
		this.changeRadioTransgenicChild(fatherField);

		if(fatherField.atributoFrom === this.appConstant.TAG_REG_SAN){
			let flagActives = false;
			if(fatherField.estado === this.appConstant.ESTADO_ACTVO){
				for(let index in fatherField.catalogoCampoArticuloHijosCol){
					if(fatherField.catalogoCampoArticuloHijosCol[index]){
						let child = fatherField.catalogoCampoArticuloHijosCol[index];

						if(fatherField.estado === this.appConstant.ESTADO_ACTVO && child.estado === fatherField.estado){
							flagActives = true;
							break;
						}

						if(fatherField.estado !== this.appConstant.ESTADO_ACTVO && child.estado !== fatherField.estado){
							flagActives = true;
							break;
						}
					}
				}
			}
			if(!flagActives){
				if(fatherField.estado === this.appConstant.ESTADO_ACTVO){
					fatherField.estado = this.appConstant.ESTADO_INACTIVO;
				}else{
					fatherField.estado = this.appConstant.ESTADO_ACTVO;
				}
			}
		}
	}

	changeRadioTransgenicChild(fatherField){
		if(fatherField.atributoFrom === this.appConstant.TAG_COMPUESTO_TRANSG){
			
			let child = fatherField.catalogoCampoArticuloHijosCol[0];	

			if(child.estado === this.appConstant.ESTADO_ACTVO){
				fatherField.estado = this.appConstant.ESTADO_ACTVO;
				child.npValorModificacionAutorizacion = fatherField.npValorModificacionAutorizacion;
				child.valorTipoModificacionCampo = fatherField.valorTipoModificacionCampo;
			}	
		}
	}

	changeRadioTransgenic(fatherField){

		if(fatherField.atributoFrom === this.appConstant.TAG_COMPUESTO_TRANSG){
			
			let child = fatherField.catalogoCampoArticuloHijosCol[0];	

			if(fatherField.estado === this.appConstant.ESTADO_INACTIVO){
				child.estado = fatherField.estado;
			}
		
			if(child.estado === this.appConstant.ESTADO_ACTVO && fatherField.estado === this.appConstant.ESTADO_ACTVO){
			    child.npValorModificacionAutorizacion = fatherField.npValorModificacionAutorizacion;
				child.valorTipoModificacionCampo = fatherField.valorTipoModificacionCampo;
			}
		}
	}

	changeRadioTransgenicEditable(children, fatherField){

		if(fatherField === null){
			fatherField = children;

			if(fatherField.atributoFrom === this.appConstant.TAG_COMPUESTO_TRANSG){
				let child = fatherField.catalogoCampoArticuloHijosCol[0];	
				if(child.estado === this.appConstant.ESTADO_ACTVO && fatherField.estado === this.appConstant.ESTADO_ACTVO){
					child.npValorModificacionAutorizacion = fatherField.npValorModificacionAutorizacion;
					child.valorTipoModificacionCampo = fatherField.valorTipoModificacionCampo;
				}
			}
		}

		if(children.atributoFrom === this.appConstant.TAG_IMGAGEN_TANSG){
			if(children.valorTipoModificacionCampo !== this.appConstant.TIPO_MODIFICACION_CAMPO_LECTURA){
				fatherField.valorTipoModificacionCampo = children.valorTipoModificacionCampo; 
			}

			if(children.npValorModificacionAutorizacion !== this.appConstant.TIPO_MODIFICACION_CAMPO_CON_AUTORIZACION){
				fatherField.npValorModificacionAutorizacion = children.npValorModificacionAutorizacion; 
			}
		}
	}

	changeAutorizacionChild(children, fatherField){
		if(children.atributoFrom === this.appConstant.TAG_IMGAGEN_TANSG){
			
			if(children.npValorModificacionAutorizacion !== this.appConstant.TIPO_MODIFICACION_CAMPO_CON_AUTORIZACION){
				fatherField.npValorModificacionAutorizacion = children.npValorModificacionAutorizacion; 
			}
		}
	}


	showChildrenField(field){
		if(field.desplegar){
			field.desplegar = false;
		}else{
			field.desplegar = true;
		}
	}
}

export  default ContentManageFieldController;
