import puppeteer from "puppeteer";
import path from "path";
import {writeFileSync, mkdirSync} from 'fs';

export class LoneCrawler {

    #out_dir;
    #processQueue;
    #browser;
    #page;
    #visited;
    
    constructor(out_dir=__dirname) {
        this.#processQueue = [];
        this.#visited = {};
        this.#out_dir = out_dir;
    }

    async getBrowser() {
        if (this.#browser) {
            return this.#browser;
        } 
        this.#browser = await puppeteer.launch({
            headless: true,
            ignoreHTTPSErrors: true,
        });
        return this.#browser;
    }

    async getBrowserPage() {
        if (this.#page) {
            return this.#page;
        }
        this.#page = await (await this.getBrowser()).newPage();
        return this.#page;
    }
    
    async crawlSite({url, baseUrl}) {
        console.log("Crawling " + url);
        try {
            let page = await this.getBrowserPage();

            try {
                const sanitizedUrl = url.replace(/[^a-zA-Z0-9]/g, '_');
                if (this.#visited[sanitizedUrl]) return;
                // Mark URL as visited
                this.#visited[sanitizedUrl] = {
                    sanitizedUrl, 
                    url, 
                    status: 'pending'
                }

                // Fetch page HTML
                await page.goto(url);
                const html = await page.content();

                // Save to S3
                const sanitizedKey = path.join(this.#out_dir, 'zero-game-library/raw_html/' + sanitizedUrl + '.html');
                mkdirSync(path.dirname(sanitizedKey));
                writeFileSync(path.join(this.#out_dir, sanitizedKey), html);

                // Save to S3
                let contentHtml = await page.$('#main-content');
                contentHtml = contentHtml.$eval('#wiki-content-block', el => el.outerHTML);
                const contentSanitizedKey = path.join(this.#out_dir, 'zero-game-library/content/' + sanitizedUrl + '.html');
                mkdirSync(path.dirname(contentSanitizedKey));
                writeFileSync(path.join(this.#out_dir, contentSanitizedKey), contentHtml);

                this.#visited[sanitizedUrl]["status"] = "success";

                // Get links and enqueue them
                const links = await page.$$eval('a[href]', (anchors) =>
                    anchors.map((a) => a.href).filter((href) => href.includes( baseUrl.replace(/(https?\:\/\/)|\/$/ig, '') ))
                );
                for (const link of links) {
                    if (this.#visited[link.replace(/[^a-zA-Z0-9]/g, '_')]) continue;
                    this.#processQueue.push({
                        url: link,
                        baseUrl
                    })
                }

                if( this.#processQueue.length ) {
                    this.crawlSite(this.#processQueue.shift());
                }

            } catch (error) {
                console.error('Error:', error);

                // Mark URL as error in DynamoDB
                this.#visited[sanitizedUrl]["status"] = "error";
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
}