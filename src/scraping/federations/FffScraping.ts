import ICompetitionDefault from '../../interfaces/ICompetitionDefault';
import IFederationScraping from '../../interfaces/IFederationScraping';
import CompetitionType from '../../enums/CompetitionType';
import FffLeagueScraping from '../FffLeagueScraping';
import FffTableScraping from '../FffTableScraping';

export default class FffScraping implements IFederationScraping {
    private fffLeagueScraping: FffLeagueScraping;
    private fffTableScraping: FffTableScraping;

    constructor() {
        this.fffLeagueScraping = new FffLeagueScraping;
        this.fffTableScraping = new FffTableScraping;
    }

    public async run(competition: ICompetitionDefault) {
        console.log("-> FFF SCRAPING");

        switch(competition.type){
            case CompetitionType.LEAGUE:
                await this.runLeague(competition);
        }
    }

    public async runTable(competition: ICompetitionDefault) {
        console.log("-> FFF TABLE SCRAPING");

        if(competition.type===CompetitionType.LEAGUE){
            await this.fffTableScraping.run(competition);
        } else {
            throw new Error("Competition does not have a table")
        }
    }

    public async runLeague(competition: ICompetitionDefault) {
        await this.fffLeagueScraping.run(competition);
    }
}