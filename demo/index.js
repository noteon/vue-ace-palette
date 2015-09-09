

angular.module('angularPaletteDemoApp', ['palette']);
  
angular.module('angularPaletteDemoApp')
  .controller('MainCtrl', ['$scope','paletteService','$timeout', function($scope, paletteService,$timeout) {
    
    $scope.makeMessage = function () {
      alert('called from the palette!');
    }
    
    $scope.clearCommands=function(){
     // console.log("clearCommands");
      paletteService.clearCommands();
    }
    
    $scope.addCommands=function(){
     // console.log("addCommands");
     
      paletteService.addCommands([
        {
          name: "New Command: Alert Message",
          cmd: function () {
            $scope.makeMessage();
          },
          data: 'something'
        }
      ]);
      
    }

  }]);
    
angular.module('angularPaletteDemoApp')
  .controller('commandsCtrl', ['paletteService',function( paletteService,$timeout) {
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
    
  }]);    
