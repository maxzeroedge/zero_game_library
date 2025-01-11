import { LoneCrawler } from "./crawler";

LoneCrawler(
    process.env.CRAWL_OUTPUT_DIR,
).crawlSite({
    url: "https://eldenring.wiki.fextralife.com/Elden+Ring+Wiki",
    baseUrl: "https://eldenring.wiki.fextralife.com"
});