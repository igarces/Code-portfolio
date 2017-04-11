(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('CitizenAttentionReportController', CitizenAttentionReportController);

    CitizenAttentionReportController.$inject = ['$scope', '$state', 'Site', 'nomenclatorsConstants', 'ReportSiteNom'];

    function CitizenAttentionReportController($scope, $state, Site, nomenclatorsConstants, ReportSiteNom) {
        var vm = this;

        //Nomenclators
        vm.sitesnoms = Site.getAll();
        vm.reportsitenoms = ReportSiteNom.query();

        //initial methods
        initializeVariables();

        //variables
        vm.dateformat = 'dd/MM/yyyy';
        vm.defaultOption = '<Seleccione>';

        //Visit Site Nom
        vm.siteStationId = nomenclatorsConstants.visitSiteStationId;
        vm.siteTunnelSectionId = nomenclatorsConstants.visitSiteTunnelSectionId;
        vm.reportSiteOperationsCenterId = nomenclatorsConstants.reportSiteOperationsCenterId;
        vm.reportSiteVentilationShaftsId = nomenclatorsConstants.reportSiteVentilationShaftsId;
        vm.reportSiteTunnelSectionId = nomenclatorsConstants.reportSiteTunnelSectionId;

        //functions
        vm.clear = clear;
        vm.cancel = cancel;
        vm.generateReport = generateReport;
        vm.filterStation = filterStation;
        vm.filterBetweenTunnel = filterBetweenTunnel;

        //date configurations
        vm.openCalendar = openCalendar;
        vm.datePickerOpenStatus = {};
        vm.datePickerOpenStatus.fromDate = false;
        vm.datePickerOpenStatus.toDate = false;

        function openCalendar(date) {
            vm.datePickerOpenStatus[date] = true;
        }

        vm.fromDateOption = {
            maxDate: (vm.toDate !== '') ? vm.toDate : new Date()
        };

        vm.toDateOption = {
            minDate: vm.fromDate,
            maxDate: new Date()
        };

        $scope.$watch('vm.toDate', updateAsync);
        $scope.$watch('vm.fromDate', updateAsync);

        function updateAsync(){
            vm.fromDateOption = {
                maxDate: (vm.toDate !== '') ? vm.toDate : new Date()
            };

            vm.toDateOption = {
                minDate: vm.fromDate,
                maxDate: new Date()
            };
            $scope.$evalAsync();
        }

        function initializeVariables() {
            vm.fromDate = '';
            vm.toDate = '';
            vm.stationId = '';
            vm.betweenTunnelId = '';
            vm.reportSiteId = '';
        }

        function clear() {
            initializeVariables();
        }

        function cancel() {
            $state.go('incidences-report', null, {reload: true});
        }

        function generateReport() {
            if(vm.reportSiteId === vm.siteStationId || vm.reportSiteId == vm.reportSiteOperationsCenterId || vm.reportSiteId == vm.reportSiteVentilationShaftsId){
                vm.betweenTunnelId = '';
            }else if(vm.reportSiteId === vm.reportSiteTunnelSectionId){
                vm.stationId = '';
            }else{
                vm.reportSiteId = '';
                vm.stationId = '';
                vm.betweenTunnelId = '';
            }

            $state.go('report-viewer', {
                pdfExport: true,
                xlsExport: false,
                reportUrl: 'api/report/citizen-attention-report',
                pdfUrl: 'api/report/citizen-attention-report',
                xlsUrl: null,
                moduleuiref: 'incidences',
                backuiref: 'citizen-attention-report',
                reportParams: {
                    fromDate: vm.fromDate,
                    toDate: vm.toDate,
                    reportSiteId: vm.reportSiteId === null ? '' : vm.reportSiteId,
                    stationId: vm.stationId === null ? '' : vm.stationId,
                    stretchTunnelId: vm.betweenTunnelId === null ? '' : vm.betweenTunnelId
                }
            });
        }

        function filterStation(item) {
            if(item.typeId === vm.siteStationId){
                return true;
            }
            return false;
        }

        function filterBetweenTunnel(item) {
            if(item.typeId === vm.siteTunnelSectionId){
                return true;
            }
            return false;
        }
    }
})();
