const fileMenuTemplate = {
        label: 'File',
        submenu: [
            {
                label: 'Open File',
                click: function() {
                    $EG.Project.openFile();
                },
                key: 'o',
                modifiers: 'ctrl'
            },
            {
                label: 'Open Folder',
                click: function() {
                    $EG.Project.openFolder();
                },
                key: 'o',
                modifiers: 'ctrl+shift'
            },
            {
                label: 'Save File',
                click: function() {
                    $EG.Project.saveFile();
                },
                key: 's',
                modifiers: 'ctrl'
            },
            {
                label: 'Save All File(s)',
                click: function() {                
                    $EG.Project.saveAllFiles();
                },
                key: 's',
                modifiers: 'ctrl+shift'
            },
            {
                label: 'Close File',
                click: function() {
                    $EG.EditorTabs.closeCurrentTab();
                },
                key: 'w',
                modifiers: 'ctrl'
            },
            {
                label: 'Close All File(s)',
                click: function() { 
                    $EG.EditorTabs.closeAllTabs();
                },
                key: 'w',
                modifiers: 'ctrl+shift'
            }
        ]
}

module.exports = {
    getMenuTemplate: function() {
        return fileMenuTemplate;
    }
}