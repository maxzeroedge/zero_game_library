import * as cheerio from 'cheerio';
import { FextraSelenium } from './fextra_selenium.js';

const url = "https://fextralife.com"
const wiki_list = {
    "text": "Wikis",
    "class": "menu-item", //-282906
    "submenu_class": "sub-menu sub-menu-282906",
    "path": "li>ul>[li>ul>[li>a]]"
}

let gameList = [];

const print = console.debug;

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
        if (gameList.length) {
            return gameList;
        }
        const fextraSelenium = new FextraSelenium("chrome");

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
            this.#url = gamesList.filter((v) => v.name == this.#gameName + " Wiki")[0]?.url;
        }
        return this.#url;
    }

    async searchForGame(query) {
        const url = await this.getGameUrl();
        const fextraSelenium = new FextraSelenium("chrome");
        let results = [];

        try {
            await fextraSelenium.setupDriver();
            results = await fextraSelenium.searchInGame(url, query);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            await fextraSelenium.close();
        }
        return results;
        // const url = await this.getGameUrl();
        // console.debug("Query Page url", url);
        // const html_data = await (await fetch(url)).text();
        // const $ = cheerio.load(html_data);
        // const results = [];
        // $('.gsc-results.gsc-webResult').find('.gsc-webResult.gsc-result').each((res) => {
        //     const el = res.find('a.gs-title')[0];
        //     print(el.text());
        //     results.push({
        //         'name': el.text(),
        //         'url': el.attr('href')
        //     });
        // });
        // return results;
    }
}
