var fs = require('fs'),
    path = require('path'),
    configManager = rootRequire('modules/utils/configManager'),
    templatesPath = path.join(process.cwd(), "public", "static");

function writeFile(filePath, data, cb) {
    var multiple = typeof filePath === 'object';
    var totalFiles = multiple ? filePath.length : 1;
    _.each(totalFiles, function(file, index) {
        fs.writeFile(filePath, data, function(err) {
            --totalFiles;
            if(totalFiles === 0) {
                cb && cb(err);
            }
            if(err) {
                console.log(err);
                return;
            }
        });
    })
}
var __showFileChooser__ = function(elem, cb) {
    elem.addEventListener('change', function(evt) {
        if(this.value && this.value.length > 0) {
            cb(this.value);
            this.removeEventListener('change', '**');
        }
    });
    elem.click();
};
$EG.Project = {
    saveFile: function() {
        var activeTab = $("#tabs-area .tab.active");
        if(activeTab.length == 0) {
            return;
        }
        var filePath = $(activeTab).attr('data-file');
        var data = $EG.Editor.ActiveEditor.getValue();        
        writeFile(filePath, data, function(err) {
            $EG.EventEmitter.emit($EG.Constants.Editor.DOC_SAVED);
        });
    },
    saveAllFiles: function() {
        var tabs = $('#tabs-area .tab'),
            editors = $('#editors-area .editor');
        if(tabs.length == 0) {
            return;
        }
        var files = [];
        var datas = [];
        _.each(tabs, function(tab) {
            var isActive = tab.classList.contains('active'),
                index = tab.getAttribute('tabindex'),
                path = tab.getAttribute('data-file');
            var data;
            if(isActive) {
                data = $EG.Editor.ActiveEditor.getValue(); 
            }
            else {
                data = editors[index].value;
            }
            files.push(path);
            datas.push(data);
        });
        writeFile(files, datas, function(err) {
            $EG.EventEmitter.emit($EG.Constants.Editor.ALL_DOCS_SAVED);
        });
    },
    openFile: function() {
        var inputElem = document.querySelector('#filechooser');
        inputElem.removeAttribute('nwdirectory');
        __showFileChooser__(inputElem, function(filePath) {
            $EG.EditorTabs.createNewTab(path.basename(filePath), filePath);
        });
    },
    openFolder: function() {
        var inputElem = document.querySelector('#filechooser');
        inputElem.setAttribute('nwdirectory','');
        __showFileChooser__(inputElem, function(folderPath) {
            configManager.setConfigValue('projectRoot', folderPath);
            chrome.runtime.reload();
        });
    }
}