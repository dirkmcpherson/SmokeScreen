import { runInThisContext } from "vm";

var rp = require('request-promise');
var cheerio = require('cheerio');
var fs = require('fs');

// var log = function (msg: string, path: string) {
//     console.log(msg)
//     path = path + '/smoke_screen_log.txt'
// }
const ROOT_PREFIX: string = 'https://www.'

class Browser {
    path: string; // Current root url
    rootURLs: string[] = ['infowars.com', 'slate.com', 'reddit.com']
    rootURLIdx: number = 0;
    nextURL: string;
    options = {
        uri: this.nextURL,
        transform: function(body) {
            return cheerio.load(body)
        }
    }

    constructor() {
        this.path = ROOT_PREFIX + this.rootURLs[this.rootURLIdx]
        this.nextURL = this.path;
    }

    public selectNextURL = (toVisit?: string): Promise<string> => {
        return new Promise<string>((resolve) => {
            if (toVisit)
            {
                this.nextURL = toVisit;
            }
            else
            {
                toVisit = this.nextURL;
            }

            console.log('visiting ' + this.nextURL);
            this.options.uri = this.nextURL;
            rp(this.options)
                .then(($) => {
                    let urlToVisit: string = this.path; // default to base URL
                    var links = $('a');
                    if (links.length == 0) 
                    {
                        // no links, just visit the same root url
                        console.log("No links found on page.")
                    }
                    else
                    {
                        var randomIdx = Math.floor(Math.random() * $(links).length);
                        
                        // We only want to navigate to URLs within the original root domain
                        let href: string = $(links)[randomIdx].attribs.href;
                        console.log('Randomly selected ' + href);
                        if (href.includes(this.rootURLs[this.rootURLIdx]))
                        {
                            urlToVisit = href;
                        }
                        else if (!href.includes('http')) 
                        {
                            urlToVisit = this.path + href;
                        }
                    }
                    
                    this.nextURL = urlToVisit;
                     
                    console.log('returning with val ' + this.nextURL)
                    resolve(this.nextURL);
                })
                .catch((err) => {
                    console.log('Error accessing page, reverting to root path.');
                    this.nextURL = this.path
                    resolve(this.path);
                })  
        })
    }

    // public wander = () => {
    //     this.selectNextURL();
    // }
}

export { Browser }