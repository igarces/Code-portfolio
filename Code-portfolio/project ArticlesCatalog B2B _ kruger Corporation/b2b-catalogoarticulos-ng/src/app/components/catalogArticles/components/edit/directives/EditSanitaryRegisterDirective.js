import EditSanitaryRegisterDirectiveTpl from './EditSanitaryRegisterDirectiveTemplate.tpl';


class EditSanitaryRegisterDirective {
	constructor(kConstantFactory, catalogArticlesFactory, $filter) {
		this.kConstantFactory = kConstantFactory;
		this.catalogArticlesFactory = catalogArticlesFactory;
		this.$filter = $filter;
		this.constants = null;

		let directive = {
			restrict: 'E',
			transclude: true,
			templateUrl: EditSanitaryRegisterDirectiveTpl.name,
			scope: {
				model: '=?',
				tag: '=?',
				editable: '@'
			},
			link: this.link.bind(this)
		};

		return directive;
	}

	static instance(kConstantFactory, catalogArticlesFactory, $filter) {
		'ngInject';
		return new EditSanitaryRegisterDirective(kConstantFactory, catalogArticlesFactory, $filter);
	}

	link(scope) {
		scope.appConstant = this.kConstantFactory.$getConstantSync('articles');
		this.constants = scope.appConstant;
		this.model = scope.model;
		scope.function = this;
	}

	/**
	 * search for label to show when the value is a code of a Value Catalog
	 */
	searchFieldLabel(field){
		if(field.valorActual[this.model.selectedSanitaryRegister]){
			return field.valorActual[this.model.selectedSanitaryRegister];
		}else{
			return 'N/D';
		}
	}

	/**
	 * search for label to show when the value is a code of a Value Catalog
	 */
	searchLabelDemandValue(field, tag){
		if(tag === this.constants.TAG_FECHA_CADUCIDAD_REG_SAN || 
			tag === this.constants.TAG_FECHA_EMISION_REG_SAN ){
			return this.$filter('date')(field.valorSolicitado[this.model.selectedSanitaryRegister], "yyyy-MM-dd");
		}

		if(field.valorSolicitado[this.model.selectedSanitaryRegister] === this.constants.CAMPO_VALUE_NINGUNO){
			return 'Ninguno';
		}else{
			return field.valorSolicitado[this.model.selectedSanitaryRegister];
		}
	}
}

export default EditSanitaryRegisterDirective;
