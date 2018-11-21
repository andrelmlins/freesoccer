import ICompetitionDefault from '../../interfaces/ICompetitionDefault';
import IFederationScraping from '../../interfaces/IFederationScraping';
import CompetitionType from '../../enums/CompetitionType';
import RfefLeagueScraping from '../RfefLeagueScraping';

export default class RfefScraping implements IFederationScraping {
    private rfefLeagueScraping: RfefLeagueScraping;

    constructor() {
        this.rfefLeagueScraping = new RfefLeagueScraping;
    }

    public async run(competition: ICompetitionDefault) {
        console.log("-> RFEF SCRAPING");

        switch(competition.type){
            case CompetitionType.LEAGUE:
                await this.runLeague(competition);
        }
    }

    public async runLeague(competition: ICompetitionDefault) {
        await this.rfefLeagueScraping.run(competition);
    }
}