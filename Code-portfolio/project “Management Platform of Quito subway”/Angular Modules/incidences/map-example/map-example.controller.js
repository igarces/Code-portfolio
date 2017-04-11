(function() {
    'use strict';

    angular
        .module('metroquitoApp')
        .controller('ExampleMapController', ExampleMapController);

    ExampleMapController.$inject = ['$scope', '$state', 'NgMap', '$http'];

    function ExampleMapController($scope, $state, NgMap, $http) {

        var vm = this;
        vm.kmlURL = "/content/images/trazado.kml";
        vm.kmlData = '';
        vm.geoid = '1101';
        vm.parserMap = null;
        vm.moveMapGeoId = moveMapGeoId;

        $http({
            method: 'GET',
            url: vm.kmlURL
        }).then(function successCallback(response) {
            vm.kmlData = response.data;
            NgMap.getMap().then(function(map) {
                vm.map = map;
                var myParser = new geoXML3.parser({ map: vm.map });
                myParser.parseKmlString(vm.kmlData);
                vm.parserMap = myParser;
            });
        }, function errorCallback(response) {
            console.log('Error');
        });


        vm.getpos = getpos;
        vm.position = null;

        function getpos(event) {
            vm.position = event.latLng;
        }

        function moveMapGeoId(){
            if(vm.parserMap && vm.parserMap.docs && vm.parserMap.docs.length > 0 && vm.parserMap.docs[0]){
                var placemarks = vm.parserMap.docs[0].placemarks;

                for(var index in placemarks) {
                    if (placemarks[index] && placemarks[index].description) {
                        var geoId = getGeoid(placemarks[index]);

                        // if(geoId && geoId == vm.geoid){
                        //     if(vm.map && placemarks[index].polygon.getMap().getCenter()){
                        //         vm.map.setCenter(placemarks[index].polygon.getMap().getCenter());
                        //         vm.map.setZoom(16);
                        //     }
                        // }

                        if(geoId && geoId == vm.geoid){
                            if(vm.map && placemarks[index].polygon){
                                var polygon = new google.maps.Polygon(placemarks[index].polygon);
                                var polygonBounds = polygon.getPath().getArray();
                                var firstPoint = polygonBounds[0];

                                vm.map.setCenter(new google.maps.LatLng(firstPoint.lat(), firstPoint.lng()));
                                vm.map.setZoom(16);
                            }
                        }
                    }
                }
            }
        }

        function getGeoid(placemarks) {
            var xmlString = placemarks.description;
            var parser = new DOMParser();
            var document = parser.parseFromString(xmlString, "text/html");
            var tdElements = document.getElementsByTagName("td");
            for(var jindex in tdElements){
                if(tdElements[jindex] && tdElements[jindex].innerText === 'GeoId'){
                    return tdElements[Number(jindex) + 1].innerText;
                }
            }
        }
    }
})();
