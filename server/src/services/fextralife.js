import * as cheerio from 'cheerio';

const url = "https://fextralife.com"
const wiki_list = {
    "text": "Wikis",
    "class": "menu-item-282906",
    "submenu_class": "sub-menu sub-menu-282906",
    "path": "li>ul>[li>ul>[li>a]]"
}

export class FextraLifeService {

    #gameName;
    #url;

    /**
     * 
     * @param {string | undefined} gameName 
     */
    constructor(gameName) {
        this.#gameName = gameName;
        if(gameName) {
            console.log(this.getGameUrl());
        }
    }

    getGamesList() {
        const $ = cheerio.load("https://fextralife.com");
        const menuItems = $(`li.${wiki_list["class"]}`).find('ul')
            .map((el) => {
                return el.find('li ul').map((subel) => {
                    const foundElement = subel.find('li a');
                    return {
                        'name': foundElement.text(),
                        'url': foundElement.attr('href')
                    };
                }).reduce((ac, v) => [...ac, ...v], [])
            }).reduce((ac, v) => [...ac, ...v], [])
        return menuItems;
    }

    getGameUrl() {
        if(!this.#url) {
            this.#url = this.getGamesList().filter((v) => v.name == gameName)[0]?.url;
        }
        return this.#url;
    }
}