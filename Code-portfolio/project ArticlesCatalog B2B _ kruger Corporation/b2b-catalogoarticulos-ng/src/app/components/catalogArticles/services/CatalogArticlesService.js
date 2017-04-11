class CatalogArticlesService {

	/*@ngInject*/
	constructor(kHttpService) {
		this._kHttpService = kHttpService;
		this._baseUrl = 'administracionArticulos/';
		this._baseUrlComparisonPrices = 'comparacionPreciosArticulo/';
		this.config = {
			headers: {
				'Accept': 'application/json; charset=utf-8'
			},
			timeout: 200000,
			//timeout: new Promise(() = > {})
		};
	}

	searchArticles(params) {
		return this._kHttpService.b2BCatArtWs.post(`${this._baseUrl}buscarArticulos`, params, this.config);
	}

	searchClassificationFilters(params) {
		return this._kHttpService.b2BCatArtWs.get(`${this._baseUrl}buscarFiltroClasificacion`, params, this.config);
	}

	searchArticleFieldsDetails(params) {
		return this._kHttpService.b2BCatArtWs.get(`${this._baseUrl}buscarArticuloPorProveedor`, params, this.config);
	}

	searchUserRol(params) {
		return this._kHttpService.b2BCatArtWs.get(`${this._baseUrl}buscarRolesUsuario`, params, this.config);
	}

	searchArticleImage(params) {
		return this._kHttpService.b2BCatArtWs.get(`${this._baseUrl}downloadArticleImage`, params, {responseType: 'arraybuffer'});
	}

	downloadExcel(params) {
		return this._kHttpService.b2BCatArtWs.post(`${this._baseUrl}downloadExcel`, params, {responseType: 'arraybuffer'});
	}

	uploadExcelSearch(data) {
		let config = {
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined}
		};
		return this._kHttpService.b2BCatArtWs.post(`${this._baseUrl}uploadExcelSearch`, data, config);
	}

	uploadExcelUpdate(data) {
		let config = {
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined}
		};
		return this._kHttpService.b2BCatArtWs.post(`${this._baseUrl}uploadExcelUpdate`, data, config);
	}

	uploadExcelPricesComparisson(data){
		let config = {
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined}
		};
		return this._kHttpService.b2BCatArtWs.post(`${this._baseUrlComparisonPrices}uploadExcelCP`, data, config);
	}

	saveArticlesData(params) {
		return this._kHttpService.b2BCatArtWs.post(`${this._baseUrl}guardarDatosArticulo`, params, this.config);
	}

	searchImageById(params) {
		return this._kHttpService.b2BCatArtWs.get(`${this._baseUrl}downloadImageById`, params, this.config);
	}

	searchComparisonPricesArticles(params) {
		return this._kHttpService.b2BCatArtWs.post(`${this._baseUrlComparisonPrices}obtenerComparacionPreciosArticulos`,
			params, this.config);
	}

	saveComparisonPricesArticles(params) {
		return this._kHttpService.b2BCatArtWs.post(
			`${this._baseUrlComparisonPrices}guardarDatosComparacionPreciosArticulo`, params, this.config);
	}

	sendComparisonPricesArticles(params) {
		return this._kHttpService.b2BCatArtWs.post(
			`${this._baseUrlComparisonPrices}enviarDatosComparacionPreciosArticulo`, params, this.config);
	}

	getHistorialComparisonPricesArticles(params) {
		return this._kHttpService.b2BCatArtWs.get(`${this._baseUrlComparisonPrices}obtenerHistorialComparacionPreciosArticulos`,
			params, this.config);
	}

	searchSanitaryRegisterRecord(params) {
		return this._kHttpService.b2BCatArtWs.get(`${this._baseUrl}buscarHistorialRegistroSanitario`, params, this.config);
	}

	searchFileContent(params){
		return this._kHttpService.b2BCatArtWs.get(`${this._baseUrl}downloadArchivoSolicitado`, params, this.config);
	}

	getArticlesToSend(params) {
		return this._kHttpService.b2BCatArtWs.get(`${this._baseUrlComparisonPrices}obtenerBitacorasEnviar`,	params,
			this.config);
	}

	getAutorizacionUpdate(params){
		return this._kHttpService.b2BCatArtWs.get(`${this._baseUrl}obtenerCatalogoCamposAtributoFrom`,	params,
			this.config);
	}

	progressUpdate(params) {
		return this._kHttpService.b2BCatArtWs.get(`${this._baseUrl}progresoUpdate`, params, this.config);
	}
}

export default CatalogArticlesService;
