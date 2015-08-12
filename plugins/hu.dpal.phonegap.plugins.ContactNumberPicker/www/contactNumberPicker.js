cordova.define("hu.dpal.phonegap.plugins.ContactNumberPicker.ContactNumberPicker", function(require, exports, module) { var exec = require('cordova/exec');

module.exports = {

	pick : function(success, fail) {
        cordova.exec(success, fail, 'ContactNumberPicker', 'pick', []);
    }
    
};
});
