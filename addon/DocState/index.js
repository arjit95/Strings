const editorConst = $EG.Constants.Editor,
	  sEdit = require('./sEdit');;

$EG.EventEmitter.addListener(editorConst.DOC_EDITED, function(codeMirror) {
	var doc = codeMirror.getDoc();
	if(!$EG.EditorTabs.isTabMarkedDirty() && doc.historySize().undo > 0) {
		$EG.EditorTabs.markTabDirty();
	} else if($EG.EditorTabs.isTabMarkedDirty() && doc.historySize().undo <= 0) {
		$EG.EditorTabs.removeDirtyMarked();	
	}
	$EG.StatusBar.updateCursorPos();
}, sEdit.uid);