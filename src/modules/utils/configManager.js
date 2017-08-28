const path = require('path'),
      fs = require('fs');
var configPath = path.join(process.cwd(), 'default.json');
//Small file we can afford to read it in sync.
var config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
module.exports = {
    setConfigValue: function(key, val) {
        config[key] = val;
        fs.writeFileSync(configPath, JSON.stringify(config));
    },
    getConfigValue: function(key) {
        return config[key];
    }
}