/**
 * Created by igarces on 18/05/2016.
 */

class FiltersSearchArticlesModel {

	constructor() {
		this.codigoBarras =  null;
		this.descripcionArticulo = null;
		this.codigoReferencia = null;
		this.listaClasificaciones = null;
		this.codigoCompania = null;
		this.codigoProveedor = null;
		this.numeroPagina = null;
		this.estado = null;
		this.exigeRegSanitario = null;
		this.codigoRegSanitario = null;
		this.fechaCaducidad = null;
		this.mostrarCaducados = null;
		this.colCodigoBarras = [];
		this.tieneBloqueoFlux = null;
	}
}

export default FiltersSearchArticlesModel;
