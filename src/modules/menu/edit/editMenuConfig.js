const {BrowserWindow} = require('electron');

const editMenuTemplate = {
    label: 'Edit',
    submenu: [
       {
            role: 'undo'
       },
       {
            role: 'redo'
       },
       {
            type: 'separator'
       },
       {
            role: 'cut'
       },
       {
            role: 'copy'
       },
       {
            role: 'paste'
       },
       {
            role: 'delete'
       },
       {
            role: 'selectall'
       },
       {
            label: 'Find File',
            accelerator: 'CommandOrControl+P',
            click() {
                webContents = BrowserWindow.fromId(windowManager.getFocusedWindowId()).webContents;
                webContents.send('edit-shortcut', 'Find File');
            }
        }
    ]
 }

 module.exports = {
     getMenuTemplate: function() {
         return editMenuTemplate;
     }
 }