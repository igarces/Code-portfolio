class HeaderManageFieldController {
	constructor(appConstant, maxAdministrationModel, maxAdministrationFactory, kMessageService, kLoadingService, $q,
				kModalService) {
		'ngInject';
		this.appConstant = appConstant;
		this.model = maxAdministrationModel;
		this.maxAdministrationFactory = maxAdministrationFactory;
		this.kMessageService = kMessageService;
		this.kLoadingService = kLoadingService;
		this.$q = $q;
		this.kModalService = kModalService;

		this.changedFieldsList = [];
	}

	returnPageHome(){
		alert('va a la pagina inicial');
	}

	saveBottomClick(){
		this.kLoadingService.show(null, '.k-layout');
		this.changedFieldsList = this.maxAdministrationFactory.checkChangesFieldsData(this.model);

		if(this.changedFieldsList.length > 0){
			this.kLoadingService.hide();

			this.kModalService.showConfirm({
				scopeClass: this,
				message: this.kMessageService.renderMessage('saveFieldsConfirm'),
				acceptFn: this.saveChangedFields,
				cancelFn:  () => {},
				size: this.kModalService.MODAL_SIZE.SMALL,
				btnAceptLabel: 'Si',
				btnCancelLabel: 'No',
				html: true
			});

		}else{
			this.kLoadingService.hide();
			this.kMessageService.showInfo(this.kMessageService.renderMessage('noChangesToSave'));
		}
	}

	saveChangedFields(){
		this.kLoadingService.show(null, '.k-layout');
		let defer = this.$q.defer();
		let promise = defer.promise;

		this.maxAdministrationFactory.saveChangedFields(this.changedFieldsList, this.model, defer);

		promise.then((message) => {
			this.kLoadingService.hide();
			this.kMessageService.showSuccess(message);
		}, ((message) => {
			this.kLoadingService.hide();
			this.kMessageService.showError(message);
		}));
	}
}

export default HeaderManageFieldController;
