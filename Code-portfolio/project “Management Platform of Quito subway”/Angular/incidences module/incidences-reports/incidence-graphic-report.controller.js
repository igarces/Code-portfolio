(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('IncidenceGraphicReportController', IncidenceGraphicReportController);

    IncidenceGraphicReportController.$inject = ['$scope', '$state', 'Site', 'nomenclatorsConstants', 'IncidencesReports',
        'IncidenceTypeNom', 'IncidenceStateNom', 'ReportSiteNom', 'User'];

    function IncidenceGraphicReportController($scope, $state, Site, nomenclatorsConstants, IncidencesReports, IncidenceTypeNom,
                                              IncidenceStateNom, ReportSiteNom, User) {
        var vm = this;

        //Nomenclators
        vm.sitesnoms = Site.getAll();
        vm.incidencetypenoms = IncidenceTypeNom.query();
        vm.incidencestatenoms = IncidenceStateNom.query();
        vm.reportsitenoms = ReportSiteNom.query();

        //initial methods
        initializeVariables();

        //variables
        vm.dateformat = 'dd/MM/yyyy';
        vm.defaultOption = '<Seleccione>';
        vm.patternWords = '^[a-zA-Zá-úÁ-Ú \\s]+$';

        //Visit Site Nom
        vm.siteStationId = nomenclatorsConstants.visitSiteStationId;
        vm.siteTunnelSectionId = nomenclatorsConstants.visitSiteTunnelSectionId;
        vm.reportSiteOperationsCenterId = nomenclatorsConstants.reportSiteOperationsCenterId;
        vm.reportSiteVentilationShaftsId = nomenclatorsConstants.reportSiteVentilationShaftsId;
        vm.reportSiteTunnelSectionId = nomenclatorsConstants.reportSiteTunnelSectionId;
        vm.rolPromotorSocialId = nomenclatorsConstants.rolPromotorSocialId;
        vm.adminUserLogin = nomenclatorsConstants.adminUserLogin;

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

        var toDateTemp = new Date(vm.toDate);
        vm.fromDateOption = {
            minDate: (vm.toDate !== '') ? new Date(vm.toDateTemp.setMonth(toDateTemp.getMonth()-1)) : '',
            maxDate: (vm.toDate !== '') ? vm.toDate : new Date()
        };

        vm.toDateOption = {
            minDate: vm.fromDate,
            maxDate: new Date()
        };

        $scope.$watch('vm.toDate', updateAsync);
        $scope.$watch('vm.fromDate', updateAsync);

        function updateAsync(){
            var toDateTemp = new Date(vm.toDate);
            vm.fromDateOption = {
                minDate: (vm.toDate !== '') ? new Date(toDateTemp.setMonth(toDateTemp.getMonth()-1)) : '',
                maxDate: (vm.toDate !== '') ? vm.toDate : new Date()
            };

            if(vm.fromDate !== '' && vm.fromDate < toDateTemp){
                vm.fromDate = toDateTemp;
            }
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
            vm.socialPromoter = '';
            vm.incidenceStateId = '';
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
                reportUrl: 'api/report/incidence-graphic-report',
                pdfUrl: 'api/report/incidence-graphic-report',
                xlsUrl: null,
                moduleuiref: 'incidences',
                backuiref: 'incidence-graphic-report',
                reportParams: {
                    fromDate: vm.fromDate,
                    toDate: vm.toDate,
                    stationId: vm.stationId === null ? '' : vm.stationId,
                    stretchTunnelId: vm.betweenTunnelId === null ? '' : vm.betweenTunnelId,
                    socialPromoter: vm.socialPromoter,
                    incidenceStateId: vm.incidenceStateId === null ? '' : vm.incidenceStateId,
                    reportSiteId: vm.reportSiteId === null ? '' : vm.reportSiteId,
                }
            });
        }

        User.query({
            page: 0,
            size: 100000,
            sort: 'firstName,asc'
        }, function (users) {
            vm.users = [];

            for(var index in users){
                if(users[index] && users[index].login !== vm.adminUserLogin){
                    var user = users[index];

                    for(var index in user.roles){
                        if(user.roles[index].id === vm.rolPromotorSocialId){
                            vm.users.push(user);
                            break;
                        }
                    }
                }
            }
        });

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
