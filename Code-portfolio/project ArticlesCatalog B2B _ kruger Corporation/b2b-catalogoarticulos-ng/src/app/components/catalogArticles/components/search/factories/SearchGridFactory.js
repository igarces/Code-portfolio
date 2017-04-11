class SearchGridFactory{

	constructor($timeout) {
		this.$timeout = $timeout;

		this.gridOptionsClasificaciones = {
			init: (gridCtrl, gridScope) => {
				gridScope.$on('ngGridEventData', () => {
				});
			},
			onRegisterApi: ( gridApi ) => {
				let gridOptions = this.gridOptionsClasificaciones;
				let filterValue;
				if(gridOptions.gridApi && gridOptions.gridApi.filterValue){
					filterValue = gridOptions.gridApi.filterValue;
				}
				gridOptions.gridApi = gridApi;
				gridOptions.gridApi.selection.on.rowSelectionChanged(null, ((rowChanged) => {
					if(typeof(rowChanged.treeLevel) !== 'undefined' && rowChanged.treeLevel > -1) {
						// this is a group header
						let children = gridOptions.gridApi.treeBase.getRowChildren(rowChanged);
						this.selectRowChildren(gridOptions, rowChanged, children);
					}else{
						if(rowChanged.treeNode.parentRow !== undefined && !rowChanged.isSelected &&
							typeof(rowChanged.treeLevel) === 'undefined'){
							let children = rowChanged.treeNode.parentRow.treeNode.children;
							this.unselectRowChildren(rowChanged, children);
						}
					}
				}));

				gridOptions.gridApi.selection.on.rowSelectionChangedBatch(null, (() => {
					let selectAll = gridOptions.gridApi.selection.getSelectAllState();
					if(!selectAll){
						//marcar row parent
						let groupRow = gridOptions.gridApi.grid.treeBase.tree;
						groupRow.forEach((data) => {
							data.row.isSelected = true;
						});
					}else{
						//desmarcar row parent
						let groupRow = gridOptions.gridApi.grid.treeBase.tree;
							groupRow.forEach((data) => {
								data.row.isSelected = false;
						});
					}
				}));
				gridOptions.gridApi.filterValue = filterValue;
				gridOptions.gridApi.grid.registerRowsProcessor( this.singleFilter, 200 );

			},
			columnDefs: [
				{
					displayName: 'Departamento-Clasificación',
					field: 'descripcionClasificacionPadre',
					sort: {priority: 0, direction: 'asc'},
					grouping: {groupPriority: 0},
					width: '*',
					minWidth: 250,
					cellTemplate:
					'<div ng-if="row.groupHeader" class="ui-grid-cell-contents">' +
						'{{COL_FIELD CUSTOM_FILTERS}}'+
					'</div>'+
					'<div ng-if="!row.groupHeader" class="ui-grid-cell-contents"> ' +
						'{{row.entity.codigoClasificacion}} - {{row.entity.descripcionClasificacion}}'+
					'</div>',
				},
			],
			treeRowHeaderBaseWidth: 20,
			selectionRowHeaderWidth: 20,
			enableGroupHeaderSelection: true,
			data: [],
			rowHeight: 20,
			enableColumnResizing: true,
			enableColumnMenus: false,
			//enableFiltering: true,
		};
	}

	selectRowChildren(gridOptions, rowChanged, children){
		children.forEach((child) => {
			if(typeof(child.treeLevel) !== 'undefined' && child.treeLevel > -1) {
				let childrens = child.treeNode.children;
				if (rowChanged.isSelected) {
					child.isSelected = true;
				} else {
					child.isSelected = false;
				}
				this.selectRowChildren(gridOptions, child, childrens);
			}else{
				if(rowChanged.isSelected) {
					if(child.entity === undefined){
						gridOptions.gridApi.selection.selectRow(child.row.entity);
					}else{
						gridOptions.gridApi.selection.selectRow(child.entity);
					}
				} else {
					if(child.entity === undefined){
						gridOptions.gridApi.selection.unSelectRow(child.row.entity);
					}else{
						gridOptions.gridApi.selection.unSelectRow(child.entity);
					}
				}
			}
		});
	}

	unselectRowChildren(rowChanged, children){
		let flagRowSelect = false;
		children.forEach((child) => {
			if(child.row.isSelected){
				flagRowSelect = true;
			}
		});
		if(!flagRowSelect){
			rowChanged.treeNode.parentRow.isSelected = false;
			if(rowChanged.treeNode.parentRow.treeLevel !== undefined && rowChanged.treeNode.parentRow.treeNode.parentRow !== null){
				let childrens = rowChanged.treeNode.parentRow.treeNode.parentRow.treeNode.children;
				this.unselectRowChildren(rowChanged.treeNode.parentRow, childrens);
			}
		}
	}

	singleFilter(renderableRows){
		let filter;
		if(this.options && this.options.gridApi && this.options.gridApi.filterValue !== null &&
			this.options.gridApi.filterValue !== undefined){
			filter = this.options.gridApi.filterValue;
		}
		var matcher = new RegExp(filter);
		renderableRows.forEach( ( row ) => {
			var match = false;
			[ 'codigoClasificacion', 'descripcionClasificacion', 'descripcionClasificacionPadre'].forEach(function( field ){
				if ( row.entity[field].match(matcher) ){
					match = true;
				}
			});
			if ( !match ){
				row.visible = false;
			}
		});
		return renderableRows;
	}

	filterValueFunc(gridOptions, filterValue){
		if(gridOptions && gridOptions.gridApi){
			gridOptions.gridApi.filterValue = filterValue;
		}
	}

	expandAll(gridOptions){
		if(gridOptions.gridApi.grid.treeBase.tree instanceof Array){
			gridOptions.gridApi.treeBase.expandAllRows();
		}
	}

	collapseAll(gridOptions){
		if(gridOptions.gridApi && gridOptions.gridApi.grid.treeBase.tree instanceof Array){
			gridOptions.gridApi.treeBase.collapseAllRows();
		}
	}

	static instance($timeout) {
		'ngInject';
		return new SearchGridFactory($timeout);
	}
}

export default SearchGridFactory;
