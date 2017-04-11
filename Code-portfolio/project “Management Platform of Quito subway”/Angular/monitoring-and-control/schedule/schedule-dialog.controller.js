(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('ScheduleDialogController', ScheduleDialogController)
        .directive('existname', existname);

    existname.$inject = ['Schedule','$q'];

    ScheduleDialogController.$inject = ['$timeout', '$scope', '$state', '$stateParams', 'DataUtils', 'entity', 'Schedule', 'AlertService'];

    function ScheduleDialogController ($timeout, $scope, $state, $stateParams,  DataUtils, entity, Schedule, AlertService) {
        var vm = this;

        vm.dateformat = 'dd/MM/yyyy';

        vm.schedule = entity;
        vm.datePickerOpenStatus = {};
        vm.openCalendar = openCalendar;
        vm.byteSize = DataUtils.byteSize;
        vm.openFile = DataUtils.openFile;
        vm.downloadFile = DataUtils.downloadFile;
        vm.removeFile = removeFile;
        vm.addFile = addFile;
        vm.existFile = existFile;
        vm.save = save;
        vm.cancel = cancel;

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });


        function cancel () {
            $state.go('schedule', null, {reload: true});
        }

        function save () {
            vm.isSaving = true;

            for (var i = 0; i < vm.files.length; i++){
                if (vm.files[i].fileName.substring(vm.files[i].fileName.lastIndexOf(".") +1) == "xls" ||
                    vm.files[i].fileName.substring(vm.files[i].fileName.lastIndexOf(".") +1) == "xlsx"){
                    vm.schedule.fileScheduleData = vm.files[i].fileDocument;
                    vm.schedule.fileScheduleDataContentType = vm.files[i].fileContentType;
                }else{
                    vm.schedule.fileScheduleName = vm.files[i].fileName;
                    vm.schedule.fileScheduleContentType = vm.files[i].fileContentType;
                    vm.schedule.fileSchedule = vm.files[i].fileDocument;
                    vm.schedule.fileSchedulePath = "path";
                }
            }

            Schedule.save(vm.schedule, onSaveSuccess, onSaveError);
        }

        function onSaveSuccess (result) {
            if(result.success){
                $scope.$emit('metroquitoApp:scheduleUpdate', result);
                vm.isSaving = false;
                $state.go('schedule', null, {reload: true});
            }else{
                vm.isSaving = false;
                AlertService.error(result.message);
            }

        }

        function onSaveError () {
            vm.isSaving = false;
            AlertService.error('Error cargando la información del cronograma.');
        }

        $scope.$watch('vm.schedule.baseLine', clearDate);

        function clearDate() {
            vm.schedule.dateDeclaredBase = null;
        }

        vm.datePickerOpenStatus.dateDeclaredBase = false;

        vm.showAlertFileError = false;
        vm.showAlertFileMaxLengthError = false;
        vm.showAlertFileTipeError = false;
        vm.showAlertFileTipeExtError = false;
        vm.files = null;
        vm.file = null;
        vm.fileName = null;
        vm.fileContentType = null;

        vm.setFileSchedule = function ($file, schedule) {
            if ($file) {
                DataUtils.toBase64($file, function(base64Data) {
                    $scope.$apply(function() {
                        vm.file = base64Data;
                        vm.fileContentType = $file.type;
                        vm.fileName = $file.name;
                        if(vm.fileName.length<=100) {
                            addFile();
                        }else{
                            vm.showAlertFileMaxLengthError = true;
                        }
                    });
                });
            }
        };

        function validFile(name) {
            cleanErrors();
            if (/^.*\.(xls|xlsx|rar|zip)$/.test(name.toLowerCase()) ) {
                if (vm.files != null) {
                    for (var i = 0; i < vm.files.length; i++) {

                        if (name == vm.files[i].fileName) {
                            vm.showAlertFileError = true;
                            return false;
                        }else{
                            vm.showAlertFileError = false;
                        }

                        if (name.substring(name.lastIndexOf(".")) == vm.files[i].fileName.substring(vm.files[i].fileName.lastIndexOf("."))) {
                            vm.showAlertFileTipeError = true;
                            return false;
                        }else{
                            vm.showAlertFileTipeError = false;
                        }
                    }
                }

            }else{
                vm.showAlertFileTipeExtError = true;
                return false;
            }

            return true;
        }


        function addFile() {
            if (vm.files == null) {
                vm.files = [];
            }
            if (validFile(vm.fileName)) {
                var fileAdd = {
                    fileDocument: vm.file,
                    fileContentType: vm.fileContentType,
                    fileName: vm.fileName
                };
                vm.files.push(fileAdd);
                vm.showAlertFileError = false;
            }
            cleanFile();
        }

        function cleanFile() {
            vm.file = null;
            vm.fileContentType = null;
            vm.fileName = null;
            vm.showAlertFileMaxLengthError = false;
        }

        function cleanErrors() {
            vm.showAlertFileError = false;
            vm.showAlertFileMaxLengthError = false;
            vm.showAlertFileTipeError = false;
            vm.showAlertFileTipeExtError = false;
        }

        function existFile(fileName) {
            if (vm.files != null && vm.files.length > 0) {
                for (var i = 0; i < vm.files.length; i++) {
                    if (fileName == vm.files[i].fileName) {
                        return true;
                    }
                }
            }
            return false;

        }

        function removeFile() {
            cleanErrors();
            var what, a = arguments, L = a.length, ax;
            while (L && vm.files.length) {
                what = a[--L];
                while ((ax = vm.files.indexOf(what)) !== -1) {
                    vm.files.splice(ax, 1);
                }
            }
        }

        vm.setFileScheduleData = function ($file, schedule) {
            if ($file) {
                DataUtils.toBase64($file, function(base64Data) {
                    $scope.$apply(function() {
                        schedule.fileScheduleData = base64Data;
                        schedule.fileScheduleDataContentType = $file.type;
                    });
                });
            }
        };

        function openCalendar (date) {
            vm.datePickerOpenStatus[date] = true;
        }
    }

    function existname(Schedule, $q) {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {

                ctrl.$asyncValidators.existname = function(modelValue, viewValue) {

                    var def = $q.defer();
                    if (ctrl.$isEmpty(modelValue)) {
                        def.resolve();
                    }

                    Schedule.exist({name:modelValue}, onSuccess, onError);
                    function onSuccess (data) {
                        if(data.success)
                            def.reject();
                        else
                            def.resolve();
                    }
                    function onError () {
                        def.reject();
                    }

                  return def.promise;

                };
            }
        };
    }
})();
