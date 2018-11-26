(function () {'use strict';

var electron = require('electron');

// Simple wrapper exposing environment variables to rest of the code.
var jetpack$1 = require('fs-jetpack');
// The variables have been written to `env.json` by the build process.
var env = jetpack$1.cwd(__dirname).read('env.json', 'json');

// Here is the starting point for your application code.
// All stuff below is just to show you how it works. You can delete all of it.
var jetpack = require('fs-jetpack'); // module loaded from npm
console.log('Loaded environment variables:', env);
var app = electron.remote.app;
var appDir = jetpack.cwd(app.getAppPath());
// Holy crap! This is browser window with HTML and stuff, but I can read
// here files like it is node.js! Welcome to Electron world :)
console.log('The author of this app is:', appDir.read('package.json', 'json').author);

}());
//# sourceMappingURL=app.js.map