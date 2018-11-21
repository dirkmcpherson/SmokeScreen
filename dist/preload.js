import { ipcRenderer } from 'electron';
console.log('Hey, this is being run in the context of the webview renderer process');
document.addEventListener('DOMContentLoaded', function (event) {
    for (var _i = 0, _a = document.querySelectorAll('*'); _i < _a.length; _i++) {
        var el = _a[_i];
        console.log(el.tagName);
        // send the info to the parent renderer
        // the id of it is conveniently always 1 in this example, but really you'd want
        // a more robust method of getting it
        ipcRenderer.sendTo(1, 'elFound', { tagName: el.tagName });
    }
});
