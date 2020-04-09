import ICompetitionDefault from '../interfaces/ICompetitionDefault';
import IFederationScraping from '../interfaces/IFederationScraping';
import CompetitionType from '../enums/CompetitionType';
import RfefLeagueScraping from './leagues/RfefLeagueScraping';
import RfefTableScraping from './tables/RfefTableScraping';

export default class RfefScraping implements IFederationScraping {
  public lastYear: boolean;
  private rfefLeagueScraping: RfefLeagueScraping;
  private rfefTableScraping: RfefTableScraping;

  constructor(lastYear: boolean = false) {
    this.lastYear = lastYear;

    this.rfefLeagueScraping = new RfefLeagueScraping(this.lastYear);
    this.rfefTableScraping = new RfefTableScraping(this.lastYear);
  }

  public async run(competition: ICompetitionDefault) {
    switch (competition.type) {
      case CompetitionType.LEAGUE:
        await this.runLeague(competition);
        break;
    }
  }

  public async runLeague(competition: ICompetitionDefault) {
    await this.rfefLeagueScraping.run(competition);
  }

  public async runTable(competition: ICompetitionDefault) {
    console.log('-> RFEF TABLE SCRAPING');

    if (competition.type === CompetitionType.LEAGUE) {
      await this.rfefTableScraping.run(competition);
    } else {
      throw new Error('Competition does not have a table');
    }
  }
}
