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

    searchForGame(query) {
        base_query = `#gsc.tab=0&gsc.q=${query}&gsc.sort=`
        const $ = cheerio.load(`${this.#url}${base_query}`)
        const results = $('.gsc-results.gsc-webResult').find('.gsc-webResult.gsc-result').map((res) => {
            const el = res.find('a.gs-title')[0];
            return {
                'name': el.text(),
                'url': el.attr('href')
            }
        })
    }
}