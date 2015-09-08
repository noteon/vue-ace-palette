'use strict';

//command
// interface command{
//   name:string;
//   winShortcuts:string[];
//   macShortcuts:string[];
//   cmd:string|Function
//   data:any;
// }

angular.module('palette', ['ngSanitize'])
  .factory('paletteService', [function () {

    var oldCommands = [];

    return {

      subscribedMethod: undefined,

      // exportCommands: function (newCommands) {
      //   if(typeof this.subscribedMethod !== 'undefined'){
      //     this.subscribedMethod(newCommands, oldCommands);
      //   }
      //   oldCommands = newCommands;
      // },
      
      addCommands: function (newCommands) {
        if (typeof this.subscribedMethod !== 'undefined') {
          this.subscribedMethod(newCommands, []);
        }

        oldCommands.push.apply(oldCommands, newCommands);
      },

      getCommands: function () {
        return oldCommands;
      },
      subscribe: function (fn) {
        // console.log('Setting up subscribe ', fn);
        this.subscribedMethod = fn;
      }
    };

  }])
  .directive('drBlur', function () {
    return function (scope, elem, attrs) {
      elem.bind('blur', function () {
        scope.$apply(attrs.drBlur);
      });
    };
  })
  .directive('drFocusOn', [function () {
    // will focus the element its applied to when the condition passed
    // to it is true. Value is interpolated at the moment, {{value}}
    // and so is equal to a string.
    //
    // When trying to use an actual true/false expression with binding '='
    // it was causing scope issues with the rest of module.
    return {
      restrict: 'A',
      link: function (scope, elem, attrs) {
        attrs.$observe('drFocusOn', function (newValue) {
          if (newValue === 'true') {
            setTimeout(function () {
              elem[0].focus();
            }, 100);
          }
        });
      }
    };
  }])
  .directive('drScrollToContain', function () {
    // Like the focus-on directive, the window will scroll to contain
    // any element with this applied to it when the condition passed is
    // true.
    return {
      restrict: 'A',
      link: function (scope, elem, attrs) {
        attrs.$observe('drScrollToContain', function (newValue) {
          if (newValue === 'true') {
            elem[0].scrollIntoView(false);
          }
        });
      }
    };
  })
  .directive('drKeydown', ['$parse', function ($parse) {
    // ng-keydown isn't in angular until 1.1.3 =(
    return {
      restrict: 'A',
      link: function (scope, elem, attrs) {
        elem.bind('keydown', function (e) {
          scope.$apply(function () {
            console.log("attrs.drKeydown", attrs.drKeydown);
            $parse(attrs.drKeydown)(scope, { $event: e });
          });
        });
      }
    };
  }])
  .filter('drHighlight', function () {

    // super ugly function needs beauty help
    function wrapText(index, str, prefix, suffix, innerTextLength) {
      return [str.slice(0, index), prefix, str.slice(index, index + innerTextLength), suffix, str.slice(index + innerTextLength)].join('');
    }

    return function (value, query) {
      
      var theValue=value?value:"";
      var lowerQuery=query?query.toLowerCase():"";
      
      var parts=theValue.split("<span");
      var namePart=parts[0];
      var shortcutPart=parts[1]?"<span"+parts[1]:"";
      
      
      if (typeof lowerQuery !== 'undefined' && lowerQuery !== '') {
        //console.log('drHighlight', namePart, lowerQuery);
        var ind = namePart.toLowerCase().indexOf(lowerQuery);
        if (ind !== -1) {
          return wrapText(ind, namePart, '<span class="palettematch">', '</span>', lowerQuery.length)+shortcutPart;
        }
      }
      return value;
    };
  })
  .directive('palette',
    ['$sce', '$timeout', '$location', '$route', 'paletteService',
      function ($sce, $timeout, $location, $route, paletteService) {
        return {
          restrict: 'EA',
          replace: true,
          scope: {},
          //templateUrl: 'angular-palette/palette.tpl.html',
          templateUrl: '../palette.tpl.html',

          link: function (scope) {

            /* =============================================================================
    
              MOUSETRAP DEPENDENCY
    
              Decided to go with Mousetrap as it looks like a very good keyboard shortcut
              library. The dependency makes sense because in this case the intended audience
              for angular-palette is people who want to make their applications keyboard and
              power user friendly, the same audience as Mousetrap. People that want to use
              angular-palette should also take advantage of mousetrap and bind many of their
              actions to keyboard shortcuts. In the future these keyboard shortcuts will be
              shown in the palette next to each of the commands.
    
            ============================================================================= */

            Mousetrap.bind(['ctrl+shift+p', 'command+shift+p'], function () {
              if (scope.visible) {
                scope.$apply(function () {
                  scope.close();
                });
              }
              else {
                scope.$apply(function () {
                  scope.open();
                });
              }
            });

          },

          controller: ['$scope', function ($scope) {

            var appVersion = 'navigator' in window && 'appVersion' in navigator && navigator.appVersion.toLowerCase() || '';
            
            var isWindows = function () {
              return /win/i.test(appVersion);
            };

            var isLinux = function () {
              return /linux/i.test(appVersion);
            };

            var isMac = function () {
              return /mac/i.test(appVersion);
            };


            var ENTER_KEY = 13,
              UP_ARROW_KEY = 38,
              DOWN_ARROW_KEY = 40,
              ESCAPE_KEY = 27;

            window["scope"] = $scope;
            $scope.visible = false;
            // some placeholder commands for the moment
            $scope.commands = [];

            function addRoutesToPallete() {
              for (var path in $route.routes) {
                var route = $route.routes[path];

                if (typeof route.name !== 'undefined') {
                  var routerName = 'Goto: ' + route.name;

                  $scope.commands.push({
                    name: routerName,
                    safeHtml: routerName,
                    cmd: 'link',
                    data: path
                  });
                }
              }
            }

            function removeOldCommands(oldCommands) {
              $scope.commands.splice(-oldCommands.length, oldCommands.length);
            }

            function addNewCommands(newCommands) {
              newCommands = newCommands.map(function (it) {
                it.safeHtml=it.name;
                //console.log($sce.trustAsHtml("Command Name<span style='position:fixed; right:1em'>CTRL+R</span>" ));
                
                var getShortcutsHtml=function (shortcuts){
                  return "<span class='palette-shortcuts'>"+shortcuts.join("|")+"</span>"
                }
                
                
                if (isMac() && it.macShortcuts){
                  it.safeHtml=it.name+getShortcutsHtml(it.macShortcuts)
                }else if (isWindows() && it.winShortcuts){
                  it.safeHtml=it.name+getShortcutsHtml(it.winShortcuts)
                }  

                return it;
              })

              $scope.commands.push.apply($scope.commands, newCommands);
            }

            paletteService.subscribe(function (newCommands, oldCommands) {
              removeOldCommands(oldCommands);
              addNewCommands(newCommands);
            });

            $scope.activeCmd = 0;
            addRoutesToPallete();

            $scope.paletteInputKeyHandler = function (e) {
              if (e.keyCode === UP_ARROW_KEY) {
                e.preventDefault();
                $scope.moveSelectUp();
              }
              else if (e.keyCode === DOWN_ARROW_KEY) {
                e.preventDefault();
                $scope.moveSelectDown();
              }
              else if (e.keyCode === ESCAPE_KEY) {
                $scope.close();
              }
              else if (e.keyCode === ENTER_KEY) {
                $scope.finish();
              }
              else {
                $scope.activeCmd = 0;
              }
            };

            $scope.moveSelectUp = function () {
              if ($scope.activeCmd > 0) {
                $scope.activeCmd--;
              }
              else {
                $scope.activeCmd = $scope.filteredCommands.length - 1;
              }
            };

            $scope.moveSelectDown = function () {
              if ($scope.activeCmd < $scope.filteredCommands.length - 1) {
                $scope.activeCmd++;
              }
              else {
                $scope.activeCmd = 0;
              }
            };

            $scope.finish = function () {
              if ($scope.visible) {
                $scope.useSelection($scope.filteredCommands[$scope.activeCmd]);
                $scope.close();
              }
            };

            $scope.close = function () {
              // if this isn't delayed then the palette closes (from the blur event)
              // before ng-clicks can fire this enables the mouse to be used to select
              // results (But seriously, don't use the mouse, you bad)
              $timeout(function () {
                $scope.visible = false;
              }, 1);
            };

            $scope.open = function () {
              $scope.query = '';
              $scope.visible = true;
              $scope.activeCmd = 0;
            };

            $scope.useSelection = function (selection) {
              if (typeof selection === 'undefined') {
                // Special Text Commands like ':300' to go 300px down
                // More features will be implemented later
                $scope.parseTextCommand($scope.query);
              }
              else {
                try {
                  if (typeof selection.cmd === 'function') {
                    selection.cmd(selection.data);
                  }
                  else {
                    // Built in commands like link and extLink
                    $scope[selection.cmd](selection.data);
                  }
                }
                catch (e) {
                  console.log('missing a command');
                }
              }
            };

            $scope.link = function (path) {
              $location.path(path);
            };

            $scope.extLink = function (path) {
              window.location = path;
            };

            $scope.parseTextCommand = function (query) {
              if (query[0] === ':') {
                var newQuery = parseInt(query.slice(1), 10);
                window.scrollTo(0, newQuery);
              }
            };

          }]
        };
      }]);
