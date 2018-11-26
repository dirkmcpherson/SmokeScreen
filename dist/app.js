// Here is the starting point for your application code.
// All stuff below is just to show you how it works. You can delete all of it.
import { remote } from 'electron'; // native electron module
var jetpack = require('fs-jetpack'); // module loaded from npm
import env from './env';
console.log('Loaded environment variables:', env);
var app = remote.app;
var appDir = jetpack.cwd(app.getAppPath());
// Holy crap! This is browser window with HTML and stuff, but I can read
// here files like it is node.js! Welcome to Electron world :)
console.log('The author of this app is:', appDir.read('package.json', 'json').author);
