import ICompetitionDefault from '../../interfaces/ICompetitionDefault';
import IFederationScraping from '../../interfaces/IFederationScraping';
import CompetitionType from '../../enums/CompetitionType';
import DfbLeagueScraping from '../DfbLeagueScraping';

export default class DfbScraping implements IFederationScraping {
    private dbcLeagueScraping: DfbLeagueScraping;

    constructor() {
        this.dbcLeagueScraping = new DfbLeagueScraping;
    }

    public async run(competition: ICompetitionDefault) {
        console.log("-> DFB SCRAPING");

        switch(competition.type){
            case CompetitionType.LEAGUE:
                await this.runLeague(competition);
        }
    }

    public async runLeague(competition: ICompetitionDefault) {
        await this.dbcLeagueScraping.run(competition);
    }
}