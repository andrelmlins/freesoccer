import ICompetitionDefault from '../../interfaces/ICompetitionDefault';
import IFederationScraping from '../../interfaces/IFederationScraping';
import CompetitionType from '../../enums/CompetitionType';
import FpfLeagueScraping from '../FpfLeagueScraping';
import FpfTableScraping from '../tables/FpfTableScraping';
import { Request } from 'express';

export default class FpfScraping implements IFederationScraping {
    private fpfLeagueScraping: FpfLeagueScraping;
    private fpfTableScraping: FpfTableScraping;

    constructor(request: Request) {
        this.fpfLeagueScraping = new FpfLeagueScraping(request);
        this.fpfTableScraping = new FpfTableScraping(request);
    }

    public async run(competition: ICompetitionDefault) {
        console.log("-> FPF SCRAPING");

        switch(competition.type){
            case CompetitionType.LEAGUE:
                await this.runLeague(competition);
        }
    }

    public async runTable(competition: ICompetitionDefault) {
        console.log("-> FPF TABLE SCRAPING");

        if(competition.type===CompetitionType.LEAGUE){
            await this.fpfTableScraping.run(competition);
        } else {
            throw new Error("Competition does not have a table")
        }
    }

    public async runLeague(competition: ICompetitionDefault) {
        await this.fpfLeagueScraping.run(competition);
    }
}