const {app} = require('electron'),
      path = require('path');
       
//Some globals
rootRequire = require('rfr');
rootRequire.root = path.join(process.cwd(), "src");
_ = require('underscore');
windowManager = rootRequire('modules/window/windowManager');

function createWindow () {
  // Create the browser window.
  windowManager.init();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow)

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
})

app.on("activate", () => {
  // On macOS it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.

})
