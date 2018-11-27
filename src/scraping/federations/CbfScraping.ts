import ICompetitionDefault from '../../interfaces/ICompetitionDefault';
import IFederationScraping from '../../interfaces/IFederationScraping';

import CompetitionType from '../../enums/CompetitionType';

import CbfLeagueScraping from '../CbfLeagueScraping';
import CbfTableScraping from '../tables/CbfTableScraping';
import CbfEliminationScraping from '../elimination/CbfEliminationScraping';

export default class CbfScraping implements IFederationScraping {
    private cbfLeagueScraping: CbfLeagueScraping;
    private cbfTableScraping: CbfTableScraping;
    private cbfEliminationScraping: CbfEliminationScraping;

    constructor() {
        this.cbfLeagueScraping = new CbfLeagueScraping;
        this.cbfTableScraping = new CbfTableScraping;
        this.cbfEliminationScraping = new CbfEliminationScraping;
    }

    public async run(competition: ICompetitionDefault) {
        console.log("-> CBF SCRAPING");

        switch(competition.type){
            case CompetitionType.LEAGUE:
                await this.runLeague(competition);
            case CompetitionType.ELIMINATION:
                await this.runElimination(competition);
        }
    }

    public async runTable(competition: ICompetitionDefault) {
        console.log("-> CBF TABLE SCRAPING");

        if(competition.type===CompetitionType.LEAGUE){
            await this.cbfTableScraping.run(competition);
        } else {
            throw new Error("Competition does not have a table")
        }
    }

    public async runLeague(competition: ICompetitionDefault) {
        await this.cbfLeagueScraping.run(competition);
    }

    public async runElimination(competition: ICompetitionDefault) {
        await this.cbfEliminationScraping.run(competition);
    }
}