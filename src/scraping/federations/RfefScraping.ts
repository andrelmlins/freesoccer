import ICompetitionDefault from '../../interfaces/ICompetitionDefault';
import IFederationScraping from '../../interfaces/IFederationScraping';
import CompetitionType from '../../enums/CompetitionType';
import RfefLeagueScraping from '../RfefLeagueScraping';
import RfefTableScraping from '../tables/RfefTableScraping';

export default class RfefScraping implements IFederationScraping {
    private rfefLeagueScraping: RfefLeagueScraping;
    private rfefTableScraping: RfefTableScraping;

    constructor() {
        this.rfefLeagueScraping = new RfefLeagueScraping;
        this.rfefTableScraping = new RfefTableScraping;
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

    public async runTable(competition: ICompetitionDefault) {
        console.log("-> RFEF TABLE SCRAPING");

        if(competition.type===CompetitionType.LEAGUE){
            await this.rfefTableScraping.run(competition);
        } else {
            throw new Error("Competition does not have a table")
        }
    }
}