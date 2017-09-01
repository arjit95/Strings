var shortcuts = rootRequire('modules/shortcuts/shortcuts');

const viewMenuTemplate = {
    label: 'View',
    submenu: [     
        {
           label: 'Toggle Full Screen',
           click: function() {
                shortcuts.toggleFullScreen();
           },
           key: 'F11'
        }
     ]
}

module.exports = {
    getMenuTemplate: function() {
        return viewMenuTemplate;
    }
}