'use strict';

//command
// interface command{
//   name:string;
//   bindKey:{mac:string, win:string}
//   cmd:Function
//   data:any;
// }

angular.module('palette', ['ngSanitize'])
  .factory('paletteService', [function () {

    var oldCommands = [];

    return {

      addCommands: function (newCommands) {
        oldCommands.push.apply(oldCommands, newCommands);
      },
      
      clearCommands:function(){
        if (typeof this.subscribedMethod !== 'undefined') {
          this.subscribedMethod([], oldCommands);
        }
        
        return oldCommands=[];
      },

      getCommands: function () {
        return oldCommands;
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
            //console.log("attrs.drKeydown", attrs.drKeydown);
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
    ['$sce', '$timeout', 'paletteService',
      function ($sce, $timeout, paletteService) {
        return {
          restrict: 'EA',
          replace: true,
          scope: {},
          //templateUrl: 'angular-palette/palette.tpl.html',
          template:[
'<div class="palette-body" ng-class="{palettevisible: visible}">',
    '<div class="palette-inner">',
        '<input type="text" class="palette-input" ng-model="query.name"',
             'dr-blur="close()"',
             'dr-focus-on="{{visible}}" dr-keydown="paletteInputKeyHandler($event)">',
            
        '<div class="palette-results" ng-show="filteredCommands.length">',
            '<div class="palette-item"',
                'ng-repeat="command in (filteredCommands = (commands | orderBy: '+"'name'"+'| filter:query ))"',
                'ng-class="{selected: $index == activeCmd}"',
                'ng-bind-html="command.safeHtml | drHighlight:query.name"',
                'dr-scroll-to-contain="{{$index == activeCmd}}"',
                'ng-click="useSelection(command)">',
            '</div>',
        '</div>',
    '</div>',
'</div>',
          ].join(" "),

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

            Mousetrap.bindGlobal(['ctrl+shift+p', 'command+shift+p'], function () {
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

          controller: ['$scope','aceEditorCommands', function ($scope,aceEditorCommands) {

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

            $scope.visible = false;
            // some placeholder commands for the moment
            $scope.commands = [];

            function addNewCommands(newCommands) {
              newCommands = newCommands.map(function (it) {
                it.safeHtml=it.name;
                //console.log($sce.trustAsHtml("Command Name<span style='position:fixed; right:2em'>CTRL+R</span>" ));
                
                var getPlatform=function(){
                  if (isMac()) return 'mac';
                  if (isWindows()) return 'win';
                  if (isLinux()) return 'linux';
                  
                  return 'unknown';
                }
                
                var platform=getPlatform();
                var getShortcutsHtml=function (bindKey){
                  return "<span class='palette-shortcuts'>"+bindKey[platform] || ""+"</span>"
                }
                
               it.safeHtml=it.name+  (it.bindKey?getShortcutsHtml(it.bindKey):"")
               
                return it;
              })

              
              $scope.commands.push.apply($scope.commands, newCommands);
            }


            $scope.activeCmd = 0;
            //addRoutesToPallete();

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
              $scope.commands=[];
              
              var cmds=paletteService.getCommands();
              console.log('paletteService,getCommands',cmds);
              
              addNewCommands(aceEditorCommands.getCommands());
              addNewCommands(cmds);

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

            $scope.parseTextCommand = function (query) {
              if (query[0] === ':') {
                var newQuery = parseInt(query.slice(1), 10);
                window.scrollTo(0, newQuery);
              }
            };

          }]
        };
      }]);



//command
// interface command{
//   name:string;
//   bindKey:object, {mac:"command+r|command+w", win:"ctrl+r|ctrl+w"}
//   macShortcuts:string[];
//   cmd:Function
//   data:any;
// }
//add by qinghai
function hookAceFocusAndBlurEvent() {
    if (!ace) return;
    
    var oldEditFunc=ace.edit;
    var newAceEdit=function(e){
      var editor=oldEditFunc(e)
      if (editor["__paletteFocusEventSetup"])
         return editor;
      
      editor.on("focus",function(){
          ace["__paletteFocusEditor"]=editor;
      });
      
      editor.on("blur",function(){
          ace["__paletteFocusEditor"]=editor;
      });
      editor["__paletteFocusEventSetup"]=true;
      
      return editor;
    }
    
    ace.edit=newAceEdit.bind(ace);
};

hookAceFocusAndBlurEvent();

angular.module('palette')
  .factory('aceEditorCommands', ['$timeout', function ($timeout) {
    return {
      getCommands: function () {
        var commands = [];
        
        if (!ace) return [];

        var editor = ace.__paletteFocusEditor;
        if (!editor) return [];

        var exec = function (commandName) {
          return function () {
            var theEditor = ace.__paletteFocusEditor;
            //theEditor.setFocus();
            window["curEditor"]=theEditor;
            return theEditor.execCommand(commandName);
          }
        }
        
        //var platform=editor.commands.platform;
        var cmds = Object.keys(editor.commands.commands).map(function (key) {
          var command = editor.commands.commands[key];

          return {
            name: command.name,
            bindKey: command.bindKey,
            cmd: function () {
              $timeout(function () {
                exec(command.name)();
              }, 10)
            }
          }
        });
        // console.log('ace commands', cmds);
        
        
        commands.push.apply(commands, cmds);

        return commands;
      }
    };
  }])