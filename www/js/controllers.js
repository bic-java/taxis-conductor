angular.module('taxis.controllers', ['taxis.controllers.accounts'])

        .controller('AppCtrl', function ($scope, $ionicSideMenuDelegate) {

            // With the new view caching in Ionic, Controllers are only called
            // when they are recreated or on app start, instead of every page change.
            // To listen for when this page is active (for example, to refresh data),
            // listen for the $ionicView.enter event:
            //$scope.$on('$ionicView.enter', function(e) {
            //});

            $scope.$watch(function () {
                return $ionicSideMenuDelegate.isOpenLeft();
            },
                    function (isOpen) {
                        if (isOpen) {
                            $scope.hiddenMenu = false;
                        } else {
                            $scope.hiddenMenu = true;
                        }

                    });
        })

        .controller('PlaylistsCtrl', function ($scope) {
            $scope.playlists = [
                {title: 'Reggae', id: 1},
                {title: 'Chill', id: 2},
                {title: 'Dubstep', id: 3},
                {title: 'Indie', id: 4},
                {title: 'Rap', id: 5},
                {title: 'Cowbell', id: 6}
            ];
        })

        .controller('PlaylistCtrl', function ($scope, $stateParams) {
        })
        .controller('BrowseCtrl', function ($scope, $stateParams, $interval, CurrentUser, WS) {
            $scope.address = '';
            var gMap = null, driverMarker = null, zoomed = false;

            function onMapInit(map) {
                console.info('Map Init');
                gMap = map;
                gMap.on(plugin.google.maps.event.CAMERA_CHANGE, onMapCameraChanged);
                gMap.addMarker({
                    position: {lat: 19, lng: -98}
                    , icon: {
                        url: 'file:///android_asset/www/img/car.png'
                        , size: {
                            width: 30,
                            height: 30
                        }
                    }
                }, function (marker) {
                    driverMarker = marker;
                });
                CurrentUser.updateLocationInterval = $interval($scope.updateDriverLocation, 10000);
                $scope.updateDriverLocation();
            }

            function onMapCameraChanged(position) {
                console.log('mapChanged', position);
                updateAddress(position.target);
            }

            function updateAddress(position) {
                var request = {
                    'position': position
                };
                plugin.google.maps.Geocoder.geocode(request, function (results) {
                    console.log('GeocoderResult', results);
                    if (results.length) {
                        var result = results[0];
                        var position = result.position;
                        var address = [
                            result.subThoroughfare || "",
                            result.thoroughfare || "",
                            result.locality || "",
                            result.adminArea || "",
                            result.postalCode || "",
                            result.country || ""].join(", ");
                        $scope.$apply(function ($scope) {
                            $scope.address = address;
                        });
                    } else {
                        console.log("Not found");
                    }
                });
            }

//            $scope.$evalAsync(function () {
            $scope.initMap = function () {
                var mapDiv = document.getElementById("mapa");
                console.log(mapDiv);
                var map = plugin.google.maps.Map.getMap(mapDiv);
                // You have to wait the MAP_READY event.
                map.on(plugin.google.maps.event.MAP_READY, onMapInit);
            };

            $scope.updateDriverLocation = function () {
                var onSuccess = function (location) {
                    driverMarker.setPosition(location.latLng);
                    if (!zoomed) {
                        gMap.animateCamera({
                            target: location.latLng
                            , zoom: 15});
                        zoomed = true;
                    }

                    WS.call('Driver', 'updateLocation', {lat: location.latLng.lat, lng: location.latLng.lng});
                };

                var onError = function (msg) {
                    alert("error: " + msg);
                };
                gMap.getMyLocation(onSuccess, onError);
            };
        })
        ;
