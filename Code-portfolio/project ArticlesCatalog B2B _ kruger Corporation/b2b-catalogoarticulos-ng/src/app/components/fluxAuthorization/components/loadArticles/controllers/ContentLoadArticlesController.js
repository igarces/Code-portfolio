class ContentLoadArticlesController {

	constructor(fluxAuthorizationFactory, $state, kMessageService, appConstant, kLoadingService, fluxAuthorizationModel,
				actionsLayout, $q, $location) {
		'ngInject';
		actionsLayout.renderLeft(false);
		this.$state = $state;
		this.$location = $location;
		this.$q = $q;
		this.kMessageService = kMessageService;
		this.kLoadingService = kLoadingService;
		this.model = fluxAuthorizationModel;
		this.fluxAuthorizationFactory = fluxAuthorizationFactory;
		this.appConstant = appConstant;

		let params = this.$location.search();
		this.model.processCode = params.pPC;
		this.model.userName = params.pU;
		this.model.userId = params.cU;
		this.model.workItemId = params.pWII;
		this.model.flowId = params.pFI;
		this.model.codigoCompania = params.pC;
		this.model.codigoAreaTrabajo = params.pWA;
		this.model.nombreAreaTrabajo = params.pWAN;

		// this.model.processCode = 'F17-51';
		// this.model.codigoCompania = 1;

		this.model.articlesList = [];
		this.searchFluxCaseArticles();
	}

	searchFluxCaseArticles(){
		this.kLoadingService.show(null, '.k-layout');
		let defer = this.$q.defer();
		let promise = defer.promise;

		this.fluxAuthorizationFactory.searchFluxCaseArticles(this.model, defer);

		promise.then(() =>{
			this.kLoadingService.hide();
		}, ((message) => {
			this.kLoadingService.hide();
			this.kMessageService.showError(message);
		}));
	}

	approveArticle(article) {
		this.model.articleToApprove = article;
		this.$state.go('fluxAuthorization.load.approve');
	}
}


export  default ContentLoadArticlesController;
