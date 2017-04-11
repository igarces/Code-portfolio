class FluxAuthorizationService {

	/*@ngInject*/
	constructor(kHttpService) {
		this._kHttpService = kHttpService;
		this._baseUrl = 'gestionCasosFlux/';
		this.config = {
			headers: {
				'Accept': 'application/json; charset=utf-8'
			},
			timeout: 200000,
			//timeout: new Promise(() = > {})
		};
	}

  	searchFluxCaseArticles(params){
		return this._kHttpService.b2BCatArtWs.get(`${this._baseUrl}buscarArticulosCasoFlux`, params, this.config);
	}

	saveFluxAuthorization(params){
		return this._kHttpService.b2BCatArtWs.post(`${this._baseUrl}guardarDatosAutorizacionArticulo`, params, this.config);
	}

	searchFileContent(params){
		return this._kHttpService.b2BCatArtWs.get(`${this._baseUrl}downloadFile`, params, this.config);
	}
}

export default FluxAuthorizationService;
