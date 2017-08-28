var {dialog,BrowserWindow} = require('electron'),
      fs = require('fs'),
      configManager = rootRequire('modules/utils/configManager');
module.exports = {
    openFile: function() {
        dialog.showOpenDialog(function (fileNames) {
            if (fileNames === undefined) {
                return;
            }
            var webContents = BrowserWindow.fromId(windowManager.getFocusedWindowId()).webContents;
            webContents.send('file-shortcut', {event: 'open-file', filePath: fileNames[0]});
        });
    },
    openFolder: function() {
        dialog.showOpenDialog({properties: ['openDirectory']}, function(folderName) {
            if (folderName === undefined) {
                return;
            }
            configManager.setConfigValue('projectRoot', folderName[0]);
            windowManager.init();
        });
    }
}