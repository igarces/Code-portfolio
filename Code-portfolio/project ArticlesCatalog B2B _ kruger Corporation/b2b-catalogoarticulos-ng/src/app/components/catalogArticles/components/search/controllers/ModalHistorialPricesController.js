class ModalHistorialPricesController {
	constructor($uibModalInstance, catalogArticlesModel, catalogArticlesComparissonPricesFactory, $q, appConstant) {
		'ngInject';
		this.$uibModalInstance = $uibModalInstance;
		this.model = catalogArticlesModel;
		this.catalogArticlesComparissonPricesFactory = catalogArticlesComparissonPricesFactory;
		this.$q = $q;
		this.appConstant = appConstant;

		this.model.griComparisonPrice = this.griComparisonPrice();
	}

	close() {
		this.$uibModalInstance.dismiss(this);
	}

	griComparisonPrice() {
		let gridOptions = {
			init: (gridCtrl, gridScope) => {
				gridScope.$on('ngGridEventData', () => {
				});
			},
			data: [],
			rowHeight: 20,
			enableColumnMenus: false,
			enableVerticalScrollbar: 2,
			columnDefs: [
				{
					displayName: 'P.V.P. Propuesto proveedor',
					field: 'detHisComPrePvp.valorProveedor',
					cellClass: 'text-right',
					width: '*',
					minWidth: 90,
					cellFilter: 'number: grid.appScope.modalHisPri.appConstant.NUMBER_DECIMAL_DIGITS'
				},
				{
					displayName: 'P.V.P. Corp. Favorita',
					field: 'detHisComPrePvp.valorCorporacion',
					cellClass: 'text-right',
					width: '*',
					minWidth: 90,
					cellFilter: 'number: grid.appScope.modalHisPri.appConstant.NUMBER_DECIMAL_DIGITS'
				},
				{
					displayName: 'Porcentaje diferencia P.V.P.',
					field: 'detHisComPrePvp.porcentajeDiferencia',
					cellClass: 'text-right',
					width: '*',
					minWidth: 90,
					cellTemplate: '<div class="ui-grid-cell-contents"> ' +
					'<span ng-if="row.entity.detHisComPrePvp.porcentajeDiferencia"> ' +
					'{{ row.entity.detHisComPrePvp.porcentajeDiferencia | number: 2 }} % '+
					'</span></div>'
				},
				{
					displayName: 'C. Neto Propuesto proveedor',
					field: 'detHisComPreCosNet.valorProveedor',
					cellClass: 'text-right',
					width: '*',
					minWidth: 90,
					cellFilter: 'number: grid.appScope.modalHisPri.appConstant.NUMBER_DECIMAL_DIGITS'
				},
				{
					displayName: 'C. Neto Corp. Favorita',
					field: 'detHisComPreCosNet.valorCorporacion',
					cellClass: 'text-right',
					width: '*',
					minWidth: 90,
					cellFilter: 'number: grid.appScope.modalHisPri.appConstant.NUMBER_DECIMAL_DIGITS'
				},
				{
					displayName: 'Porcentaje diferencia C. Neto',
					field: 'detHisComPreCosNet.porcentajeDiferencia',
					cellClass: 'text-right',
					width: '*',
					minWidth: 90,
					cellTemplate: '<div class="ui-grid-cell-contents"> ' +
					'<span ng-if="row.entity.detHisComPreCosNet.porcentajeDiferencia"> ' +
					'{{ row.entity.detHisComPreCosNet.porcentajeDiferencia | number: 2 }} % '+
					'</span></div>'
				},
				{
					displayName: 'Unidad de manejo Propuesto proveedor',
					field: 'detHisComPreUniMan.valorProveedor',
					cellClass: 'text-right',
					width: '*',
					minWidth: 90
				},
				{
					displayName: 'Unidad de manejo Corp. Favorita',
					field: 'detHisComPreUniMan.valorCorporacion',
					cellClass: 'text-right',
					width: '*',
					minWidth: 90
				},
				{
					displayName: 'I.V.A. Propuesto proveedor',
					field: 'detHisComPreIva.valorProveedor',
					width: '*',
					minWidth: 90,
					cellClass: 'text-center',
					cellTemplate: '<div class="ui-grid-cell-contents"> ' +
					'<img ng-if="row.entity.detHisComPreIva.valorProveedor == ' +
					'grid.appScope.modalHisPri.appConstant.ESTADO_ACTVO" ' +
					'ng-src="{{grid.appScope.modalHisPri.appConstant.IMG_ICON_ACTIVE}}"/>' +
					'<img ng-if="row.entity.detHisComPreIva.valorProveedor == ' +
					'grid.appScope.modalHisPri.appConstant.ESTADO_INACTIVO" ' +
					'ng-src="{{grid.appScope.modalHisPri.appConstant.IMG_ICON_INACTIVE}}"/></div>'
				},
				{
					displayName: 'I.V.A. Corp. Favorita',
					field: 'detHisComPreIva.valorCorporacion',
					width: '*',
					minWidth: 90,
					cellClass: 'text-center',
					cellTemplate: '<div class="ui-grid-cell-contents"> ' +
					'<img ng-if="row.entity.detHisComPreIva.valorCorporacion == ' +
					'grid.appScope.modalHisPri.appConstant.ESTADO_ACTVO" ' +
					'ng-src="{{grid.appScope.modalHisPri.appConstant.IMG_ICON_ACTIVE}}"/>' +
					'<img ng-if="row.entity.detHisComPreIva.valorCorporacion == ' +
					'grid.appScope.modalHisPri.appConstant.ESTADO_INACTIVO" ' +
					'ng-src="{{grid.appScope.modalHisPri.appConstant.IMG_ICON_INACTIVE}}"/></div>'
				},
				{
					displayName: 'I.VERDE Propuesto proveedor',
					field: 'detHisComPreIve.valorProveedor',
					width: '*',
					minWidth: 90,
					cellClass: 'text-center',
					cellTemplate: '<div class="ui-grid-cell-contents"> ' +
					'<img ng-if="row.entity.detHisComPreIve.valorProveedor == ' +
					'grid.appScope.modalHisPri.appConstant.ESTADO_ACTVO" ' +
					'ng-src="{{grid.appScope.modalHisPri.appConstant.IMG_ICON_ACTIVE}}"/>' +
					'<img ng-if="row.entity.detHisComPreIve.valorProveedor == ' +
					'grid.appScope.modalHisPri.appConstant.ESTADO_INACTIVO" ' +
					'ng-src="{{grid.appScope.modalHisPri.appConstant.IMG_ICON_INACTIVE}}"/></div>'
				},
				{
					displayName: 'I.VERDE Corp. Favorita',
					field: 'detHisComPreIve.valorCorporacion',
					width: '*',
					minWidth: 90,
					cellClass: 'text-center',
					cellTemplate: '<div class="ui-grid-cell-contents"> ' +
					'<img ng-if="row.entity.detHisComPreIve.valorCorporacion == ' +
					'grid.appScope.modalHisPri.appConstant.ESTADO_ACTVO" ' +
					'ng-src="{{grid.appScope.modalHisPri.appConstant.IMG_ICON_ACTIVE}}"/>' +
					'<img ng-if="row.entity.detHisComPreIve.valorCorporacion == ' +
					'grid.appScope.modalHisPri.appConstant.ESTADO_INACTIVO" ' +
					'ng-src="{{grid.appScope.modalHisPri.appConstant.IMG_ICON_INACTIVE}}"/></div>'
				},
				{
					displayName: 'Fecha Registro',
					field: 'fechaRegistro',
					width: '*',
					minWidth: 90,
					cellFilter: 'date:"yyyy-MM-dd"'
				}
			]
		};
		gridOptions.data = this.model.historialPricesBitacora;
		return gridOptions;
	}

	okAction() {
		let defer = this.$q.defer();

		this.catalogArticlesComparissonPricesFactory.sendComparisonPricesArticles(this.model, defer);

		this.$uibModalInstance.close('ok');
	}

	cancelAction() {
		this.$uibModalInstance.dismiss('cancel');
	}

}
export default ModalHistorialPricesController;
