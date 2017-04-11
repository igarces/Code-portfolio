import FiltersSearchArticlesModel from './FiltersSearchArticlesModel';
import AppCommonModel from 'components/common/models/AppCommonModel';

class CatalogArticlesModel extends AppCommonModel {

	constructor() {
		super();
		this._events = [];

		this.eventSelected = {};

		//other variables
		this.editArticle = false;
		this.articleToEdit = null;
		this.optionSelected = null;
		this.reportOptionRol = null;
		this.selectedSanitaryRegister = null;
		this.requiredSanReg = false;
		this.providerName = null;
		this.filterValue = null;
		this.isOpenDiscount = false;
		this.imageTempIGE = null;
		this.imageTempICB = null;
		this.imageTempIJT = null;
		this.imageTempIRS = null;
		this.imageTempDRS = null;

		//Lists
		this.classificationsSelectedList = [];
		this.comparissonPricesList = [];
		this.discountList = [];
		this.discountUMList = [];
		//this.taxesPricesBitacora = [];
		this.historialPricesBitacora = [];

		//Maps
		this.fieldsMap = new Map();
		this.mapValueChange = new Map();
		this.dinamicFeatures = null;
		//this.taxesRates = new Map();
		this.comparissonPricesToSend = new Map();
		this.onlyChangeComparissonPrices = new Map();
		this.mapBitacorasExcel = null;

		//grid options
		this.gridOptionsArticles = null;
		this.griOptionsComparisonPriceArticles = null;
		this.griComparisonPrice = null;

		//search articles pagination options
		this.paginationOptions = {
			pageNumber: 1,
			pageSize: 0,
			sort: null
		};

		//search articles filter Object
		this.filtersSearch = new FiltersSearchArticlesModel();

		this.intervalUpdate = null;
		this.idTarProActualizarArticulos = null;
		this.showUploadButton = true;
	}

	resetFiltersSearch() {
		this.filtersSearch = new FiltersSearchArticlesModel();
	}

	resetFiltersSearchRegSan() {
		this.filtersSearch.codigoRegSanitario = null;
		this.filtersSearch.fechaCaducidad = null;
		this.filtersSearch.mostrarCaducados = null;
	}
}

export default CatalogArticlesModel;
