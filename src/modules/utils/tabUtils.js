const {app, BrowserWindow} = require('electron');
      extMappings = rootRequire('modules/mappings/extMap');
      path = require('path');
//Rectify indexes from point of delete      
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
$EG.EditorTabs = {
    getActiveTab: function() {
        var activeTab = $("#tabs-area .tab.active");
        return activeTab.length == 0 ? undefined : activeTab;
    },
    isTabModified: function() {

    },
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
    closeCurrentTab: function() {
        const activeTab = $('#tabs-area .tab.active');
        if(activeTab.length == 0) {
            return;
        }
        //Get total number of tabs opened
        const tabindex = activeTab.attr('tabindex'),
              currentEditor =  $('#editors-area .editor[editor-index="' + tabindex + '"]'),
              currentTab = $('#tabs-area .tab[tabindex="' + tabindex + '"]');
        //Close and switch to previous editor
        $EG.Editor.deactivateCurrentEditor(tabindex-1);
        $(currentEditor).remove();
        $(currentTab).remove();
        rectifyTabs(tabindex);
    },
    isAlreadyOpened: function(filePath) {
        const tabs = $('#tabs-area').find('.tab');
        return _.map(tabs, function (tab) {
                        return tab.getAttribute('data-file');
                    }).indexOf(filePath);
    },
    closeAllTabs: function() {
        $EG.Editor.deactivateCurrentEditor(-1);
        var tabs = $('#tabs-area').find('.tab'),
            editors = $('#editors-area').find('.editor');
        _.each(tabs, function(tab, index) {
            $(tab).remove();
            $(editors[index]).remove();
        })
    },
    createNewTab: function(fileName, filePath) {
        const tabArea = $('#tabs-area'),
            editorArea = $('#editors-area');
            ext = path.extname(fileName),
            lang = ext == '' ? extMappings.getLanguageFromFileType('txt') 
                             : extMappings.getLanguageFromFileType(ext.substring(1)),
            tabs = tabArea.find('.tab'),
            editor = `<textarea class="editor active javascript" data-language="`+(lang ? lang.name : ext)+`" 
            data-path="`+filePath+`" editor-index="` +tabs.length+ `"></textarea>`,
            tab = `<li class="tab active" tabindex="` +tabs.length+ `" data-file="`+filePath+`">` + fileName + `
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