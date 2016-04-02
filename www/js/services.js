angular.module('taxis.services', [])
        .service('WS', function ($http, $ionicLoading, modal) {

            this.serverUrl = 'http://taxis.biconsultingsc.com/service.php';

            /**
             * @function call
             * invoca la ejecucion de un metodo en el servidor
             * @param String entidad Entidad sobre la que se ejecuta la operacion, ej. Usuario, Proyecto, Tarea etc.
             * @param String operacion metodo a ejecutar sobre la entidad, ej. crear, listar, editar, eliminar, etc.
             * @param Object data parametros necesarios para ejecutar la operacion, 
             * ej. {email:'fulano@biconsulting.mx', password:'****'}
             **/
            this.call = function (entidad, operacion, data) {
                var request = $http({
                    url: this.serverUrl + '?entidad=' + entidad + '&operacion=' + operacion
                    , async: true
                    , method: 'POST'
                    , data: data
                    , headers: {
                        'Accept': 'application/json, text/javascript, */*; q=0.01'
                        , 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                });
                request.then(
                        function (result) {
                            if (result.data.response.output) {
                                debugOutput(result.data.response.output);
                            }
                        }, this.handleRequestError);
                return request;
            };
            function debugOutput(output) {
                if ('undefined' == typeof ventanaDebug || ventanaDebug.closed) {
                    ventanaDebug = window.open();
                }
                ventanaDebug.document.write(output);
                ventanaDebug.document.title = 'DebugTaxis';
                ventanaDebug.document.close();
            }

            this.handleRequestError = function (result) {
                $ionicLoading.hide();
                console.log(result);
                if ('string' == typeof result.data.response.message) {
                    modal('¡Oh no!., ' + result.data.response.message);
                    if (result.data.response.output) {
                        debugOutput(result.data.response.output);
                    }
                } else {
                    modal(':( Algo anda mal con la conexión.' + result.statusText);
                }
            };
        })
        ;