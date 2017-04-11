(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('IncidenceSocialRespReportController', IncidenceSocialRespReportController);

    IncidenceSocialRespReportController.$inject = ['$scope', '$state', 'Site', 'nomenclatorsConstants', 'AdministrativeUnit', 'IncidenceTypeNom', 'IncidenceStateNom', 'ReportSiteNom', 'User'];

    function IncidenceSocialRespReportController($scope, $state, Site, nomenclatorsConstants, AdministrativeUnit, IncidenceTypeNom, IncidenceStateNom, ReportSiteNom, User) {
        var vm = this;

        //Nomenclators
        vm.sitesnoms = Site.getAll();
        vm.incidencetypenoms = IncidenceTypeNom.query();
        vm.incidencestatenoms = IncidenceStateNom.query();
        vm.reportsitenoms = ReportSiteNom.query();
        vm.administrativeunits = AdministrativeUnit.search({'name': '', 'acronym':''});

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
        vm.filterUserAdministrativeUnit = filterUserAdministrativeUnit;

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
            vm.reportSiteId = '';
            vm.stationId = '';
            vm.betweenTunnelId = '';
            vm.incidenceTypeId = '';
            vm.socialPromoter = '';
            vm.incidenceStateId = '';
            vm.administrativeUnitId = '';
            vm.responsible = '';
        }

        function clear() {
            initializeVariables();
        }

        function cancel() {
            $state.go('incidences-report', null, {reload: true});
        }

        User.query({
            page: 0,
            size: 100000,
            sort: 'firstName,asc'
        }, function (users) {
            vm.users = users;
            vm.usersPromotor = [];

            for(var index in users){
                if(users[index] && users[index].login !== vm.adminUserLogin){
                    var user = users[index];

                    for(var index in user.roles){
                        if(user.roles[index].id === vm.rolPromotorSocialId){
                            vm.usersPromotor.push(user);
                            break;
                        }
                    }
                }
            }
        });

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
                reportUrl: 'api/report/incidence-social-resp-report',
                pdfUrl: 'api/report/incidence-social-resp-report',
                xlsUrl: null,
                moduleuiref: 'incidences',
                backuiref: 'incidence-social-resp-report',
                reportParams: {
                    fromDate: vm.fromDate,
                    toDate: vm.toDate,
                    reportSiteId: vm.reportSiteId === null ? '' : vm.reportSiteId,
                    stationId: vm.stationId === null ? '' : vm.stationId,
                    stretchTunnelId: vm.betweenTunnelId === null ? '' : vm.betweenTunnelId,
                    incidenceTypeId: vm.incidenceTypeId === null ? '' : vm.incidenceTypeId,
                    socialPromoter: vm.socialPromoter === null ? '' : vm.socialPromoter,
                    incidenceStateId: vm.incidenceStateId === null ? '' : vm.incidenceStateId,
                    administrativeUnitId: vm.administrativeUnitId === null ? '' : vm.administrativeUnitId,
                    responsible: vm.responsible === null ? '' : vm.responsible
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

        function filterUserAdministrativeUnit(item) {
            if(item.login !== vm.adminUserLogin){
                if(vm.administrativeUnitId === '' || vm.administrativeUnitId === null || vm.administrativeUnitId === undefined){
                    return true;
                }else{
                    if(item.adminUnitId === vm.administrativeUnitId){
                        return true;
                    }
                }
            }
            return false;
        }
    }
})();
