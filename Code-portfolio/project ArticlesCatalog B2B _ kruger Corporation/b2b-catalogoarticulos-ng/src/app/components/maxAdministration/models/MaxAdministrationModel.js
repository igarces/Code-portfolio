import AppCommonModel from 'components/common/models/AppCommonModel';

class MaxAdministrationModel extends AppCommonModel{

	constructor() {
		super();
		this.sidebarOptions = [];
		this.selectedOption = null;
		this.fieldsList = [];
	}
}

export default MaxAdministrationModel;
