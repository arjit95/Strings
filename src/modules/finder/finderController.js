var readdirp = require('readdirp'),
    path = require('path'),
    rootDir = configManager.getConfigValue('projectRoot'),
    stream = null;


function detectEscKey(evt) {
    if (evt.keyCode == 27) { // escape key maps to keycode `27`
        $EG.Finder.deactivateFinder();
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
        wrapper.find('#finder-results').on('click','li', function() {
            $EG.EventEmitter.emit($EG.Constants.FinderConstants.ON_FINDER_ENTRY_CLICK, $(this));
        });
        wrapper.find('#finder[type="text"]').off('textInput input', '**');
        wrapper.find('#finder[type="text"]').on('textInput input', function() {
            $EG.EventEmitter.emit($EG.Constants.FinderConstants.ON_FINDER_INPUT, $(this)); 
        });
        $(window).off('keyup', detectEscKey); // Temp hack to remove all events on element
        $(window).on('keyup', detectEscKey);
        $EG.EventEmitter.emit($EG.Constants.FinderConstants.ON_FINDER_OPEN, wrapper);
    },
    addResult: function(elem) {
        var results = $('#finder-wrapper #finder-results');
        results.append(elem);
    },
    removeResult: function(index) {
        var results = $('#finder-wrapper #finder-results').find('li');
        results.eq(index).remove();
    },
    deactivateFinder: function() {
        $(window).off('keyup', detectEscKey);
        $EG.Finder.clearFinderResults();
        $('#finder-wrapper').css('display', 'none');
        $EG.EventEmitter.emit($EG.Constants.FinderConstants.ON_FINDER_CLOSE);
    },
    clearFinderResults: function() {
        $('#finder-wrapper #finder-results').empty();
        $('#finder-wrapper #finder').val('');
    }
};