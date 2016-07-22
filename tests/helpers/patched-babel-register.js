require('ignore-styles');
require('babel-polyfill');

require('babel-register')({
    ignore: function(filename) {
        if (filename.match(/node_modules/)) {
            if (filename.match(/retail-ui/)) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    },
});
