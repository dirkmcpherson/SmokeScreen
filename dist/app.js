// Here is the starting point for your application code.
// All stuff below is just to show you how it works. You can delete all of it.
// Use new ES6 modules syntax for everything.
import * as os from 'os'; // native node.js module
import { remote } from 'electron'; // native electron module
var jetpack = require('fs-jetpack'); // module loaded from npm
import { greet } from './browser/browser'; // code authored by you in this project
import env from './env';
var ipc = require('electron').ipcRenderer;
console.log('Loaded environment variables:', env);
var app = remote.app;
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
    document.getElementById('greet').innerHTML = greet();
    document.getElementById('platform-info').innerHTML = os.platform();
    document.getElementById('env-name').innerHTML = env.name;
    view = document.getElementById('view');
    browserLoopInterval = setInterval(function () {
        view.executeJavaScript('console.log(document.getElementsByTagName("a"))');
        view.setAttribute('src', urls[idx]);
        idx = (idx + 1) % 3;
    }, waitMs);
});
