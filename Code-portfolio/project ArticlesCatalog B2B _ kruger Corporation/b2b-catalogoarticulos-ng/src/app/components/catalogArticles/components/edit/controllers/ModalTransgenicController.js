let _private = new WeakMap();

class ModalTransgenicController {

	/**
	 * ModalTransgenicController's constructor
	 *
	 * @param $uibModalInstance
	 */
	constructor($uibModalInstance) {
		// Get modal instance
		_private.set(this, {
			$uibModalInstance: $uibModalInstance
		});
	}

	/**
	 * Close modal that justify the articles isn't transgenic
	 */
	closeJustifyTransgenicPopUp() {
		// Close popUp
		_private.get(this).$uibModalInstance.dismiss(this);
	}
}

export default ModalTransgenicController;
