class ModalShowImageController{
	constructor(fieldImage, newImage, sanitaryRegisterSelected, $uibModalInstance, imageToShow){
		this.fieldImage = fieldImage;
		this.newImage = newImage;
		this.sanitaryRegisterSelected = sanitaryRegisterSelected;
		this.$uibModalInstance = $uibModalInstance;
		this.imageToShow = imageToShow;
	}

	close(){
		this.$uibModalInstance.dismiss(this);
	}
}
export default ModalShowImageController;
