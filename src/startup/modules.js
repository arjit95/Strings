const eventEmitter = $EG.EventEmitter.getInstance(),
      fs = require('fs'),
      path = require('path');
//Delete init method to prevent it from being consumed by others
delete $EG.EventEmitter.getInstance;
var addons = {},
    evtToUidMap = {},
    loadedAddons = {};

var addonsDir = path.join(process.cwd(), 'addon');

//Converts events constant notation to values
function processEvents(evt) {
   return _.findWhere($EG.Constants, evt)[evt.split('.')[evt.split('.').length-1]];
}
fs.readdir(addonsDir, function(err, folders) {
    folders.forEach(function(folder) {
        var addonFolder = path.join(addonsDir, folder);
        if(fs.statSync(addonFolder).isDirectory()) {
            var configPath = path.join(addonFolder, 'sEdit.json');
            var sEdit = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            addons[sEdit.uid] = {};
            addons[sEdit.uid]['activationEvents'] = _.map(sEdit.activationEvents, processEvents);
            addons[sEdit.uid]['deactivationEvents'] = _.map(sEdit.deactivationEvents, processEvents);
            addons[sEdit.uid]['entry'] = path.join(addonFolder, sEdit.entry);
            var allEvents = addons[sEdit.uid]['activationEvents'].concat(addons[sEdit.uid]['deactivationEvents']);
            _.each(allEvents, function(evt) {
                if(!evtToUidMap[evt]) {
                    evtToUidMap[evt] = [];
                }
                evtToUidMap[evt].push(sEdit.uid);
            });
        }
    });
    eventEmitter.on($EG.Constants.Modules.MODULE_ADD, function(evt) {
        var addonUIDs = evtToUidMap[evt];
        _.each(addonUIDs, function(addonUID) {
            var addon = addons[addonUID];
            if(addon['activationEvents'].indexOf(evt) >= 0) {
                var loaded = require(addon['entry']);
                loadedAddons[addonUID] = loaded;
            } else if(addon['deactivationEvents'].indexOf(evt) >= 0) {
                $EG.EventEmitter.removeListener(addonUID);
                delete loadedAddons[addonUID];
                delete require.cache[addon['entry']];
            }
        });
    });
});