'use strict';

//command
// interface command{
//   name:string;
//   bindKey:object, {mac:"command+r|command+w", win:"ctrl+r|ctrl+w"}
//   macShortcuts:string[];
//   cmd:Function
//   data:any;
// }

function hookAceFocusAndBlurEvent() {
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