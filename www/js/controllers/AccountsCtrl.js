angular.module('taxis.controllers.accounts', [])
        .controller('AccountsCtrl', function ($scope, $ionicModal, modal, $ionicLoading, WS, CurrentUser, $location, $timeout, $interval) {

            console.log(CurrentUser);
            $scope.accounts = JSON.parse(localStorage.getItem('accounts')) || {};
            $scope.currentUser = CurrentUser;
//            $scope.newAccount = false;
            // Form data for the login modal
            $scope.loginData = {};
            // Create the login modal that we will use later
            $ionicModal.fromTemplateUrl('templates/login.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
            // Triggered in the login modal to close it
            $scope.closeLogin = function () {
                $scope.modal.hide();
            };
            // Open the login modal
            $scope.showLogin = function (account) {
                if (account) {
                    $scope.loginData = account;
                } else {
                    $scope.loginData = {};
                }
                $scope.modal.show();
            };
            // Perform the login action when the user submits the login form
            $scope.doLogin = function (autologin) {

                $ionicLoading.show({
                    template: 'Validando Usuario...'
                });
                console.log('Doing login', $scope.loginData);
                var request = WS.call('Driver', 'login', $scope.loginData);
                request.then(
                        function (result) {/* success function */
                            $ionicLoading.hide();
                            if (0 === result.data.response.status) {
                                if (!autologin) {
                                    $scope.closeLogin();
                                }
                                //
                                var accountKey = $scope.loginData.email + '-' + $scope.loginData.circulation_plate;
                                if (!$scope.loginData.rememberPassword) {
                                    delete($scope.loginData.password);
                                }
                                $scope.accounts[accountKey] = $scope.loginData;
                                localStorage.setItem('accounts', JSON.stringify($scope.accounts));
                                //
                                CurrentUser.isLoggedIn = true;
                                for (var propKy in result.data.response.value) {
                                    CurrentUser[propKy] = result.data.response.value[propKy];
                                }
                                $timeout(function () {
                                    $location.path('/app/browse').replace();
                                }, 3000);
                            } else {
                                if (!autologin) {
                                    modal(result.data.response.message, 'Falló', 'danger');
                                }
                            }
                        },
                        WS.handleRequestError);
            };
            if (!CurrentUser.isLoggedIn) {
                $scope.doLogin(true);
            }

            $scope.removeAccount = function (accountIndex) {
                console.log('remove account id', accountIndex);
                delete($scope.accounts[accountIndex]);
                localStorage.setItem('accounts', JSON.stringify($scope.accounts));
            };
            $scope.logout = function () {
                var request = WS.call('User', 'logout');
                $ionicLoading.show({
                    template: 'Saliendo...'
                });
                request.then(
                        function (result) {/* success function */
                            $ionicLoading.hide();
                            if (0 === result.data.response.status) {
                                if (angular.isDefined(CurrentUser.updateLocationInterval)) {
                                    $interval.cancel(CurrentUser.updateLocationInterval);
                                    CurrentUser.updateLocationInterval = undefined;
                                }
                                CurrentUser.reset();
                                $location.path('/').replace();
                            } else {
                                modal(result.data.response.message);
                            }
                        },
                        WS.handleRequestError);
            };
        });