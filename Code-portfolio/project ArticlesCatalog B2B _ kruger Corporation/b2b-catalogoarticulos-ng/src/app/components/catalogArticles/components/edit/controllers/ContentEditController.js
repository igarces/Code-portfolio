import optionGeneralArticleData from '../views/optionGeneralArticleData.tpl';
import optionBasicData from '../views/optionBasicData.tpl';
import optionProvider from '../views/optionProvider.tpl';
import optionComplementary from '../views/optionComplementary.tpl';
import optionImages from '../views/optionImages.tpl';
import optionSanitaryRegister from '../views/optionSanitaryRegister.tpl';
import optionMerchandiseData from '../views/optionMerchandiseData.tpl';
import modalShowCharacteristics from '../views/modalShowCharacteristic.tpl';

class ContentEditController {

	constructor(actionsLayout, catalogArticlesFactory, catalogArticlesModel, appConstant, kMessageService, $uibModal) {
		'ngInject';
		actionsLayout.renderLeft(true);
		this.catalogArticlesFactory = catalogArticlesFactory;
		this.model = catalogArticlesModel;
		this.appConstant = appConstant;
		this.kMessageService = kMessageService;
		this.$uibModal = $uibModal;

		//page url for include
		this.pageArticleData = optionGeneralArticleData.name;
		this.pageOptionBasicData = optionBasicData.name;
		this.pageOptionProvider = optionProvider.name;
		this.pageOptionComplementary = optionComplementary.name;
		this.pageOptionImages = optionImages.name;
		this.pageOptionSanitaryRegister = optionSanitaryRegister.name;
		this.pageOptionMerchandiseData = optionMerchandiseData.name;

		this.model.requiredSanReg = false;
		this.list = [];
	}

	/**
	 * search for label to show when the value is a code of a Value Catalog
	 */
	searchFieldLabelOnList(tag){
		let field = this.model.fieldsMap[tag];
		return this.catalogArticlesFactory.searchFieldLabelOnList(field);
	}

	/**
	 * save the edit field in a Map
	 */
	changeValueEvent(tag){
		let field = this.model.fieldsMap[tag];
		this.catalogArticlesFactory.changeValueEvent(field, tag, this.model);

		if (tag === this.appConstant.TAG_TIENE_REG_SAN &&
			this.model.fieldsMap[this.appConstant.TAG_REG_SAN].valorActual.length === 1 &&
			this.model.selectedSanitaryRegister === 0) {
			if(this.model.fieldsMap[this.appConstant.TAG_TIENE_REG_SAN].valorNuevo){
				this.catalogArticlesFactory.fillSanRegFields(this.model);
			}else{
				this.model.mapValueChange.delete(this.appConstant.TAG_PAIS_REG_SAN);
				this.model.mapValueChange.delete(this.appConstant.TAG_TAMANO_REG_SAN);
			}
		}
	}

	/**
	 * search for label to show when the value is a code of a Value Catalog
	 */
	searchLabelDemandValue(field){
		return this.catalogArticlesFactory.searchLabelDemandValue(field);
	}

	searchLabelDemandValueSemaforo(field){
		if(field.valorSolicitado === '0'){
			return 'No';
		}

		if(field.valorSolicitado === '1'){
			return 'Si';
		}
	}

	requestedValueWarrantyData(){
		let label = null;
		if(this.model.fieldsMap[this.appConstant.TAG_DATOS_GARANTIA].valorSolicitado){

			let garantia = JSON.parse(this.model.fieldsMap[this.appConstant.TAG_DATOS_GARANTIA].valorSolicitado);
			label = 'Estado: ';
			if(garantia.estadoGarantia === this.appConstant.ESTADO_ACTVO){
				label += 'Activo';
			}else{
				label += 'Inactivo';
			}

			if(garantia.estadoGarantia === this.appConstant.ESTADO_ACTVO && garantia.tieMaxGarNor !== null){
				label += ', ' + 'Tiempo máximo: ' + garantia.tieMaxGarNor;
			}
		}
		return label;
	}

	addCharacteristics(){
		this.kMessageService.hide();
		let message = this.catalogArticlesFactory.validateCharacteristicsRequired(this.model);
		if(message === null){
			let characteristicsList = this.model.fieldsMap[this.appConstant.TAG_CARACTERISTICAS].valorNuevo;
			let description = null;
			if(characteristicsList === undefined || characteristicsList.length === 0){
				characteristicsList = [];
				description = this.model.fieldsMap[this.appConstant.TAG_DESCRICION_ART].valorActual;
			}
			let characteristic = {
				secuencialCaracteristica: null,
				description: description,
				status: this.appConstant.ESTADO_ACT_LITERAL,
				orden: characteristicsList.length + 1,
				codigoTipoCaracterstica: this.appConstant.TIPO_CARACTERISTICA_TECNICA
			};
			characteristicsList.push(characteristic);
			this.model.fieldsMap[this.appConstant.TAG_CARACTERISTICAS].valorNuevo = characteristicsList;
		}else{
			this.kMessageService.showError(message);
		}
	}

	removeCharacteristic(characteristic, position){
		let characteristicsListActual = this.model.fieldsMap[this.appConstant.TAG_CARACTERISTICAS].valorActual;

		if(characteristic.secuencialCaracteristica !== null){
			for(var index in characteristicsListActual){
				if(characteristicsListActual[index] &&
					characteristicsListActual[index].secuencialCaracteristica === characteristic.secuencialCaracteristica){
					characteristicsListActual[index].status = this.appConstant.ESTADO_INACT_LITERAL;
				}
			}
		}

		let characteristicsListNuevo = this.model.fieldsMap[this.appConstant.TAG_CARACTERISTICAS].valorNuevo;
		characteristicsListNuevo.splice(position, 1);
		this.restoreOrder(characteristicsListNuevo);
	}

	restoreOrder(characteristicsListNuevo){
		for(var index in characteristicsListNuevo){
			if(characteristicsListNuevo[index]){
				characteristicsListNuevo[index].orden = Number(index) + 1;
			}
		}
	}

	changeOrderUp(characteristic, position){
		let characteristicsListNuevo = this.model.fieldsMap[this.appConstant.TAG_CARACTERISTICAS].valorNuevo;
		characteristicsListNuevo.splice(position-1, 0, characteristic);
		characteristicsListNuevo.splice(position+1, 1);
		
		this.restoreOrder(characteristicsListNuevo);
	}

	changeOrderDown(characteristic, position){
		let characteristicsListNuevo = this.model.fieldsMap[this.appConstant.TAG_CARACTERISTICAS].valorNuevo;
		characteristicsListNuevo.splice(position, 1);
		characteristicsListNuevo.splice(position+1, 0, characteristic);

		this.restoreOrder(characteristicsListNuevo);
	}

	showCharacteristicModal(){
		if(this.model.fieldsMap[this.appConstant.TAG_CARACTERISTICAS].valorSolicitado){
			let characteristicsList = JSON.parse(this.model.fieldsMap[this.appConstant.TAG_CARACTERISTICAS].valorSolicitado);
			if(characteristicsList){
				this.$uibModal.open({
					animation: false,
					controller: 'modalShowCharacteristicController',
					controllerAs: 'modal',
					templateUrl: modalShowCharacteristics.name,
					size: 'md',
					windowClass: 'k-modal',
					resolve: {
						characteristicsList: (() => {
							return characteristicsList;
						}),
					}
				});
			}
		}
	}
}

export default ContentEditController;