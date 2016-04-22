/**
 * Definimos la variable que almacenará nuestro promise:
 *
 * var promise_request;
 *
 * Cuando hagamos el request lo almacenamos dentro de la variable, de esta forma almacenamos y ejecutamos el promise:
 *
 * (promise_request = MyFactory.RequestCall()).then(...);
 *
 * Esta función ejecutará la función abort de nuestro promise, solo si tenemos el promise almacenado:
 *
 * var abort_request = function(){
 * 	return (promise_request && promise_request.abort());
 * };
 *
 * Ejecutamos el abort para cancelar los requests que tengamos:
 *
 * abort_request();
 */

(function(){

  'use strict';

  angular.module('MyProject')
    .factory('MyFactory', function (
      $q,
      $http
    ) {

      function MyFactory() {}

      /**
       * Esta es la función que nos devolverá el promise, haciendo una llamada GET al endpoint definido y pasando los parámetros requeridos
       */
      MyFactory.RequestCall = function(params){
        var canceler = $q.defer();

        var url = 'my.end.point/';

        var request = $http({
          method: 'get',
          params: params,
          url: url,
          timeout: canceler.promise
        });

        var promise = request.then(
          function(res){
            return res.data;
          }, function(){
            return( $q.reject('Request canceled'));
          }
        );

        promise.abort = function(){
          canceler.resolve();
        };

        promise.finally(function(){
          console.info('Cleaning up object references');
          promise.abort = angular.noop;
          canceler = request = promise = null;
        });

        return (promise);

      };

      return MyFactory;

    });

}());
