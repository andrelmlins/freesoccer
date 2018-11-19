import * as request from 'request-promise-any';
import * as cheerio from 'cheerio';

import CompetitionScraping from './CompetitionScraping';
import RfefConstants from '../constants/RfefConstants';

class RfefScraping {
    private competitionScraping: CompetitionScraping;

    constructor() {
        this.competitionScraping = new CompetitionScraping;
    }

    public async run() {
        console.log("-> RFEF SCRAPING");
        for(let i = 0; i < RfefConstants.COMPETITIONS.length; i++){
            await this.competitionScraping.runRfef(RfefConstants.COMPETITIONS[i]);
        }
    }
}

export default RfefScraping;