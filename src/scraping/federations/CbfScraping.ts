import ICompetitionDefault from '../../interfaces/ICompetitionDefault';
import IFederationScraping from '../../interfaces/IFederationScraping';
import CompetitionType from '../../enums/CompetitionType';
import CbfLeagueScraping from '../CbfLeagueScraping';

export default class CbfScraping implements IFederationScraping {
    private cbfLeagueScraping: CbfLeagueScraping;

    constructor() {
        this.cbfLeagueScraping = new CbfLeagueScraping;
    }

    public async run(competition: ICompetitionDefault) {
        console.log("-> CBF SCRAPING");

        switch(competition.type){
            case CompetitionType.LEAGUE:
                await this.runLeague(competition);
        }
    }

    public async runLeague(competition: ICompetitionDefault) {
        await this.cbfLeagueScraping.run(competition);
    }
}