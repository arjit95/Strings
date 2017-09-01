const path = require("path");

/**
 * Render the app menu
 * @returns {undefined}
 */
function render() {
    console.log("Started: Menu rendering");
    const menus = ['File', 'Edit', 'View'];
    var template = [];
    var menuBar = new nw.Menu({type: 'menubar'});
     _.each(menus, function(menu) {
        const configsBasePath = path.join('modules', 'menu'),
              menuName = menu.toLowerCase(),
              menuConfigPath = path.join(configsBasePath, menuName, menuName + 'MenuConfig'),
              menuTemplate = rootRequire(menuConfigPath).getMenuTemplate();
        var submenu = new nw.Menu();
        _.each(menuTemplate.submenu, function(menuItem) {
            submenu.append(new nw.MenuItem(menuItem));
        });
        menuBar.append(new nw.MenuItem({label: menu, submenu: submenu}));
     });
    nw.Window.get().menu = menuBar;
    console.log("Completed: Menu rendering");
}

module.exports = {
    'render' : render
}