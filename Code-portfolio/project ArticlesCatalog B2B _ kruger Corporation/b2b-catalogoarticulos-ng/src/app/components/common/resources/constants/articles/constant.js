export default {
	IMG_BUTTON_HOME: 'assets/img/button-home.gif',
	IMG_BUTTON_EDIT: 'assets/img/button-edit.gif',
	IMG_BUTTON_CANCEL: 'assets/img/button-cancel.gif',
	IMG_BUTTON_SAVE: 'assets/img/button-save.gif',
	IMG_BUTTON_BACK: 'assets/img/button-back.gif',
	IMG_BUTTON_SEND_SAVE: 'assets/img/button-send-save.gif',
	IMG_BUTTON_UPDATE: 'assets/img/button-update.gif',

	IMG_LOGO_ADM_ARTICLES: 'assets/img/logo-admArticles.gif',

	IMG_ICON_ACTIVE: 'assets/img/icon-active.gif',
	IMG_ICON_INACTIVE: 'assets/img/icon-inactive.gif',
	IMG_ICON_DOWNLOAD: 'assets/img/icon-download.png',
	IMG_ICON_DETAILS: 'assets/img/icon-details.gif',
	IMG_ICON_DAT_GEN: 'assets/img/icon-datGen.gif',
	IMG_ICON_DAT_BAS: 'assets/img/icon-datBas.gif',
	IMG_ICON_PROVEEDORES: 'assets/img/icon-proveedores.gif',
	IMG_ICON_COMPLEMENTARIOS: 'assets/img/icon-complementarios.gif',
	IMG_ICON_MERCANCIAS: 'assets/img/icon-mercancias.png',
	IMG_ICON_REG_SAN: 'assets/img/icon-regSan.png',
	IMG_ICON_IMAGES: 'assets/img/icon-imgArt.gif',
	IMG_ICON_ETIQUETADO: 'assets/img/icon-etiquetado.png',
	IMG_ICON_UPLOAD: 'assets/img/icon-upload.png',
	IMG_ICON_INFO_AUT: 'assets/img/icon-info-aut.png',
	IMG_ICON_CLEAN: 'assets/img/icon-clean.gif',
	IMG_ICON_TICK: 'assets/img/icon-tick.png',
	IMG_ICON_REMOVE: 'assets/img/icon-remove.gif',
	IMG_ICON_ADD: 'assets/img/icon-add.gif',
	IMG_ICON_DOWNLOAD_EXCEL: 'assets/img/icon-downloadExcel.gif',
	IMG_ICON_UPLOAD_EXCEL: 'assets/img/icon-uploadExcel.gif',
	IMG_ICON_WARNING: 'assets/img/icon-warning.gif',
	IMG_ICON_INFORMATION: 'assets/img/icon-information.png',
	IMG_ICON_HISTORIAL_PRICES: 'assets/img/icon_historial_price.png',
	IMG_ICON_UP_ARROW: 'assets/img/icon-up.gif',
	IMG_ICON_DOWN_ARROW: 'assets/img/icon-down.gif',
	IMG_ICON_SHOW_COLUMN: 'assets/img/icon-show-column.png',
	IMG_ICON_HIDE_COLUMN: 'assets/img/icon-hide-column.png',
	IMG_ICON_SEARCH: 'assets/img/icon-search.gif',
	IMG_ICON_BLOCK: 'assets/img/icon-block.gif',
	IMG_ICON_FLUX: 'assets/img/icon-flux.gif',

	ESTADO_ACTVO: '1',
	ESTADO_INACTIVO: '0',

	ESTADO_ACTIVO_NUM: 1,
	ESTADO_INACTIVO_NUM: 0,

	ESTADO_ACT_LITERAL: 'ACT',
	ESTADO_INACT_LITERAL: 'INA',

	ARTICLES_GRID_PAGE_SIZE: 20,

	FILE_SIZE: '4MB',

	CATALOGO_CODIGO_NO_APLICA: 217,
	CATALOGO_VALOR_NO_APLICA: 'NA',

	TIPO_MODIFICACION_CAMPO_LECTURA: 'LEC',
	TIPO_MODIFICACION_CAMPO_EDITABLE: 'EDIT',
	TIPO_MODIFICACION_CAMPO_SIN_AUTORIZACION: 'MSA',
	TIPO_MODIFICACION_CAMPO_CON_AUTORIZACION: 'MCA',

	//Tags seccion Datos Generales
	TAG_COD_BARRAS: 'articulo.codigoBarras',
	TAG_DESCRICION_ART: 'articulo.descripcionArticulo',
	TAG_ESTADO_ART: 'estadoArticuloProveedor',
	TAG_FECHA_CREACION_ART: 'articulo.fechaCreacion',
	TAG_SUBBODEGA: 'articulo.clasificacionDTO.bodegaDTO.descripcionBodega',
	TAG_CLASIFICACION: 'articulo.clasificacionDTO',
	TAG_SUBCLASIFICACION: 'articulo.subClasificacionDTO',
	TAG_ESTADO_COD: 'articulo.estadoTipoArticulo.estadoCodificacionArticuloDTO.descripcion',
	TAG_CLASE_ARTICULO: 'articulo.claseArticuloDTO',
	TAG_CAUSAL: 'articulo.articuloClaseDTO',

	//Tags seccion Datos Basicos
	TAG_CANTIDAD_MEDIDA: 'articulo.articuloMedidaDTO.cantidadMedida',
	TAG_UNIDAD_MEDIDA: 'articulo.articuloMedidaDTO.valorTipoMedida',
	TAG_PAISES: 'articulo.articuloComercialDTO.codigoPaisOrigen',
	TAG_TAMANO: 'articulo.articuloMedidaDTO.referenciaMedida',
	TAG_PRESENTACION: 'articulo.articuloMedidaDTO.presentacion',
	TAG_MARCACOMERCIAL: 'articulo.articuloComercialDTO.marcaComercialArticulo.nombre',
	TAG_IMPUESTOS: 'articulo.articuloImpuestoCol',
	TAG_DESCUESTOS: 'descuentoProveedorArticuloCol',
	TAG_COSTO_BRUTO: 'costoBruto',

	//Tags seccion Datos Proveedor
	TAG_CONVENIOINDICADOR: 'articulo.indicadorI',
	TAG_REFERENCIA_PROVEEDOR: 'codigoReferenciaProveedor',
	TAG_DESCRIPCION_PROVEEDOR: 'descripcionArticulo',
	TAG_UNIDAD_MANEJO: 'unidadesManejo',

	//Tags seccion Datos Complementarios
	TAG_DEDUCIBLE: 'articulo.articuloComercialDTO.valorTipoDeducible',
	TAG_VERIFICA_TRANSG: 'articulo.aplicaTransgenico',
	TAG_COMPUESTO_TRANSG: 'articulo.valorEstadoTransgenico',
	TAG_SEMAFORO: 'articulo.articuloEtiquetaCol',
	TAG_IMGAGEN_TANSG: 'articulo.articuloDefinicionArchivoCol/IJT',

	//Tags seccion Imagenes
	TAG_IMAGEN_GENERAL: 'articulo.articuloDefinicionArchivoCol/IGE',
	TAG_IMAGEN_COD_BARRAS: 'articulo.articuloDefinicionArchivoCol/ICB',

	//Tags seccion registro sanitario
	TAG_APLICA_REG_SAN: 'articulo.valorAplicaRegistroSanitario',
	TAG_TIENE_REG_SAN: 'esConfirmadoRegistroSanitario',
	TAG_OBSERVACION_REG_SAN: 'observacionRegistroSanitario',
	TAG_REG_SAN: 'articulo.registroSanitarioCol',
	TAG_NUM_REG_SAN: 'registroSanitario.registroSanitario',
	TAG_FECHA_CADUCIDAD_REG_SAN: 'registroSanitario.fechaCaducidadRegistroSanitario',
	TAG_MATERIAL_ENVASE: 'registroSanitario.materialEnvase',
	TAG_FECHA_EMISION_REG_SAN: 'registroSanitario.fechaEmision',
	TAG_PAIS_REG_SAN: 'registroSanitario.ciudadPais',
	TAG_TAMANO_REG_SAN: 'registroSanitario.referenciaMedida',
	TAG_MARCA_REG_SAN: 'registroSanitario.marca',
	TAG_IMAGEN_REG_SAN: 'registroSanitario.artDefArcCol/IRS',
	TAG_DOC_REG_SAN: 'registroSanitario.artDefArcCol/DRS',

	//Tags seccion Datos mercancias
	TAG_DATOS_GARANTIA: 'articulo.articuloGarantiaDTO',
	TAG_CARACTERISTICAS: 'articulo.caracteristicaDTOSet',

	ID_SECCION_DATOS_BASICOS: '2',
	ID_SECCION_PROVEEDOR: '3',
	ID_SECCION_COMPLEMENTARIOS: '4',
	ID_SECCION_IMAGENES: '5',
	ID_SECCION_REG_SANITARIO: '6',
	ID_SECCION_DATOS_MERCANCIAS: '7',

	CRITERIO_BUSQUEDA_SEC_DATOS_BASICOS: 'articulo.codigoBarras',
	CRITERIO_BUSQUEDA_SEC_PROVEEDOR: 'codigoReferenciaProveedor',
	CRITERIO_BUSQUEDA_SEC_COMPLEMENTARIOS: 'articulo.articuloComercialDTO.valorTipoDeducible',
	CRITERIO_BUSQUEDA_SEC_IMAGENES: 'articulo.articuloDefinicionArchivoCol/IGE',
	CRITERIO_BUSQUEDA_SEC_REG_SAN: 'articulo.registroSanitarioCol',

	//ROLES DE USUARIO NECESARIOS EN ADMINISTRACION DE ARTICULOS
	ROL_USER_COMPARACION_PRECIO: 'ROLFORSYNC669',
	ROL_USER_ADMIN_ARTICULOS: 'B2BARTICULOS',

	//TIPOS IMAGENES ARTICULOS
	TIPO_IMAGEN_GENERAL_ARTICULO: 'IGE',
	TIPO_IMAGEN_DOC_JUSTIFICACION_NO_TRANSG: 'IJT',
	TIPO_IMAGEN_CODIGO_BARRAS: 'ICB',
	TIPO_IMAGEN_REG_SAN: 'IRS',
	TIPO_IMAGEN_DOC_REG_SAN: 'DRS',

	//CATALOGO PARA EL REGISTRO SANITARIO
	VALOR_APLICA_REGISTRO_SANITARIO: 'SA',
	VALOR_NO_APLICA_REGISTRO_SANITARIO: 'NA',
	VALOR_NUNCA_APLICA_REGISTRO_SANITARIO: 'NCA',

	//dynamic features of the article
	CARACT_VALIDACION_REG_SAN: 'VRS',
	CARACT_VALIDACION_ETIQUETAS: 'VSE',
	CARACT_VALIDACION_TIENE_GARANTIA: 'TG',
	CARACT_VALIDACION_TIENE_PRESENTACIONES: 'TP',

	//catalogo estado campo articulo solicitud
	ESTADO_SOLICITUD_PENDIENTE: 'PEN',
	ESTADO_SOLICITUD_APROBAR: 'APR',
	ESTADO_SOLICITUD_RECHAZAR: 'RCH',
	ESTADO_SOLICITUD_NO_GESTIONAR: 'NGE',

	//Decimal digits
	NUMBER_DECIMAL_DIGITS: 4,

	//Tipos de precios para la comparacion de precios
	TIPO_PRECIO_PVP: 'PVP',
	TIPO_PRECIO_COSTO_NETO: 'CSN',
	TIPO_PRECIO_UNIDAD_MANEJO: 'UNM',
	TIPO_PRECIO_IVA: 'IVA',
	TIPO_PRECIO_IVE: 'IVE',

	CAMPO_VALUE_NINGUNO: 'null',
	CAMPO_VALUE_NO_DISPONIBLE: 'N/D',
	TIPO_CARACTERISTICA_TECNICA: 1,

	//Codigo tipo descuentos
	COD_TIPO_DESC_PPRO: '5',
	COD_TIPO_DESC_DOCDE: '6',
	COD_TIPO_DESC_DSCTO_OFE: '10'
};
