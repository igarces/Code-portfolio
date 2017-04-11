import EditDirectiveTpl from './EditDirectiveTemplate.tpl';

/*
* DIRECTIVA PARA MOSTRAR LOS CAMPOS DEL ARTICULO
* RECIBE 3 PARAMETROS{ model: modelo del modulo, tag: el tag del campo,
* 						editable: true (si es un campo de edición) o false (si es un campo de solo visualización) }
* Si editable = true, es obligatorio poner el campo de edición entre los tags de la directiva
*/
class EditDirective {
	constructor(kConstantFactory, catalogArticlesFactory, kMessageService) {
		this.kConstantFactory = kConstantFactory;
		this.catalogArticlesFactory = catalogArticlesFactory;
		this.constants = null;
		this.kMessageService = kMessageService;

		let directive = {
			restrict: 'E',
			transclude: true,
			templateUrl: EditDirectiveTpl.name,
			scope: {
				model: '=?',
				tag: '=?',
				editable: '@'
			},
			link: this.link.bind(this)
		};

		return directive;
	}

	static instance(kConstantFactory, catalogArticlesFactory, kMessageService) {
		'ngInject';
		return new EditDirective(kConstantFactory, catalogArticlesFactory, kMessageService);
	}

	link(scope) {
		scope.appConstant = this.kConstantFactory.$getConstantSync('articles');
		this.constants = scope.appConstant;
		scope.function = this;
	}

	/**
	 * search for label to show when the value is a code of a Value Catalog
	 */
	searchFieldLabel(field, tag){
		if(tag === this.constants.TAG_CANTIDAD_MEDIDA){
			field.valorNuevo = Number(field.valorNuevo).toFixed(2);
			return field.valorActual.toFixed(2);
		}

		if(tag === this.constants.TAG_DEDUCIBLE){
			let value = this.catalogArticlesFactory.searchFieldLabelOnList(field);
			if(value === this.constants.CAMPO_VALUE_NO_DISPONIBLE){
				return this.kMessageService.renderMessage('deleteValue');
			}else{
				return value;
			}
		}

		if(tag === this.constants.TAG_COMPUESTO_TRANSG && field.valorActual === undefined){
			return 'No aplica';
		}
			
		if(field.listSelectItemTrasient !== undefined && field.listSelectItemTrasient.length > 0){
			return this.catalogArticlesFactory.searchFieldLabelOnList(field);
		}else{
			if(field.valorActual === undefined){
				// return '-';
				return this.constants.CAMPO_VALUE_NO_DISPONIBLE;
			}else{
				return field.valorActual;
			}
		}
	}

	/**
	 * search for label to show when the value is a code of a Value Catalog
	 */
	searchLabelDemandValue(field){
		return this.catalogArticlesFactory.searchLabelDemandValue(field);
	}
}

export default EditDirective;
