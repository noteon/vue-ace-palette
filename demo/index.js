

angular.module('angularPaletteDemoApp', ['palette','ngRoute'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        name: 'Main Page'
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
      .otherwise({
        redirectTo: '/'
      });
  });
  
angular.module('angularPaletteDemoApp')
  .controller('MainCtrl', ['$scope','paletteService','aceEditCommands', function($scope, paletteService,aceEditCommands) {
    $scope.makeMessage = function () {
      alert('called from the palette!');
    }

    paletteService.addCommands([
      {
        name: "Notify: Alert Message",
        cmd: function () {
          $scope.makeMessage();
        },
        data: 'something'
      }
    ]);
  }]);
    
  
angular.module('angularPaletteDemoApp')
  .service('aceEditCommands', ['paletteService', function(paletteService) {
    paletteService.addCommands([
      {
        name: "Edit Replace ...",
        winShortcuts:['CTRL+R'],
        macShortcuts:['⌘+R'],
        cmd: function () {
          alert('called from the palette!');
        },
        data: 'something'
      }
    ]);

    return;
  }]);    