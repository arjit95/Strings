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
/**
 * Clears the window from the window stack and destroy it completely, private fn.
 * @param {Number} index - The index of window in array 
 * @returns {undefined}
 */
var __destroy__ =  function(index) {
    if(index < 0 || index >= win.length) {
        return;
    }
    win[index].instance.destroy();
    win.splice(index, 1);
}

/**
 * Handles multiple window implementation for the editor,
 * Eg: When opening a new folder
 */
module.exports = {
    /**
     * Creates a new electron window with the screen width and height.
     * @returns {undefined}
     */
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

    /**
     * Gets the window id which is currently focused.
     * @returns {Number} The id for the window
     */
    getFocusedWindowId: function() {
        return focusedWindow;
    },

    /**
     * Removes and close the window with the given id.
     * @param {Number} id - The id for the window
     * @returns {undefined}
     */
    destroyWinWithId: function(id) {
        var winIndex = _.map(win, function(window) {
                            return window.id;
                        }).indexOf(id);
        __destroy__(winIndex);
    },
    /**
     * Returns all the window instances for the editor
     * @returns {Array} All electron window instances
     */
    getAllWindows: function() {
       return _.map(win, function(window) {
                 return window.instance;
              });
    }
}