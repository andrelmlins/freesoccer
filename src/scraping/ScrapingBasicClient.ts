import puppeteer from 'puppeteer-extra';
import autoScrollPlugin from 'puppeteer-extra-plugin-auto-scroll';
import cheerio from 'cheerio';

import ScrapingBasic from './ScrapingBasic';

abstract class ScrapingBasicClient extends ScrapingBasic {
  protected async getPageDinamically(url: string, stop: string): Promise<any> {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(this.getConstants().URL_DEFAULT + '/' + url);
    await page.waitForSelector(stop);

    let content = await page.content();
    await browser.close();

    let $ = cheerio.load(content);
    return $;
  }

  protected async getPageDinamicallyScroll(url: string): Promise<any> {
    puppeteer.use(autoScrollPlugin());

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(this.getConstants().URL_DEFAULT + '/' + url);
    // @ts-ignore
    await page.autoScroll(null, 100, 1000);

    let content = await page.content();
    await browser.close();

    let $ = cheerio.load(content);
    return $;
  }
}

export default ScrapingBasicClient;
