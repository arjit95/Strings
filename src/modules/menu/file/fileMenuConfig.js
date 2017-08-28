const fileMenuController = rootRequire("/modules/menu/file/fileMenuController"),
      projectManager = rootRequire('modules/project/projectManager'),
      {BrowserWindow} = require('electron');
const fileMenuTemplate = {
        label: 'File',
        submenu: [
            {
                label: 'Open File',
                accelerator: 'CommandOrControl+O',
                click() {
                    projectManager.openFile();
                }
            },
            {
                label: 'Open Folder',
                accelerator: 'CommandOrControl+Shift+O',
                click() {
                    projectManager.openFolder();
                }
            },
            {
                label: 'Save File',
                accelerator: 'CommandOrControl+S',
                click() {
                    webContents = BrowserWindow.fromId(windowManager.getFocusedWindowId()).webContents;
                    webContents.send('file-shortcut', 'save-file');
                }
            },
            {
                label: 'Save All File(s)',
                accelerator: 'CommandOrControl+Shift+S',
                click() {                
                    webContents = BrowserWindow.fromId(windowManager.getFocusedWindowId()).webContents;
                    webContents.send('file-shortcut', 'save-all-files');
                }
            },
            {
                label: 'Close File',
                accelerator: 'CommandOrControl+W',
                click() {
                    webContents = BrowserWindow.fromId(windowManager.getFocusedWindowId()).webContents;
                    webContents.send('file-shortcut', 'close-file');
                }
            },
            {
                label: 'Close All File(s)',
                accelerator: 'CommandOrControl+Shift+W',
                click() { 
                    webContents = BrowserWindow.fromId(windowManager.getFocusedWindowId()).webContents;
                    webContents.send('file-shortcut', 'close-all-files');
                }
            }
        ]
}

module.exports = {
    getMenuTemplate: function() {
        return fileMenuTemplate;
    }
}