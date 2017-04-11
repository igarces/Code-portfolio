/**
 * Created by igarces on 23/08/2016.
 */
import characteristicTableTpl from './characteristicsTableDirective.tpl';

class CharacteristicsTableDirective {
	constructor(kConstantFactory) {
		this.kConstantFactory = kConstantFactory;

		let directive = {
			restrict: 'E',
			transclude: true,
			templateUrl: characteristicTableTpl.name,
			scope: {
				list: '=?'
			},
			link: this.link.bind(this)
		};

		return directive;
	}

	static instance(kConstantFactory) {
		'ngInject';
		return new CharacteristicsTableDirective(kConstantFactory);
	}

	link(scope) {
		scope.appConstant = this.kConstantFactory.$getConstantSync('articles');
	}
}

export default CharacteristicsTableDirective;
