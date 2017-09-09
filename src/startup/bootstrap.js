var loadDependencies = function() {
    console.log("Started: Bootstrapping");
    var rootRequire = require('rfr'),
        path = require('path');
    rootRequire['root'] = path.join(process.cwd(), "src");
    window.configManager = rootRequire('modules/utils/configManager');
    window.rootRequire = rootRequire;
    window._ = require('underscore');
    
    //Load main modules into a global to avoid reloads
    console.log("Started: Loading global modules");
    window['$EG'] = {};
    require('./constants'),
    require('./eventEmitter'),
    require('./modules'),
    rootRequire('modules/project/projectManager'),
    rootRequire('modules/projectExplorer/pxRenderer'),
    rootRequire('modules/editor/editorController'),
    rootRequire('modules/utils/tabUtils'),
    rootRequire('modules/statusbar/statusBarController'),
    rootRequire('modules/finder/finderController');
    console.log("Completed: Loading global modules");
    //Load the app menu
    const menuRenderer = rootRequire('modules/menu/menuRenderer');
    menuRenderer.render();

    //Maximizing window
    var win = window.require('nw.gui').Window.get();
    win.on('loaded', function() {
        win.maximize();
    })
    console.log("Completed: Bootstrapping");
}

var attachEventHandlers = function() {
    // function
    $('#tabs-area').on('click', '.tab', function(evt) {
        evt.preventDefault();
        if(!this.classList.contains('active')) {
            $EG.Editor.deactivateCurrentEditor($(this).attr('tabindex'));
        }
    });
    var projectRoot = configManager.getConfigValue('projectRoot');
    if(projectRoot != '') {
        $('#file-tree').jstree({
            'core' : {
            'data' : function (obj, callback) {
                callback.call(this, $EG.PxTree.getTreeObj(obj.id === '#' ?
                projectRoot : obj.li_attr.file_path));
            }
        }
        }).on('changed.jstree', $EG.PxTree.handleClick);
    }
}

/**
 * Load all the dependencies and attach event handlers
 * Note: Called only once per window load
 */
function init() {
    loadDependencies();
    attachEventHandlers();
}
module.exports = {
    init: init
}