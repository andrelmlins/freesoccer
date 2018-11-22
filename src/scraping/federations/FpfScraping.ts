import ICompetitionDefault from '../../interfaces/ICompetitionDefault';
import IFederationScraping from '../../interfaces/IFederationScraping';
import CompetitionType from '../../enums/CompetitionType';
import FpfLeagueScraping from '../FpfLeagueScraping';

export default class FpfScraping implements IFederationScraping {
    private fpfLeagueScraping: FpfLeagueScraping;

    constructor() {
        this.fpfLeagueScraping = new FpfLeagueScraping;
    }

    public async run(competition: ICompetitionDefault) {
        console.log("-> FPF SCRAPING");

        switch(competition.type){
            case CompetitionType.LEAGUE:
                await this.runLeague(competition);
        }
    }

    public async runLeague(competition: ICompetitionDefault) {
        await this.fpfLeagueScraping.run(competition);
    }
}