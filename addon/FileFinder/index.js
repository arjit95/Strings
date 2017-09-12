const readdirp = require('readdirp'),
      path = require('path'),
      rootDir = configManager.getConfigValue('projectRoot'),
      finderConst = $EG.Constants.FinderConstants,
      sEdit = require('./sEdit');
var stream = null;
function populateResults(val) {
    if(val === '**') {
        return;
    }
    if(stream) {
        stream.destroy();
        $EG.Finder.clearFinderResults();
        stream = null;
    }
    var maxResults = 10, 
        currentResults = 0;
    stream = readdirp({ root: path.join(rootDir), fileFilter: val, entryTypes: 'files' });
    stream.on('warn', function (err) { 
      console.error('something went wrong when processing an entry', err); 
    })
    .on('error', function (err) { 
      console.error('something went fatally wrong and the stream was aborted', err); 
    })
    .on('data', function (entry) { 
      var fileElem = '<li path="' +entry.fullPath+ '"><a href="#">' +entry.name+ '</a></li>';
      $EG.Finder.addResult(fileElem);
      // process entry here
      console.log(entry.path);
      currentResults++;
      if(currentResults > maxResults) {
          stream.destroy();
      }
    });
}

$EG.EventEmitter.addListener(finderConst.ON_FINDER_INPUT, function(finderElem) {
    var glob   = "*"+finderElem.val()+"*"; 
    populateResults(glob);
}, sEdit.uid);

$EG.EventEmitter.addListener(finderConst.ON_FINDER_ENTRY_CLICK, function(entry) {
    var filePath = entry.attr('path');
    $EG.EditorTabs.createNewTab(path.basename(filePath), filePath);
    $EG.Finder.deactivateFinder();
    window.event.preventDefault();
}, sEdit.uid);