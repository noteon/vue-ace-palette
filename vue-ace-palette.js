"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/// <reference path="./typings/tsd.d.ts" />
//command
// interface command{
//   name:string;
//   bindKey:{mac:string, win:string}
//   cmd:Function
//   data:any;
// }
function trimQuery(query) {
    return query && query.replace(/:/g, "").replace(/ /g, "");
}
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
function getAceCommands() {
    var commands = [];
    if (!ace)
        return [];
    var editor = ace.__paletteFocusEditor;
    if (!editor)
        return [];
    if (!editor.commands)
        return [];
    if (!editor.commands.commands)
        return [];
    var exec = function (commandName) {
        return function () {
            var theEditor = ace.__paletteFocusEditor;
            if (!theEditor)
                return;
            theEditor.focus();
            //window["curEditor"] = theEditor;
            return theEditor.execCommand(commandName);
        };
    };
    var aceCommandNamingMap = {
        "showSettingsMenu": null,
        "goToNextError": "goToNextError",
        "goToPreviousError": "goToPreviousError",
        "selectall": "selectAll",
        "centerselection": "centerSelection",
        "gotoline": "gotoLine",
        "fold": "fold",
        "unfold": "unfold",
        "toggleFoldWidget": "toggleFoldWidget",
        "toggleParentFoldWidget": "toggleParentFoldWidget",
        "foldall": "foldAll",
        "foldOther": "foldOther",
        "unfoldall": "unfoldAll",
        "findnext": "findNext",
        "findprevious": "findPrevious",
        "selectOrFindNext": "selectOrFindNext",
        "selectOrFindPrevious": "selectOrFindPrevious",
        "find": "find",
        "overwrite": "overwrite",
        "selecttostart": "selectToStart",
        "gotostart": "gotoStart",
        "selectup": "selectUp",
        "golineup": "goLineUp",
        "selecttoend": "selectToEnd",
        "gotoend": "gotoEnd",
        "selectdown": "selectDown",
        "golinedown": "goLineDown",
        "selectwordleft": "selectWordLeft",
        "gotowordleft": "gotoWordLeft",
        "selecttolinestart": "selectToLineStart",
        "gotolinestart": "gotoLineStart",
        "selectleft": "selectLeft",
        "gotoleft": "gotoLeft",
        "selectwordright": "selectWordRight",
        "gotowordright": "gotoWordRight",
        "selecttolineend": "selectToLineEnd",
        "gotolineend": "gotoLineEnd",
        "selectright": "selectRight",
        "gotoright": "gotoRight",
        "selectpagedown": "selectPageDown",
        "pagedown": "pageDown",
        "gotopagedown": "gotoPageDown",
        "selectpageup": "selectPageUp",
        "pageup": "pageUp",
        "gotopageup": "gotoPageUp",
        "scrollup": "scrollUp",
        "scrolldown": "scrollDown",
        "selectlinestart": "selectLineStart",
        "selectlineend": "selectLineEnd",
        "togglerecording": null,
        "replaymacro": null,
        "jumptomatching": "jumpToMatching",
        "selecttomatching": "selectToMatching",
        "expandToMatching": "expandToMatching",
        "passKeysToBrowser": null,
        "copy": "copy",
        "cut": "cut",
        "paste": "paste",
        "removeline": "removeLine",
        "duplicateSelection": "duplicateSelection",
        "sortlines": "sortLines",
        "togglecomment": "toggleComment",
        "toggleBlockComment": "toggleBlockComment",
        "modifyNumberUp": "modifyNumberUp",
        "modifyNumberDown": "modifyNumberDown",
        "replace": "replace",
        "undo": "undo",
        "redo": "redo",
        "copylinesup": "copyLinesUp",
        "movelinesup": "moveLinesUp",
        "copylinesdown": "copyLinesDown",
        "movelinesdown": "moveLinesDown",
        "del": "del",
        "backspace": "backspace",
        "cut_or_delete": "cut_or_delete",
        "removetolinestart": "removeToLineStart",
        "removetolineend": "removeToLineEnd",
        "removewordleft": "removeWordLeft",
        "removewordright": "removeWordRight",
        "outdent": "outdent",
        "indent": "indent",
        "blockoutdent": "blockOutdent",
        "blockindent": "blockIndent",
        "insertstring": null,
        "inserttext": null,
        "splitline": "splitLine",
        "transposeletters": "transposeLetters",
        "touppercase": "toUpperCase",
        "tolowercase": "toLowerCase",
        "expandtoline": "expandToLine",
        "joinlines": "joinLines",
        "invertSelection": "invertSelection",
        "addCursorAbove": "addCursorAbove",
        "addCursorBelow": "addCursorBelow",
        "addCursorAboveSkipCurrent": "addCursorAboveSkipCurrent",
        "addCursorBelowSkipCurrent": "addCursorBelowSkipCurrent",
        "selectMoreBefore": "selectMoreBefore",
        "selectMoreAfter": "selectMoreAfter",
        "selectNextBefore": "selectNextBefore",
        "selectNextAfter": "selectNextAfter",
        "splitIntoLines": "splitIntoLines",
        "alignCursors": "alignCursors",
        "findAll": "findAll"
    };
    var cmds = Object.keys(editor.commands.commands).map(function (key) {
        var command = editor.commands.commands[key];
        if (aceCommandNamingMap[key] === null)
            return;
        return {
            name: "Editor: " + _.startCase(aceCommandNamingMap[key] ? aceCommandNamingMap[key] : key),
            bindKey: command.bindKey,
            cmd: function () {
                _.delay(function () {
                    exec(command.name)();
                }, 10);
            }
        };
    });
    //console.log('ace commands', lines.join("\n"));
    cmds = cmds.filter(function (it) { return !!it; });
    commands.push.apply(commands, cmds);
    return commands;
}
/// <reference path="../../../../typings/app.d.ts"/>
var Vue = require('vue');
var vue_typescript_1 = require('vue-typescript');
var CommandPalette = (function (_super) {
    __extends(CommandPalette, _super);
    function CommandPalette() {
        _super.apply(this, arguments);
        this.visible = false;
        this.commands = [];
        this.query = "";
        this.activeCmd = 0;
        this.currentFocusNode = null;
        this.oldCommands = [];
    }
    CommandPalette.prototype.watch_visible = function (newValue, oldVal) {
        var $input = this.$el.querySelector('input');
        if (!$input)
            return;
        if (newValue === true) {
            var setElemFocus = function (timeOut) {
                setTimeout(function () {
                    //console.log("time out elem focus");
                    $input.focus();
                }, timeOut);
            };
            setElemFocus(100);
            setElemFocus(200);
        }
    };
    CommandPalette.prototype.addCommands = function (newCommands) {
        this.oldCommands = _.union(this.oldCommands, newCommands);
    };
    CommandPalette.prototype.clearCommands = function () {
        // if (typeof this.subscribedMethod !== 'undefined') {
        //   this.subscribedMethod([], oldCommands);
        // }
        this.oldCommands = [];
    };
    CommandPalette.prototype.getCommands = function () {
        return this.oldCommands;
    };
    CommandPalette.prototype.ready = function () {
        var _this = this;
        Mousetrap.bindGlobal(['ctrl+shift+p', 'command+shift+p'], function () {
            if (_this.visible) {
                _this.close();
            }
            else {
                _this.open();
            }
        });
    };
    Object.defineProperty(CommandPalette.prototype, "filteredCommands", {
        get: function () {
            var filterItems = _.filter(this.commands, this.filterStartCaseName) || [];
            return _.orderBy(filterItems, ["name"]);
            //} | orderBy: ' + "'name'" + '| filter:filterStartCaseName ))
        },
        enumerable: true,
        configurable: true
    });
    CommandPalette.prototype.filterStartCaseName = function (value, index, array) {
        var queryStr = this.query;
        if (!queryStr)
            return true;
        if (!value)
            return false;
        queryStr = trimQuery(queryStr);
        return value.name && (value.name.replace(/( |: )/g, '').toLowerCase().indexOf(queryStr.toLowerCase()) > -1);
    };
    CommandPalette.prototype.addNewCommands = function (newCommands) {
        newCommands = newCommands.map(function (it) {
            it.safeHtml = it.name;
            //console.log($sce.trustAsHtml("Command Name<span style='position:fixed; right:2em'>CTRL+R</span>" ));
            var getPlatform = function () {
                if (isMac())
                    return 'mac';
                if (isWindows())
                    return 'win';
                if (isLinux())
                    return 'linux';
                return 'unknown';
            };
            var platform = getPlatform();
            var getShortcutsHtml = function (bindKey) {
                var shortCut = _.isString(bindKey) ? bindKey : bindKey[platform];
                if (!shortCut)
                    return "";
                if (shortCut && (platform === 'mac')) {
                    shortCut = shortCut.replace(/Command/g, "⌘");
                    shortCut = shortCut.replace(/Up/g, "↑");
                    shortCut = shortCut.replace(/Down/g, "↓");
                    shortCut = shortCut.replace(/Left/g, "←");
                    shortCut = shortCut.replace(/right/g, "→");
                    shortCut = shortCut.replace(/Backspace/g, "⌫");
                }
                return "<span class='palette-shortcuts'>" + shortCut || "" + "</span>";
            };
            it.safeHtml = it.name + (it.bindKey ? getShortcutsHtml(it.bindKey) : "");
            return it;
        });
        this.commands = _.union(this.commands, newCommands);
    };
    CommandPalette.prototype.paletteInputKeyHandler = function (e) {
        var ENTER_KEY = 13, UP_ARROW_KEY = 38, DOWN_ARROW_KEY = 40, ESCAPE_KEY = 27;
        if (e.keyCode === UP_ARROW_KEY) {
            e.preventDefault();
            this.moveSelectUp();
        }
        else if (e.keyCode === DOWN_ARROW_KEY) {
            e.preventDefault();
            this.moveSelectDown();
        }
        else if (e.keyCode === ESCAPE_KEY) {
            this.close();
        }
        else if (e.keyCode === ENTER_KEY) {
            this.finish();
        }
        else {
            this.activeCmd = 0;
        }
    };
    CommandPalette.prototype.moveSelectUp = function () {
        if (this.activeCmd > 0) {
            this.activeCmd--;
        }
        else {
            this.activeCmd = this.filteredCommands.length - 1;
        }
    };
    CommandPalette.prototype.moveSelectDown = function () {
        if (this.activeCmd < this.filteredCommands.length - 1) {
            this.activeCmd++;
        }
        else {
            this.activeCmd = 0;
        }
    };
    ;
    CommandPalette.prototype.finish = function () {
        if (this.visible) {
            this.useSelection(this.filteredCommands[this.activeCmd]);
            this.close();
        }
    };
    ;
    CommandPalette.prototype.close = function () {
        var _this = this;
        // if this isn't delayed then the palette closes (from the blur event)
        // before ng-clicks can fire this enables the mouse to be used to select
        // results (But seriously, don't use the mouse, you bad)
        _.delay(function () {
            _this.visible = false;
            if (ace.__paletteFocusEditor)
                ace.__paletteFocusEditor.focus();
        }, 1);
    };
    ;
    CommandPalette.prototype.open = function () {
        this.commands = [];
        //var cmds = getAceCommands();
        //console.log('paletteService,getCommands', cmds);
        this.currentFocusNode = document.getSelection().baseNode;
        if (ace.__paletteFocusEditor)
            ace.__paletteFocusEditor.blur();
        this.addNewCommands(this.oldCommands);
        this.addNewCommands(getAceCommands());
        this.query = "";
        this.visible = true;
        this.activeCmd = 0;
    };
    ;
    CommandPalette.prototype.useSelection = function (selection) {
        if (typeof selection === 'undefined') {
            // Special Text Commands like ':300' to go 300px down
            // More features will be implemented later
            this.parseTextCommand(this.query);
        }
        else {
            try {
                if (typeof selection.cmd === 'function') {
                    selection.cmd(selection.data);
                }
                else {
                    // Built in commands like link and extLink
                    this[selection.cmd](selection.data);
                }
            }
            catch (e) {
                console.log('missing a command');
            }
        }
    };
    ;
    CommandPalette.prototype.clickCommand = function (selection) {
        this.useSelection(selection);
        this.close();
    };
    CommandPalette.prototype.parseTextCommand = function (query) {
        if (query[0] === ':') {
            var newQuery = parseInt(query.slice(1), 10);
            window.scrollTo(0, newQuery);
        }
    };
    ;
    CommandPalette.prototype.drHighlight = function (value) {
        // super ugly function needs beauty help
        function wrapText(index, str, prefix, suffix, innerTextLength) {
            return [str.slice(0, index), prefix, str.slice(index, index + innerTextLength), suffix, str.slice(index + innerTextLength)].join('');
        }
        var theValue = value ? value : "";
        var parts = theValue.split("<span");
        var namePart = parts[0];
        var shortcutPart = parts[1] ? "<span" + parts[1] : "";
        var query = trimQuery(this.query);
        if (typeof query !== 'undefined' && query !== '') {
            var reg = new RegExp(query.split('').join('\\s?'), 'i');
            var replaceColonNamePart = namePart.replace(":", "");
            var execRst = reg.exec(replaceColonNamePart);
            var ind = execRst.index;
            if (ind > -1) {
                var colonIdx = namePart.indexOf(":");
                var lenPlusOne = (colonIdx > ind && colonIdx <= (ind + execRst[0].length));
                var len = execRst[0].length + (lenPlusOne ? 1 : 0);
                if (ind >= (colonIdx + 1))
                    ind++;
                return wrapText(ind, namePart, '<span class="palettematch">', '</span>', len) + shortcutPart;
            }
        }
        return value;
    };
    ;
    __decorate([
        vue_typescript_1.Watch("visible")
    ], CommandPalette.prototype, "watch_visible", null);
    CommandPalette = __decorate([
        vue_typescript_1.VueComponent({
            template: "\n            <div class=\"palette-body\" v-bind:class=\"{palettevisible: visible}\">\n              <div class=\"palette-inner\">\n                <input type=\"text\" class=\"palette-input\" v-model=\"query\"\n                    @keydown=\"paletteInputKeyHandler($event)\">\n\n                    <div class=\"palette-results\" v-show=\"filteredCommands.length\">\n                        <div class=\"palette-item\"\n                          v-for=\"command in filteredCommands\"\n                          v-bind:class=\"{selected: $index == activeCmd}\"\n                          v-scroll-to-contain=\"$index == activeCmd\"\n                          @click=\"clickCommand(command)\">\n                          {{{drHighlight(command.safeHtml)}}}  \n                        </div>\n                  </div>\n                </div>\n            </div>",
            directives: {
                scrollToContain: {
                    update: function (newValue, oldValue) {
                        // do something based on the updated value
                        // this will also be called for the initial value
                        newValue && this.el.scrollIntoView(false);
                    },
                },
            }
        })
    ], CommandPalette);
    return CommandPalette;
}(Vue));
exports.CommandPalette = CommandPalette;
//command
// interface command{
//   name:string;
//   bindKey:object, {mac:"command+r|command+w", win:"ctrl+r|ctrl+w"}
//   macShortcuts:string[];
//   cmd:Function
//   data:any;
// }
//add by qinghai
(function () {
    if (!ace)
        return;
    var oldEditFunc = ace.edit;
    var newAceEdit = function (e) {
        var editor = oldEditFunc(e);
        if (editor["__paletteFocusEventSetup"])
            return editor;
        editor.on("focus", function () {
            ace["__paletteFocusEditor"] = editor;
        });
        editor.on("blur", function () {
            ace["__paletteFocusEditor"] = editor;
        });
        editor["__paletteFocusEventSetup"] = true;
        return editor;
    };
    ace.edit = newAceEdit.bind(ace);
})();
