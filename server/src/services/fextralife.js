import * as cheerio from 'cheerio';

const url = "https://fextralife.com"
const wiki_list = {
    "text": "Wikis",
    "class": "menu-item", //-282906
    "submenu_class": "sub-menu sub-menu-282906",
    "path": "li>ul>[li>ul>[li>a]]"
}

const print = console.log;

export class FextraLifeService {

    #gameName;
    #url;

    /**
     * 
     * @param {string | undefined} gameName 
     */
    constructor(gameName) {
        this.#gameName = gameName;
    }

    async getGamesList() {
        // Cloudflare detection kicks in...
        const url = "https://fextralife.com";
        const html_data = await (await fetch(url)).text();
        const $ = cheerio.load(html_data);
        let menuItems = [];
        print($('li').length)
        $(`li.${wiki_list["class"]}`).each((parentEl) => {
            print(parentEl.text());
            if(parentEl.find('>a').text() == "Wikis") {
                print("Getting List of Wikis")
                parentEl.find('ul')
                .each((el) => {
                    const items = el.find('li ul').map((subel) => {
                        const foundElement = subel.find('li a');
                        return {
                            'name': foundElement.text(),
                            'url': foundElement.attr('href')
                        };
                    }).each((ac, v) => {
                        menuItems.push(v);
                    })
                });
            }
            
        })
        return menuItems;
    }

    async getGameUrl() {
        if(!this.#url) {
            const gamesList = await this.getGamesList();
            this.#url = gamesList.filter((v) => v.name == gameName)[0]?.url;
        }
        return this.#url;
    }

    async searchForGame(query) {
        const base_query = `#gsc.tab=0&gsc.q=${query}&gsc.sort=`;
        const base_url = await this.getGameUrl();
        const url = `${base_url}${base_query}`;
        const html_data = await (await fetch(url)).text();
        const $ = cheerio.load(html_data);
        const results = [];
        $('.gsc-results.gsc-webResult').find('.gsc-webResult.gsc-result').each((res) => {
            const el = res.find('a.gs-title')[0];
            print(el.text());
            results.push({
                'name': el.text(),
                'url': el.attr('href')
            });
        });
        return results;
    }
}