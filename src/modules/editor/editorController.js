var fs = require('fs'),
    path = require('path'),
    isThemeSet = false;
//Match autocomplete css with active editor theme
function setTheme(themeName, myCodeMirror) {
    if(!isThemeSet) {
        $('#theme-css').attr('href','../resources/codemirror/theme/' +themeName+ '.css');
        var styledString = '\n.CodeMirror-hints, .CodeMirror-hint { \n';
        styledString += 'background:' +  $('.CodeMirror').css('background-color') + ';\n';
        styledString += 'color:' +  $('.CodeMirror').css('color') + ';\n';
        $('#hints-style').text(styledString);
    }
    isThemeSet = true;
    myCodeMirror.setOption('theme', themeName);
}

/**
 * Deactivates the current editor
 * @param {Number} switchTo The index of the editor
 * @returns {undefined}
 */
function deactivateCurrentEditor(switchTo) {
    const currentTab = $('#tabs-area .tab.active'),
          currentEditor = $('#editors-area .editor.active');
    if(currentTab.length > 0) {
        currentTab.removeClass('active');
        currentEditor.removeClass('active');
    }
    if($EG.Editor.ActiveEditor) {
        $EG.Editor.ActiveEditor.toTextArea();
        $EG.Editor.ActiveEditor.getTextArea().style.display = 'none';
        $EG.Editor.ActiveEditor = null;
    }
    //Switches to the editor at given index
    if(switchTo >= 0) {
        $EG.Editor.switchToEditorAtIndex(switchTo);
    }
}

/**
 * Switches the editor tab at given index
 * @param {Number} editorIndex The index for the editor to be switched
 * @returns {undefined}
 */
function switchToEditorAtIndex(editorIndex) {
    const focusedTab = $('#tabs-area').find('.tab[tabindex="'+editorIndex+'"]'),
          focusedEditor = $('#editors-area').find('.editor[editor-index="'+editorIndex+'"]');
    focusedTab.addClass('active');
    focusedEditor.addClass('active');
    $EG.Editor.prepareEditor(focusedEditor[0], true);
}

/**
 * Initializes a new editor in the active tab
 * @param {DOMObject} editorTextArea The text area which is to be converted into editor
 * @param {Boolean} dontDeactivate true if the opened editor is to be deactivated
 */
function prepareEditor(editorTextArea, dontDeactivate) {
    var myCodeMirror = CodeMirror.fromTextArea(editorTextArea, {
        styleActiveLine:  {nonEmpty: true},
        lineNumbers: true,
        viewportMargin: Infinity
    });    
    var theme = configManager.getConfigValue('theme');
    setTheme(theme, myCodeMirror);
    
    myCodeMirror.on('change', function (cm, event) {
        CodeMirror.commands.autocomplete(cm, null, {completeSingle: false});
        $EG.EventEmitter.emit($EG.Constants.Editor.DOC_EDITED, myCodeMirror);
    })

    var filePath = $(editorTextArea).attr('data-path');
    if(filePath) {
        console.log('Started reading file from path ' +filePath);
        console.time(filePath);
        var readStream = fs.createReadStream(filePath, 'utf8');
        readStream.on('data', function(chunk) {
            myCodeMirror.replaceRange(chunk, CodeMirror.Pos(myCodeMirror.lastLine()));
        }).on('end', function() {
            console.timeEnd(filePath);
            //Clear the undo/redo history and set cursor to start.
            myCodeMirror.getDoc().clearHistory();
            myCodeMirror.setCursor(0,0);
            $EG.EventEmitter.emit($EG.Constants.Editor.DOC_OPENED);
        });
    }
    var editorIndex = editorTextArea.getAttribute('editor-index');
    if(editorIndex > 0 && !dontDeactivate) {
        $EG.Editor.deactivateCurrentEditor();
    }
    $EG.Editor.ActiveEditor = myCodeMirror;
    myCodeMirror.focus();
    var fileName = filePath ? path.basename(filePath) : 'New File';
    $('head title').text('Strings |' + ' ' +fileName);
}

$EG.Editor = {
    prepareEditor: prepareEditor,
    setTheme: setTheme,
    ActiveEditor: null,
    deactivateCurrentEditor: deactivateCurrentEditor,
    switchToEditorAtIndex: switchToEditorAtIndex
}