import ICompetitionDefault from '../../interfaces/ICompetitionDefault';
import IFederationScraping from '../../interfaces/IFederationScraping';
import CompetitionType from '../../enums/CompetitionType';
import DfbLeagueScraping from '../DfbLeagueScraping';
import DfbTableScraping from '../DfbTableScraping';

export default class DfbScraping implements IFederationScraping {
    private dbcLeagueScraping: DfbLeagueScraping;
    private dfbTableScraping: DfbTableScraping;

    constructor() {
        this.dbcLeagueScraping = new DfbLeagueScraping;
        this.dfbTableScraping = new DfbTableScraping;
    }

    public async run(competition: ICompetitionDefault) {
        console.log("-> DFB SCRAPING");

        switch(competition.type){
            case CompetitionType.LEAGUE:
                await this.runLeague(competition);
        }
    }

    public async runTable(competition: ICompetitionDefault) {
        console.log("-> DFB TABLE SCRAPING");

        if(competition.type===CompetitionType.LEAGUE){
            await this.dfbTableScraping.run(competition);
        } else {
            throw new Error("Competition does not have a table")
        }
    }

    public async runLeague(competition: ICompetitionDefault) {
        await this.dbcLeagueScraping.run(competition);
    }
}