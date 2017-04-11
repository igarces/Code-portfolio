/**
 * Created by igarces on 31/08/2016.
 */
class ModalShowCharacteristicController{
	constructor($uibModalInstance, characteristicsList){
		this.$uibModalInstance = $uibModalInstance;
		this.characteristicsList = characteristicsList;
	}

	close(){
		this.$uibModalInstance.dismiss(this);
	}
}
export default ModalShowCharacteristicController;
