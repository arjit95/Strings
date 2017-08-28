function reAdjustHeight() {
  var workingAreaHeight = 0.97,
      statusAreaHeight = 0.03;
  $("#working-area").height($(window).height() * workingAreaHeight);
  $("#status-area").height($(window).height() * statusAreaHeight);
}

$(window).resize(function() {
  reAdjustHeight();
});

$(document).ready(function() {
  var rootRequire = require('rfr'),
      path = require('path');
  rootRequire['root'] = path.join(process.cwd(), "src");
  configManager = rootRequire('modules/utils/configManager');
  window.rootRequire = rootRequire;
  window._ = require('underscore');

  //Load main modules into a global to avoid reloads
  window['$EG'] = {};
  rootRequire('modules/project/projectManagerClient'),
  rootRequire('modules/projectExplorer/pxRenderer'),
  rootRequire('modules/editor/editorController'),
  rootRequire('modules/utils/tabUtils'),
  rootRequire('modules/statusbar/statusBarController'),
  rootRequire('modules/finder/finderController'),
  rootRequire('modules/shortcuts/shortcuts').registerClientShortcuts();

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
});