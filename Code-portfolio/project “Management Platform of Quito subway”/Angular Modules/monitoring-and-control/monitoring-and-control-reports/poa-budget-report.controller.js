(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('PoaBudgetReportController', PoaBudgetReportController);

    PoaBudgetReportController.$inject = ['$scope', '$state', 'User', 'AdministrativeUnit', 'PoaType', 'nomenclatorsConstants', 'AdminUnitDirection'];

    function PoaBudgetReportController($scope, $state, User, AdministrativeUnit, PoaType, nomenclatorsConstants, AdminUnitDirection) {
        var vm = this;

        vm.poatypes = PoaType.query(null, function () {
            initializeVariables();
        });
        vm.directions = AdminUnitDirection.query();

        //variables
        vm.dateformat = 'dd/MM/yyyy';
        vm.administrativeUnitList = [];
        vm.idAdministrativeUnitDPGI = nomenclatorsConstants.adminUnitDPGIId;
        vm.adminUnitGRSAId = nomenclatorsConstants.adminUnitGRSAId;
        vm.onlyOneAdminUnit = false;

        //initial methods
        initializeVariables();
        initData();

        //functions
        vm.clear = clear;
        vm.cancel = cancel;
        vm.generateReport = generateReport;

        //date configurations
        vm.openCalendar = openCalendar;
        vm.datePickerOpenStatus = {};
        vm.datePickerOpenStatus.fromDate = false;
        vm.datePickerOpenStatus.toDate = false;

        function openCalendar(date) {
            vm.datePickerOpenStatus[date] = true;
        }

        vm.fromDateOption = {
            maxDate: vm.toDate
        };

        vm.toDateOption = {
            minDate: vm.fromDate
        };

        $scope.$watch('vm.toDate', updateAsync);
        $scope.$watch('vm.fromDate', updateAsync);

        function updateAsync(){
            vm.fromDateOption = {
                maxDate: vm.toDate
            };

            vm.toDateOption = {
                minDate: vm.fromDate
            };
            $scope.$evalAsync();
        }

        function initializeVariables() {
            vm.fromDate = '';
            vm.toDate = '';
            vm.administrativeUnit = '';
            vm.poaType = vm.poatypes[0] !== undefined ? vm.poatypes[0].id : null;
            vm.adminUnitDirection = '';
        }

        function initData() {
            User.getLoggedUser(function (userLogged) {
                if(userLogged.administrativeUnitId === vm.idAdministrativeUnitDPGI){
                    vm.administrativeUnitList = AdministrativeUnit.search({'name': '', 'acronym':''});
                }else{
                    AdministrativeUnit.get({'id': userLogged.administrativeUnitId}, function (adminUnit) {
                        vm.administrativeUnitList.push(adminUnit);
                        vm.onlyOneAdminUnit = true;
                    });
                }
            });
        }

        function clear() {
            initializeVariables();
        }

        function cancel() {
            $state.go('monitoring-and-control-reports', null, {reload: true});
        }

        function generateReport() {
            var adminUnitSearch = vm.administrativeUnit;
            if(vm.administrativeUnit === null){
                adminUnitSearch = '';
            }
            if(vm.onlyOneAdminUnit){
                adminUnitSearch = vm.administrativeUnitList[0].id;
            }

            if(vm.poaType === null){
                vm.poaType = vm.poatypes[0] !== undefined ? vm.poatypes[0].id : null;
            }

            if(adminUnitSearch !== vm.adminUnitGRSAId || vm.adminUnitDirection === null || vm.adminUnitDirection === undefined){
                vm.adminUnitDirection = '';
            }

            $state.go('report-viewer', {
                pdfExport: true,
                xlsExport: true,
                reportUrl: 'api/report/poa-budget-report/pdf',
                pdfUrl: 'api/report/poa-budget-report/pdf',
                xlsUrl: 'api/report/poa-budget-report/xls',
                moduleuiref: 'monitoring-and-control',
                backuiref: 'poa-budget-report',
                reportParams: {
                    fromDate: vm.fromDate,
                    toDate: vm.toDate,
                    administrativeUnitId: adminUnitSearch,
                    poaType: vm.poaType,
                    adminUnitDirection: vm.adminUnitDirection
                }
            });
        }
    }
})();
