const path = require('path'),
      fs = require('fs');
var configPath = path.join(process.cwd(), 'default.json');
//Small file we can afford to read it in sync.
var config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

/**
 * Methods to manage the configuration option for the editor
 */
module.exports = {
    /**
     * Sets the config value in config json
     * @param {String} key - The key in the config
     * @param {Object} val - The value for the key in config
     */
    setConfigValue: function(key, val) {
        config[key] = val;
        fs.writeFileSync(configPath, JSON.stringify(config));
    },
    /**
     * Returns the config value from the config value
     * @param {String} key - The key whose value needs to be fetched
     */
    getConfigValue: function(key) {
        return config[key];
    }
}