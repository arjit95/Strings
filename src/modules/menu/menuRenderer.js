const path = require("path"),
      {app, BrowserWindow, Menu, MenuItem} = require('electron');
      
function render() {
    console.log("Menu rendering started");
    const menus = ['File', 'Edit', 'View', 'Help'];
    var template = []
    _.each(menus, function(menu) {
        const configsBasePath = path.join('modules', 'menu'),
              menuName = menu.toLowerCase(),
              menuConfigPath = path.join(configsBasePath, menuName, menuName + 'MenuConfig');
        template.push(rootRequire(menuConfigPath).getMenuTemplate());
    });
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu);
    console.log("Menu rendering completed");
}

module.exports = {
    'render' : render
}