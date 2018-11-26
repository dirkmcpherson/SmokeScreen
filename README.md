# Smokescreen

## Motivation
An agent that obfuscates your browsing habits by independently exploring the internet. Any party who can observe the activity from your IP address will have a reduced understanding of your true browsing habits. Search commercial sites to reduce the effectiveness of targeted ads, or political blogs to obscure your political affiliation.

## How to Use
Open Smokescreen and the agent will begin browsing from preset root URLs. It will search within one root URL at a time. i.e. While searching reddit it will not explore any pages that do not begin with reddit.com. 

Smokescreen does not currently have a headless mode. 

## Setup and Installation
This app is based off of [electron-typescript-boilerplate](https://github.com/mgechev/electron-typescript-boilerplate.git). See the boilerplate [README](https://github.com/dirkmcpherson/smokescreen/blob/master/README.boilerplate.md) for setup instructions.

## License
GNU General Public License v3.0

# Future work
1. Choose which sites to search
2. Run headless in background (refactor with puppeteer)
3. Modify search based on actual user search history