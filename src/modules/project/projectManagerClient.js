var fs = require('fs');
function writeFile(filePath, data) {
    fs.writeFile(filePath, data, function(err) {
        if(err) {
            console.log(err);
        }
        console.log('Save successful');
    });
}
$EG.Project = {
    saveFile: function() {
        var activeTab = $("#tabs-area .tab.active");
        if(activeTab.length == 0) {
            return;
        }
        var filePath = $(activeTab).attr('data-file');
        var data = $EG.Editor.ActiveEditor.getValue();        
        writeFile(filePath, data);
    },
    saveAllFiles: function() {
        var tabs = $('#tabs-area .tab'),
            editors = $('#editors-area .editor');
        if(tabs.length == 0) {
            return;
        }
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
            writeFile(path, data);
        })
    }
}