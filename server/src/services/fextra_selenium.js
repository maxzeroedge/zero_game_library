const { Builder, By } = require('selenium-webdriver');
const readlineSync = require('readline-sync');

export class FextraSelenium {
    /**
     * 
     * @param {"chrome" | "firefox"} browserChoice 
     */
    constructor(browserChoice="chrome") {
        this.browserChoice = browserChoice.toLowerCase();
        this.driver = null;
    }

    async setupDriver() {
        // Initialize WebDriver based on browser choice
        if (this.browserChoice === 'chrome') {
            this.driver = await new Builder().forBrowser('chrome').build();
        } else if (this.browserChoice === 'firefox') {
            this.driver = await new Builder().forBrowser('firefox').build();
        } else {
            console.log("Unsupported browser choice. Please use 'chrome' or 'firefox'.");
            process.exit(1);
        }
    }

    // Helper method to detect Captcha presence
    async isCaptchaPresent() {
        try {
            // Common patterns to detect Captcha; may need adjustment for different Captcha implementations
            const recaptchaFrame = await this.driver.findElements(By.css("iframe[src*='recaptcha']"));
            const captchaText = await this.driver.findElements(By.xpath("//*[contains(text(), 'please verify')]"));
            
            // Check if any Captcha-related elements are found
            return recaptchaFrame.length > 0 || captchaText.length > 0;
        } catch (error) {
            console.log("Error while detecting Captcha:", error);
            return false;
        }
    }

    async navigateToFextralife() {
        const url = 'https://fextralife.com/wikis/';
        
        // Open the Fextralife URL
        await this.driver.get(url);
        
        if(await this.isCaptchaPresent()) {
            // Prompt the user to solve any Captcha manually if required
            console.log("Please resolve any Cloudflare or Captcha check in the browser.");
            readlineSync.question("Press Enter here once you've completed any Captcha checks...");
        }

        // Wait for the page to load completely
        await this.driver.sleep(5000);
    }

    async fetchGameTitles() {
        const gameElements = await this.driver.findElements(By.css("a.wiki-link"));
        const gameTitles = [];

        // Extract titles from each game element
        for (let game of gameElements) {
            const name = await game.getAttribute('title');
            const url = await game.getAttribute('href');
            if (name) {
                gameTitles.push({
                    name,
                    url
                });
            }
        }

        // Print the list of supported games
        console.log("Supported Games on Fextralife:");
        gameTitles.forEach((game, idx) => {
            console.log(`${idx + 1}. ${game}`);
        });
    }

    async searchInGame(gameTitle, searchTerm) {
        // Find the URL for the specified game
        const gameUrl = this.gameUrls.get(gameTitle);
        
        if (!gameUrl) {
            console.log(`Game titled "${gameTitle}" not found in the supported games list.`);
            return;
        }

        // Navigate to the game URL
        await this.driver.get(gameUrl);
        console.log(`Navigated to ${gameTitle} wiki page.`);

         // Check if a Captcha is present
         const captchaDetected = await this.isCaptchaPresent();
         if (captchaDetected) {
             console.log("Captcha detected. Please solve it in the browser.");
             readlineSync.question("Press Enter here once you've completed the Captcha...");
         }

        // Search functionality depends on the site’s structure; here, we assume there's a search box
        // Find the search box within the game page
        try {
            const searchBox = await this.driver.findElement(By.css("input[type='search']"));
            await searchBox.sendKeys(searchTerm);
            searchBox.sendKeys('\n'); // Submit the search
            await this.driver.wait(until.urlContains(searchTerm), 5000);
            
            console.log(`Searching for "${searchTerm}" within the ${gameTitle} wiki page...`);
            await this.driver.sleep(2000); // Wait to let results load
        } catch (error) {
            console.log("Search functionality might not be available on this page.");
        }
    }

    async close() {
        // Close the browser
        await this.driver.quit();
    }

}