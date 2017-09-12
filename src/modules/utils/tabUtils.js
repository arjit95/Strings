const extMappings = rootRequire('modules/mappings/extMap'),
      path = require('path');
//Rectify indexes from point of delete

/**
 * Rectify tab index when a tab is closed
 * @param {Number} delPosition The tabindex for the closed tab
 * @returns {undefined}
 */
function rectifyTabs(delPosition) {
    const editors = $('#editors-area .editor'),
          tabs = $('#tabs-area .tab');
    _.each(tabs, function(tab, tabindex) {
        var index = tab.getAttribute('tabindex');
        if(index > delPosition) {
            var prev = index-1;
            tab.setAttribute('tabindex', prev);
            editors[tabindex].setAttribute('editor-index', prev);
            //Temp hack
            $(tab).find('button').attr('onclick', '$EG.EditorTabs.closeTab(' +prev+ ')');
        }
    });
    //Reset title if no tabs are opened
    if(tabs.length === 0) {
        $('head title').text('Strings');
    }
}
/**
 * Methods to handle multiple tabs in editor
 */
$EG.EditorTabs = {
    /**
     * Gets the active tab element
     * @returns {Array} jQuery style selector element
     */
    getActiveTab: function() {
        var activeTab = $("#tabs-area .tab.active");
        return activeTab.length == 0 ? undefined : activeTab;
    },
    /**
     * Closes the tab at given index
     * @param {Number} index - The index of the tab to be closed
     * @returns {undefined}
     */
    closeTab: function(index) {
        const tab = $('#tabs-area .tab[tabindex="' + index + '"]');
        if(tab.length === 0) {
            return;
        }
        var isActive = tab[0].classList.contains('active');
        if(isActive) {
            $EG.EditorTabs.closeCurrentTab();
        }
        else {
            var editor = $('#editors-area .editor[editor-index="' + index + '"]');
            editor.remove();
            tab.remove();
            rectifyTabs(index);
        }  
    },
    /**
     * Closes the current tab
     * @returns {undefined}
     */
    closeCurrentTab: function() {
        const activeTab = $('#tabs-area .tab.active');
        if(activeTab.length == 0) {
            return;
        }
        //Get total number of tabs opened
        const tabindex = activeTab.attr('tabindex'),
              currentEditor =  $('#editors-area .editor[editor-index="' + tabindex + '"]'),
              currentTab = $('#tabs-area .tab[tabindex="' + tabindex + '"]');
        //Close and switch to previous or next editor
        var switchTo = -1;
        if($('#tabs-area .tab').length > 1) {
            var index = parseInt(tabindex);
            switchTo = index === 0 ? index+1 : index-1;
        }
        $EG.Editor.deactivateCurrentEditor(switchTo);
        $(currentEditor).remove();
        $(currentTab).remove();
        rectifyTabs(tabindex);
    },
    /**
     * Checks if the file is already opened in editor
     * @returns {Number} >= 0 if the file is already opened
     */
    getOpenedFileIndex: function(filePath) {
        const tabs = $('#tabs-area').find('.tab');
        return _.map(tabs, function (tab) {
                        return tab.getAttribute('data-file');
                    }).indexOf(filePath);
    },
    /**
     * Closes all the open tab
     * @returns {undefined}
     */
    closeAllTabs: function() {
        $EG.Editor.deactivateCurrentEditor(-1);
        var tabs = $('#tabs-area').find('.tab'),
            editors = $('#editors-area').find('.editor');
        _.each(tabs, function(tab, index) {
            $(tab).remove();
            $(editors[index]).remove();
        })
    },
    markTabDirty: function(tabElem) {
        var activeTab = tabElem || $EG.EditorTabs.getActiveTab();
        activeTab = activeTab.find('span')[0];
        var tabContent = activeTab.innerHTML;
        activeTab.innerHTML = tabContent + "*";
    },
    isTabMarkedDirty: function(tabElem) {
        var activeTab = tabElem || $EG.EditorTabs.getActiveTab();
        activeTab = activeTab.find('span')[0];
        var tabContent = activeTab.innerHTML;
        return tabContent.endsWith("*");
    },
    removeDirtyMarked: function(all) {
        var tabs = all ? $('#tabs-area').find('.tab') : [$EG.EditorTabs.getActiveTab()];
        _.each(tabs, function(tab) {
            if($EG.EditorTabs.isTabMarkedDirty(tab)) {
                var tabContent = tab.find('span')[0].innerHTML;
                tab.find('span')[0].innerHTML = tabContent.substring(0, tabContent.length - 1);
            }
        });
    },
    /**
     * Creates a new tab in editor
     * @param {String} fileName - The name of the file by which the tab needs to be created
     * @param {String} filePath - The path to the file which is to be opened
     * @returns {undefined}
     */
    createNewTab: function(fileName, filePath) {
        const tabArea = $('#tabs-area'),
            editorArea = $('#editors-area');
            ext = path.extname(fileName),
            lang = ext == '' ? extMappings.getLanguageFromFileType('txt') 
                             : extMappings.getLanguageFromFileType(ext.substring(1)),
            tabs = tabArea.find('.tab'),
            editor = `<textarea class="editor active javascript" data-language="`+(lang ? lang.name : ext)+`" 
            data-path="`+filePath+`" editor-index="` +tabs.length+ `"></textarea>`,
            tab = `<li class="tab active" tabindex="` +tabs.length+ `" data-file="`+filePath+`"><span>` + fileName + `</span>
            <button type="button" class="close" aria-label="Close" 
            onclick="$EG.EditorTabs.closeTab(`+tabs.length+`)">
            <span aria-hidden="true">&times;</span></button></li>`;
        //Remove the current active editor and tab
        $EG.Editor.deactivateCurrentEditor();
        if(tabs.length > 0) {
            tabArea.find('.wrapper .tab:last-child').after(tab);
        }
        else {
            tabArea.find('.wrapper').html(tab);
        }
        editorArea.append(editor);
        $EG.Editor.switchToEditorAtIndex(tabs.length, tabs.length > 0);
    }
}