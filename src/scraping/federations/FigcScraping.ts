import ICompetitionDefault from '../../interfaces/ICompetitionDefault';
import IFederationScraping from '../../interfaces/IFederationScraping';
import CompetitionType from '../../enums/CompetitionType';
import FigcLeagueScraping from '../FigcLeagueScraping';

export default class FigcScraping implements IFederationScraping {
    private figcLeagueScraping: FigcLeagueScraping;

    constructor() {
        this.figcLeagueScraping = new FigcLeagueScraping;
    }

    public async run(competition: ICompetitionDefault) {
        console.log("-> FIGC SCRAPING");

        switch(competition.type){
            case CompetitionType.LEAGUE:
                await this.runLeague(competition);
        }
    }

    public async runLeague(competition: ICompetitionDefault) {
        await this.figcLeagueScraping.run(competition);
    }
}