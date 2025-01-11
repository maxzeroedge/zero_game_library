import { LoneCrawler } from "./crawler.js";

new LoneCrawler(
    process.env.CRAWL_OUTPUT_DIR,
).crawlSite({
    url: "https://eldenring.wiki.fextralife.com/Elden+Ring+Wiki",
    baseUrl: "https://eldenring.wiki.fextralife.com"
});