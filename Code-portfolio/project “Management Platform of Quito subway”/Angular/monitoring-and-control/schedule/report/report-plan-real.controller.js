(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('ReportPLMQController', ReportPLMQController);

    ReportPLMQController.$inject = ['$scope', '$state', '$http'];

    function ReportPLMQController($scope,$state ,$http) {
        var vm = this;

        vm.level = '';
        vm.defaultOption = '<Seleccione>';
        vm.levels = levels;
        vm.download = download;
        vm.clear = clear;
        vm.cancel = cancel;
        vm.noResult = false;

        function levels(num) {
            var input = [];
            for (var i = 0; i < num; i++) {
                input.push(i + 1 );
            }
            return input;
        }
        function download() {
            vm.noResult = false;
            if(vm.level == null || vm.level == undefined || vm.level == ''){
                vm.noResult = true;
                return;
            }
            $http.get('api/schedules/report',  {responseType:'arraybuffer', params: {level:vm.level}, headers: {
                "Content-Type": "application/octet-stream"
            }, data: ''})
                .success(function (response) {
                    var a = document.createElement("a");
                    document.body.appendChild(a);
                    a.style = "display: none";
                    var blob = new Blob([response], {type: 'application/vnd.ms-excel'}),
                    url = window.URL.createObjectURL(blob);
                    a.href = url;
                    a.download = 'reportePLMQ.xlsx';
                    a.click();
                    window.URL.revokeObjectURL(url);
                })
                .error(function (error) {
                    vm.noResult = true;
                });

        }

        function clear(){
            vm.level = '';
            vm.noResult = false;
        }

        function cancel(){
            $state.go('monitoring-and-control-reports', null, {reload: true});
        }

    }

})();
