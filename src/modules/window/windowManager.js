const electron = require('electron'),
      {BrowserWindow} = electron,
      path = require("path"),
      url = require("url"),
      bootstrap = rootRequire('startup/bootstrap');    
      templatesPath = path.join(process.cwd(), "public", "static");

// Keep a global reference of the window object, if you don"t, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win = []
var focusedWindow = -1;
module.exports = {
    init: function() {
        const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize
        var window = new BrowserWindow({width: width, height: height})        
        // and load the index.html of the app.
        window.loadURL(url.format({
            pathname: path.join(templatesPath, "index.html"),
            protocol: "file:",
            slashes: true
        }));
        window.on('focus', function(evt){ 
            focusedWindow = this.id;
        })
        window.on('close', function(evt) {
            windowManager.destroyWinWithId(this.id);
        })
        var windowObj = {id: window.id, instance: window};
        win.push(windowObj);
        bootstrap.load();
        focusedWindow = window.id;
    },
    getFocusedWindowId: function() {
        return focusedWindow;
    },
    destroyWinWithId: function(id) {
        var winIndex = _.map(win, function(window) {
                            return window.id;
                        }).indexOf(id);
        windowManager.destroy(winIndex);
    },
    destroy: function(index) {
        if(index < 0 || index >= win.length) {
            return;
        }
        win[index].instance.destroy();
        win.splice(index, 1);
    },
    getAllWindows: function() {
       return _.map(win, function(window) {
                 return window.instance;
              });
    },
    getWindowAtIndex: function(index) {
        return win[index].instance;
    }
}