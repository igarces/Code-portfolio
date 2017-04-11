class MaxAdministrationFactory {

    constructor(maxAdministrationService, kConstantFactory, actionsLayout){
      'ngInject';
      this.maxAdministrationService = maxAdministrationService;
      this._kConstantFactory = kConstantFactory;
      this._layoutActions = actionsLayout;
    }

    static instance(maxAdministrationService, kConstantFactory, actionsLayout) {
      'ngInject';
      return new MaxAdministrationFactory(maxAdministrationService, kConstantFactory, actionsLayout);
    }

	searchFields(model, promise1){
		let params = {
			codigoCompania: model.codigoCompania,
			codigoFuncionario: model.codigoFuncionario,
			codigoPerfil: model.codigoPerfil
		};
		return this.maxAdministrationService.searchFields(params)
			.success((data)=>{
				promise1.resolve(data);
			})
			.error((message) => {
				promise1.reject(message);
			});
	}

	checkChangesFieldsData(model){
		let changedFieldsList = [];
		let fieldList = JSON.parse(JSON.stringify(model.fieldsList));
		let originalFieldList = JSON.parse(JSON.stringify(model.selectedOption.list));
		let index = 0;
		while(index < fieldList.length){
			if(fieldList[index]){
				let changedField = fieldList[index];
				let originalField = originalFieldList[index];

				if(changedField['@id'].codigoCatalogoCamposArticulo === originalField['@id'].codigoCatalogoCamposArticulo){
					if(changedField.valorTipoModificacionCampo !== originalField.valorTipoModificacionCampo ||
						changedField.npValorModificacionAutorizacion !== originalField.npValorModificacionAutorizacion ||
						changedField.estado !== originalField.estado ||
						changedField.observacion !== originalField.observacion){

						changedField.idUsuarioModificacion = model.userId;
						if(changedField.desplegar !== undefined){
							delete(changedField.desplegar);
						}
						changedFieldsList.push(changedField);
					}
				}else{
					alert('No sirve esto');
				}
				if(changedField.catalogoCampoArticuloHijosCol && changedField.catalogoCampoArticuloHijosCol.length > 0){
					fieldList = fieldList.concat(changedField.catalogoCampoArticuloHijosCol);
					originalFieldList = originalFieldList.concat(originalField.catalogoCampoArticuloHijosCol);
					changedField.catalogoCampoArticuloHijosCol = null;
				}
			}
			index++;
		}
		return changedFieldsList;
	}

	saveChangedFields(changedFieldsList, model, promise1){
		return this.maxAdministrationService.saveChangedFields(changedFieldsList)
			.success((message)=>{
				//Clone the original list whit the new changes
				model.selectedOption.list = JSON.parse(JSON.stringify(model.fieldsList));

				promise1.resolve(message);
			})
			.error((message) => {
				promise1.reject(message);
			});
	}
}

export default MaxAdministrationFactory;
