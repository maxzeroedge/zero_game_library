import * as cheerio from 'cheerio';
import { FextraSelenium } from './fextra_selenium';

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
        const fextraSelenium = new FextraSelenium("chrome");
        let gameList = [];

        try {
            await fextraSelenium.setupDriver();
            await fextraSelenium.navigateToFextralife();
            gameList = await fextraSelenium.fetchGameTitles();
        } catch (error) {
            console.error("Error:", error);
        } finally {
            await fextraSelenium.close();
        }
        return gameList;
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
