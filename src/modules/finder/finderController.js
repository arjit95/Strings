var readdirp = require('readdirp'),
    path = require('path'),
    rootDir = configManager.getConfigValue('projectRoot'),
    stream = null;

function clearPopulatedResults() {
    $('#finder-wrapper #finder-results').empty();
    $('#finder-wrapper #finder').val('');
    $('#finder-wrapper').css('display', 'none');
}
function populateResults(val) {
    if(val === '**') {
        return;
    }
    if(stream) {
        stream.destroy();
        $('#finder-wrapper #finder-results').empty();
        stream = null;
    }
    var results = $('#finder-wrapper #finder-results'),
        maxResults = 10, 
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
      results.append(fileElem);
      // process entry here
      console.log(entry.path);
      currentResults++;
      if(currentResults > maxResults) {
          stream.destroy();
      }
    });
}
function detectEscKey(evt) {
    if (evt.keyCode == 27) { // escape key maps to keycode `27`
        $(window).off('keyup', detectEscKey);
        clearPopulatedResults(); 
    }
}
$EG.Finder = {
    /**
     * Opens the quick finder `Ctrl+P`
     * @returns {undefined}
     */
    startFinder: function() {
        var wrapper = $("#finder-wrapper");
        wrapper.css('display', 'block')
        wrapper.find('#finder').focus();
        wrapper.find('#finder-results').on('click','li a', function() {
            var filePath = $(this).parent().attr('path');
            $EG.EditorTabs.createNewTab(path.basename(filePath), filePath);
            $(window).off('keyup', detectEscKey);
            clearPopulatedResults(); 
        });
        wrapper.find('#finder[type="text"]').off('textInput input', '**');
        wrapper.find('#finder[type="text"]').on('textInput input', function() {
            var glob = "*"+$(this).val()+"*";
            populateResults(glob);
        });
        $(window).off('keyup', detectEscKey);
        $(window).on('keyup', detectEscKey); 
    }
};