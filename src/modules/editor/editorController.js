var fs = require('fs');
var isThemeSet = false;
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

function switchToEditorAtIndex(editorIndex) {
    const focusedTab = $('#tabs-area').find('.tab[tabindex="'+editorIndex+'"]'),
          focusedEditor = $('#editors-area').find('.editor[editor-index="'+editorIndex+'"]');
    focusedTab.addClass('active');
    focusedEditor.addClass('active');
    $EG.Editor.prepareEditor(focusedEditor[0], true);
}

function prepareEditor(editorTextArea, dontDeactivate) {
    var myCodeMirror = CodeMirror.fromTextArea(editorTextArea, {
        styleActiveLine:  {nonEmpty: true},
        lineNumbers: true
    });
    myCodeMirror.getDoc().setValue('');
    var theme = configManager.getConfigValue('theme');
    setTheme(theme, myCodeMirror);

    myCodeMirror.on("keyup", function (cm, event) {
        if (!myCodeMirror.state.completionActive && /*Enables keyboard navigation in autocomplete list*/
        event.keyCode != 13 &&
        !(event.ctrlKey || event.altKey) && 
        ((event.keyCode >= 65 && event.keyCode <= 90) ||
        (event.keyCode >= 48 && event.keyCode <= 57) ||
        (event.keyCode >= 97 && event.keyCode <= 122))) {        /*Enter - do not open autocomplete list just after item has been selected in it*/ 
            CodeMirror.commands.autocomplete(cm, null, {completeSingle: false});
        }
        $EG.StatusBar.updateCursorPos();
        if(event.ctrlKey) {
            event.preventDefault();
            event.codemirrorIgnore = true;
            return false;
        }
    });

    var filePath = $(editorTextArea).attr('data-path');
    if(editorTextArea.value && editorTextArea.value.length > 0) {
        myCodeMirror.getDoc().setValue(editorTextArea.value);
    }
    else if(filePath) {
        console.log('Started reading file from path ' +filePath);
        console.time(filePath);
        var readStream = fs.createReadStream(filePath, 'utf8');
        readStream.on('data', function(chunk) {
            myCodeMirror.replaceRange(chunk, CodeMirror.Pos(myCodeMirror.lastLine()));
        }).on('end', function() {
            console.timeEnd(filePath);
        });
    }
    var editorIndex = editorTextArea.getAttribute('editor-index');
    if(editorIndex > 0 && !dontDeactivate) {
        $EG.Editor.deactivateCurrentEditor();
    }
    $EG.Editor.ActiveEditor = myCodeMirror;
    myCodeMirror.focus();
    $EG.StatusBar.updateCursorPos();
}

$EG.Editor = {
    prepareEditor: prepareEditor,
    setTheme: setTheme,
    ActiveEditor: null,
    deactivateCurrentEditor: deactivateCurrentEditor,
    switchToEditorAtIndex: switchToEditorAtIndex
}