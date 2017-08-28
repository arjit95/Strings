module.exports = {  
 registerClientShortcuts: function() {
  const {ipcRenderer} = require('electron'),
        path = require('path');
  //Start listening to server side messages
  //Handle file menu actions
  ipcRenderer.on('file-shortcut', function(event, message) {
      switch(message.event || message) {
        case 'open-file':
              $EG.EditorTabs.createNewTab(path.basename(message.filePath), message.filePath);
              break;
        case 'save-file': 
              $EG.Project.saveFile();      
              break;
        case 'close-file':
              $EG.EditorTabs.closeCurrentTab();
              break;
        case 'save-all-files':
              $EG.Project.saveAllFiles();
              break;
        case 'close-all-files':
              $EG.EditorTabs.closeAllTabs();
              break;
      }
  });
  ipcRenderer.on('edit-shortcut', function(event, message) {
        switch(message) {
          case 'Find File':
                $EG.Finder.startFinder();
                break;
        }
  })
 }
};