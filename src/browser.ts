import { runInThisContext } from "vm";

var rp = require('request-promise');
var cheerio = require('cheerio');
var fs = require('fs');

// var log = function (msg: string, path: string) {
//     console.log(msg)
//     path = path + '/smoke_screen_log.txt'
// }
const ROOT_PREFIX: string = 'https://www.'
const ROOT_CHANGE_INTERVAL = 10 // How often we change which root url we're using

class Browser {
    path: string; // Current root url
    rootURLs: string[] = ['infowars.com', 'slate.com', 'reddit.com']
    rootURLIdx: number = 0;
    urlIncrementCount: number = 0;
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
                this.urlIncrementCount += 1
                if ((this.urlIncrementCount % ROOT_CHANGE_INTERVAL) == 0)
                {
                    this.rootURLIdx = (this.rootURLIdx + 1) % this.rootURLs.length
                    this.path = ROOT_PREFIX + this.rootURLs[this.rootURLIdx]
                    console.log("Incrementing root url to " + this.path)
                    this.nextURL = this.path
                }
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
                        // Try to find a non-email, non-download link 5 times
                        for (let index = 0; index < 5; index++) {
                            var randomIdx = Math.floor(Math.random() * $(links).length);
                            // We only want to navigate to URLs within the original root domain
                            let href: string = $(links)[randomIdx].attribs.href;

                            var re = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
                            var isEmail: boolean = re.test(href);

                            // todo: determine if link is download
                            // from https://stackoverflow.com/questions/37383600/detect-if-link-is-a-download-in-javascript-jquery
                            // $.get(href, function (response, status, xhr) {
                            //     if (xhr.getResponseHeader("content-type").indexOf("text") > -1)
                            //     {
                            //         // Text based stuff.
                            //     }
                            //     else
                            //     {
                            //       // Download based stuff. (eg., application/pdf, etc.)

                            //     }
                            // });

                            if (isEmail)
                            {
                                // do nothing, try again or break out and stay on the same page
                            }
                            else if (href.includes(this.rootURLs[this.rootURLIdx]))
                            {
                                urlToVisit = href;
                                break;
                            }
                            else if (!href.includes('http')) 
                            {
                                urlToVisit = this.path + href;
                                break;
                            }
                        }
                    }
                    
                    this.nextURL = urlToVisit;
                     
                    // console.log('returning with val ' + this.nextURL)
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