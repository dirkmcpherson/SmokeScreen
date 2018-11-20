var rp = require('request-promise');
var cheerio = require('cheerio');
var fs = require('fs');
// var log = function (msg: string, path: string) {
//     console.log(msg)
//     path = path + '/smoke_screen_log.txt'
// }
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
export { Browser };
