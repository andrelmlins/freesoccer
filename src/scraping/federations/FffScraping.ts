import ICompetitionDefault from '../../interfaces/ICompetitionDefault';
import IFederationScraping from '../../interfaces/IFederationScraping';
import CompetitionType from '../../enums/CompetitionType';
import FffLeagueScraping from '../FffLeagueScraping';

export default class FffScraping implements IFederationScraping {
    private fffLeagueScraping: FffLeagueScraping;

    constructor() {
        this.fffLeagueScraping = new FffLeagueScraping;
    }

    public async run(competition: ICompetitionDefault) {
        console.log("-> FFF SCRAPING");

        switch(competition.type){
            case CompetitionType.LEAGUE:
                await this.runLeague(competition);
        }
    }

    public async runLeague(competition: ICompetitionDefault) {
        await this.fffLeagueScraping.run(competition);
    }
}