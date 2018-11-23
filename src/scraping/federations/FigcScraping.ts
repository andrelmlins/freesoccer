import ICompetitionDefault from '../../interfaces/ICompetitionDefault';
import IFederationScraping from '../../interfaces/IFederationScraping';
import CompetitionType from '../../enums/CompetitionType';
import FigcLeagueScraping from '../FigcLeagueScraping';
import FigcTableScraping from '../FigcTableScraping';

export default class FigcScraping implements IFederationScraping {
    private figcLeagueScraping: FigcLeagueScraping;
    private figcTableScraping: FigcTableScraping;

    constructor() {
        this.figcLeagueScraping = new FigcLeagueScraping;
        this.figcTableScraping = new FigcTableScraping;
    }

    public async run(competition: ICompetitionDefault) {
        console.log("-> FIGC SCRAPING");

        switch(competition.type){
            case CompetitionType.LEAGUE:
                await this.runLeague(competition);
        }
    }

    public async runTable(competition: ICompetitionDefault) {
        console.log("-> FIGC TABLE SCRAPING");

        if(competition.type===CompetitionType.LEAGUE){
            await this.figcTableScraping.run(competition);
        } else {
            throw new Error("Competition does not have a table")
        }
    }

    public async runLeague(competition: ICompetitionDefault) {
        await this.figcLeagueScraping.run(competition);
    }
}