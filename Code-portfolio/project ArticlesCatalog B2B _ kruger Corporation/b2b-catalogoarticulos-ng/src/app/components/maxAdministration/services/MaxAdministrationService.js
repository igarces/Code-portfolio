class MaxAdministrationService {
	/*@ngInject*/
	constructor(kHttpService) {
		this._kHttpService  = kHttpService;
		this._baseUrl = 'administracionCamposArticulo/';

		this.config = {
			headers: {
				'Accept': 'application/json; charset=utf-8'
			},
			timeout: 200000,
			//timeout: new Promise(() => {})
		};
	}

	searchFields(params){
		return this._kHttpService.b2BCatArtWs.get(`${this._baseUrl}obtenerCatalogoCamposArticuloSeccion`, params, this.config);
	}

	saveChangedFields(params){
		return this._kHttpService.b2BCatArtWs.post(`${this._baseUrl}guardarCatalogoCamposArticulo`, params, this.config);
	}

}

export default MaxAdministrationService;
