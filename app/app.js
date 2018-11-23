(function () {'use strict';

var electron = require('electron');

// Simple wrapper exposing environment variables to rest of the code.
var jetpack$1 = require('fs-jetpack');
// The variables have been written to `env.json` by the build process.
var env = jetpack$1.cwd(__dirname).read('env.json', 'json');

// Here is the starting point for your application code.
// All stuff below is just to show you how it works. You can delete all of it.
var jetpack = require('fs-jetpack'); // module loaded from npm
var ipc = require('electron').ipcRenderer;
console.log('Loaded environment variables:', env);
var app = electron.remote.app;
var appDir = jetpack.cwd(app.getAppPath());
var browserLoopInterval = null;
var waitMs = 15000;
var view = null;
var urls = ['https://www.reddit.com', 'https://www.breitbart.com', 'https://www.slate.com'];
var idx = 0;
// Holy crap! This is browser window with HTML and stuff, but I can read
// here files like it is node.js! Welcome to Electron world :)
console.log('The author of this app is:', appDir.read('package.json', 'json').author);
document.addEventListener('DOMContentLoaded', function () {
    // document.getElementById('greet').innerHTML = greet();
    // document.getElementById('platform-info').innerHTML = os.platform();
    // document.getElementById('env-name').innerHTML = env.name;
    view = document.getElementById('view');
    browserLoopInterval = setInterval(function () {
        console.log("Browser loop interval");
        //view.openDevTools()
        view.executeJavaScript('console.log(document.getElementsByTagName("a"))');
        view.setAttribute('src', urls[idx]);
        idx = (idx + 1) % 3;
    }, waitMs);
});

}());
//# sourceMappingURL=app.js.map