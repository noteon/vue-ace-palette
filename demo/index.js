

angular.module('angularPaletteDemoApp', ['palette','ngRoute'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        name: 'Main Page'
      })
      .when('/something', {
        templateUrl: 'views/something.html',
        controller: 'SomethingCtrl',
        name: 'Something Page'
      })
      .when('/first', {
        templateUrl: 'views/first.html',
        controller: 'FirstCtrl',
        name: 'First Page'
      })
      .when('/thirdly', {
        templateUrl: 'views/thirdly.html',
        controller: 'ThirdlyCtrl',
        name: 'The Thirdly Page'
      })
      .when('/item/:id', {
        templateUrl: 'views/item.html',
        controller: 'ItemCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
  
angular.module('angularPaletteDemoApp')
  .controller('MainCtrl', ['$scope','paletteService', function($scope, paletteService) {
    $scope.makeMessage = function () {
      alert('called from the palette!');
    }

    paletteService.exportCommands([
      {
        name: "Notify: Alert Message",
        cmd: function () {
          $scope.makeMessage();
        },
        data: 'something'
      }
    ]);

  }]);  