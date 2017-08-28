$EG.StatusBar = {
    updateCursorPos: function() {
        const activeEditor = $EG.Editor.ActiveEditor;
        const cursorPos = activeEditor && activeEditor.getCursor() ?
                          activeEditor.getCursor() : {ch: 0, line: 0};
        $('#status-area .cursor-pos').html('Line ' + cursorPos.line + ',' + ' Col ' + cursorPos.ch);
    }
};