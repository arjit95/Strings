module.exports = {  
  toggleFullScreen : function() {
        var gui = window.require('nw.gui');
        gui.Window.get().toggleFullscreen();
  }
};