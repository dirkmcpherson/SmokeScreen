// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.
import * as path from 'path';
import * as url from 'url';
import { app, Menu, BrowserWindow } from 'electron';
import { devMenuTemplate } from './menu/dev_menu_template';
import { editMenuTemplate } from './menu/edit_menu_template';
import { Browser } from './browser';
// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from './env';
var mainWindow;
var browserWindow;
var transparentWindowOverlay;
var setApplicationMenu = function () {
    var menus = [editMenuTemplate];
    if (env.name !== 'production') {
        menus.push(devMenuTemplate);
    }
    Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};
// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env.name !== 'production') {
    var userDataPath = app.getPath('userData');
    app.setPath('userData', userDataPath + ' (' + env.name + ')');
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
var update;
app.on('ready', function () {
    setApplicationMenu();
    browserUpdateIntervalID = setInterval(updatePage, 5000);
    var x_start = 0;
    var y_start = 0;
    var w = 250;
    var h = 225;
    browserWindow = new BrowserWindow({
        x: x_start,
        y: y_start,
        width: w,
        height: h,
        show: false
    });
    transparentWindowOverlay = new BrowserWindow({
        parent: browserWindow,
        x: x_start,
        y: y_start,
        transparent: true,
        frame: false,
        width: w,
        height: h,
        show: false
    });
    transparentWindowOverlay.setIgnoreMouseEvents(true);
    transparentWindowOverlay.loadURL(url.format({
        pathname: path.join(__dirname, 'app.html'),
        protocol: 'file:',
        slashes: true
    }));
    transparentWindowOverlay.setBrowser;
    browserWindow.loadURL(browser.nextURL);
    browserWindow.once('ready-to-show', function () {
        browserWindow.show();
        transparentWindowOverlay.show();
    });
    browserWindow.on('resize', function (e, x, y) {
        // update child container size
        var browserSize = browserWindow.getContentSize();
        transparentWindowOverlay.setContentSize(browserSize[0], browserSize[1], true);
    });
    // if (env.name === 'development') {
    //     mainWindow.openDevTools();
    // }
});
app.on('window-all-closed', function () {
    app.quit();
});
