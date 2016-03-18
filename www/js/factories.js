angular.module('taxis.factories', [])
        .factory('CurrentUser', function () {
            var currentUser = {};
            var defaultUser = {
                isLoggedIn: false
                , email: false
                , id: false
                , permissions: []
                , can: function (permiso) {
                    if (this.permissions) {
                        return (this.permissions.indexOf(permiso) >= 0) ? true : false;
                    }
                    return false;
                }
                , reset: function () {
                    return currentUser = angular.extend(currentUser, defaultUser);
                }
            };
            defaultUser.reset();
            return currentUser;
        })
        .factory('modal', function ($ionicModal) {
            var modalClassesType = {
                info: 'ion-information-circled positive'
                , success: 'ion-information-circled balanced'
                , warning: 'ion-alert-circled energized'
                , danger: 'ion-close-circled assertive'
                , question: 'ion-help-circled royal'
            };
            return function (message, title, type) {
                if (!title) {
                    title = 'Mensaje';
                }

                if (!modalClassesType[type]) {
                    type = 'info';
                }

                var modal = $ionicModal.fromTemplateUrl('templates/modal.html');
                modal.then(function (modal) {
                    var scope = modal.scope;

                    scope.modalIconClasses = modalClassesType[type];
                    scope.title = title;
                    scope.message = message;
                    scope.closeModal = function () {
                        modal.hide();
                    };
                    modal.show();
                });
            };
        })
        ;