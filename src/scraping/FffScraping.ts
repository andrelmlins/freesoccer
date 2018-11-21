import FffConstants from '../constants/FffConstants';
import CompetitionScraping from './CompetitionScraping';

class FffScraping {
    private competitionScraping: CompetitionScraping;

    constructor() {
        this.competitionScraping = new CompetitionScraping;
    }

    public async run() {
        console.log("-> CBF SCRAPING");

        let competitions = FffConstants.COMPETITIONS;
        
        for(let i = 0; i < competitions.length; i++) {
            await this.competitionScraping.runFff(competitions[i]);
        }
    }
}

export default FffScraping;