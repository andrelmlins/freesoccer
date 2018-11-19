import CbfConstants from '../constants/CbfConstants';
import CompetitionScraping from './CompetitionScraping';

class CbfScraping {
    private competitionScraping: CompetitionScraping;

    constructor() {
        this.competitionScraping = new CompetitionScraping;
    }

    public async run() {
        console.log("-> CBF SCRAPING");

        let competitions = CbfConstants.COMPETITIONS;
        
        for(let i = 0; i < competitions.length; i++) {
            await this.competitionScraping.runCbf(competitions[i]);
        }
    }
}

export default CbfScraping;