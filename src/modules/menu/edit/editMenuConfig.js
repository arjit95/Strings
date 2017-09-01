const editMenuTemplate = {
    label: 'Edit',
    submenu: [
       {
            label: "Undo",
            click: function() {
                if($EG.Editor.ActiveEditor) {
                    CodeMirror.commands.undo($EG.Editor.ActiveEditor);
                }
            },
            key: "z",
            modifiers: "ctrl"
       },
       {
            label: "Redo",
            click: function() {
                if($EG.Editor.ActiveEditor) {
                    CodeMirror.commands.redo($EG.Editor.ActiveEditor);
                }
            },
            key: "y",
            modifiers: "ctrl"
       },
       {
            label: "Cut",
            click: function() {
                if($EG.Editor.ActiveEditor && $EG.Editor.ActiveEditor.getSelection().length > 0) {
                    document.execCommand('cut');
                }
            },
            key: "x",
            modifiers: "ctrl"
       },
       {
            label: "Copy",
            click: function() {
                if($EG.Editor.ActiveEditor && $EG.Editor.ActiveEditor.getSelection().length > 0) {
                    document.execCommand('copy');
                }
            },
            key: "c",
            modifiers: "ctrl"
       },
       {
            label: "Paste",
            click: function() {
                if($EG.Editor.ActiveEditor && $EG.Editor.ActiveEditor.getSelection().length > 0) {
                    document.execCommand('paste');
                }
            },
            key: "y",
            modifiers: "ctrl"
       },
       {
            label: "Select All",
            click: function() {
                if($EG.Editor.ActiveEditor) {
                    CodeMirror.commands.selectAll($EG.Editor.ActiveEditor);
                }
            },
            key: "a",
            modifiers: "ctrl"
       },
       {
            label: 'Find File',
            click: function() {
               $EG.Finder.startFinder();
            },
            key: "p",
            modifiers: "ctrl"
        }
    ]
 }

 module.exports = {
     getMenuTemplate: function() {
         return editMenuTemplate;
     }
 }