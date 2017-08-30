/**
 * Handles the status bar related controls present at the
 * bottom of the editor
 */
$EG.StatusBar = {
    /**
     * Updates the cursor position  in status bar based on the
     * current position of cursor in editor
     */
    updateCursorPos: function() {
        const activeEditor = $EG.Editor.ActiveEditor;
        const cursorPos = activeEditor && activeEditor.getCursor() ?
                          activeEditor.getCursor() : {ch: 0, line: 0};
        $('#status-area .cursor-pos').html('Line ' + cursorPos.line + ',' + ' Col ' + cursorPos.ch);
    }
};