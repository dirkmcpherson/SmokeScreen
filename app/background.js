(function () {'use strict';

var path = require('path');
var url = require('url');
var electron = require('electron');

var devMenuTemplate = {
    label: 'Development',
    submenu: [{
            label: 'Reload',
            accelerator: 'CmdOrCtrl+R',
            click: function () {
                electron.BrowserWindow.getFocusedWindow().webContents.reloadIgnoringCache();
            }
        }, {
            label: 'Toggle DevTools',
            accelerator: 'Alt+CmdOrCtrl+I',
            click: function () {
                electron.BrowserWindow.getFocusedWindow().toggleDevTools();
            }
        }, {
            label: 'Quit',
            accelerator: 'CmdOrCtrl+Q',
            click: function () {
                electron.app.quit();
            }
        }]
};

var editMenuTemplate = {
    label: 'Edit',
    submenu: [
        { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
        { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
        { type: "separator" },
        { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
    ]
};

var rp = require('request-promise');
var cheerio = require('cheerio');
var fs = require('fs');

var ROOT_PREFIX = 'https://www.';

var Browser = /** @class */ (function () {
    function Browser() {
        var _this = this;
        this.rootURLs = ['infowars.com', 'slate.com', 'reddit.com'];
        this.rootURLIdx = 0;
        this.options = {
            uri: this.nextURL,
            transform: function (body) {
                return cheerio.load(body);
            }
        };
        this.selectNextURL = function (toVisit) {
            return new Promise(function (resolve) {
                if (toVisit) {
                    _this.nextURL = toVisit;
                }
                else {
                    toVisit = _this.nextURL;
                }
                console.log('visiting ' + _this.nextURL);
                _this.options.uri = _this.nextURL;
                rp(_this.options)
                    .then(function ($) {
                    var urlToVisit = _this.path; // default to base URL
                    var links = $('a');
                    if (links.length == 0) {
                        // no links, just visit the same root url
                        console.log("No links found on page.");
                    }
                    else {
                        var randomIdx = Math.floor(Math.random() * $(links).length);
                        // We only want to navigate to URLs within the original root domain
                        var href = $(links)[randomIdx].attribs.href;
                        console.log('Randomly selected ' + href);
                        if (href.includes(_this.rootURLs[_this.rootURLIdx])) {
                            urlToVisit = href;
                        }
                        else if (!href.includes('http')) {
                            urlToVisit = _this.path + href;
                        }
                    }
                    _this.nextURL = urlToVisit;
                    console.log('returning with val ' + _this.nextURL);
                    resolve(_this.nextURL);
                })
                    .catch(function (err) {
                    console.log('Error accessing page, reverting to root path.');
                    _this.nextURL = _this.path;
                    resolve(_this.path);
                });
            });
        };
        this.path = ROOT_PREFIX + this.rootURLs[this.rootURLIdx];
        this.nextURL = this.path;
    }
    return Browser;
}());

// Simple wrapper exposing environment variables to rest of the code.
var jetpack = require('fs-jetpack');
// The variables have been written to `env.json` by the build process.
var env = jetpack.cwd(__dirname).read('env.json', 'json');

// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.
// Special module holding environment variables which you declared
// in config/env_xxx.json file.
var browserWindow;
var transparentWindowOverlay;
var setApplicationMenu = function () {
    var menus = [editMenuTemplate];
    if (env.name !== 'production') {
        menus.push(devMenuTemplate);
    }
    electron.Menu.setApplicationMenu(electron.Menu.buildFromTemplate(menus));
};
// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env.name !== 'production') {
    var userDataPath = electron.app.getPath('userData');
    electron.app.setPath('userData', userDataPath + ' (' + env.name + ')');
}
var browser = new Browser();
var browserUpdateIntervalID = null;
var updatePage = function () {
    var currentURL = browser.nextURL;
    browser.selectNextURL()
        .then(function (nextURL) {
        console.log("Window loading " + nextURL);
        browserWindow.loadURL(nextURL);
    });
};
electron.app.on('ready', function () {
    setApplicationMenu();
    // var mainWindow = createWindow('main', {
    //     width: 1000,
    //     height: 600
    // });
    // mainWindow.loadURL(url.format({
    //     pathname: path.join(__dirname, 'app.html'),
    //     protocol: 'file:',
    //     slashes: true
    // }));
    // todo: Update to promise queue
    browserUpdateIntervalID = setInterval(updatePage, 5000);
    browserWindow = new electron.BrowserWindow({ width: 400,
        height: 400 });
    transparentWindowOverlay = new electron.BrowserWindow({ parent: browserWindow,
        transparent: true,
        frame: false,
        width: 400,
        height: 400 });
    transparentWindowOverlay.setIgnoreMouseEvents(true);
    transparentWindowOverlay.loadURL(url.format({
        pathname: path.join(__dirname, 'app.html'),
        protocol: 'file:',
        slashes: true
    }));
    browserWindow.loadURL(browser.nextURL);
    // if (env.name === 'development') {
    //     mainWindow.openDevTools();
    // }
});
electron.app.on('window-all-closed', function () {
    electron.app.quit();
});

}());
//# sourceMappingURL=background.js.map