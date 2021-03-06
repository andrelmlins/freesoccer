import ICompetitionDefault from '@interfaces/ICompetitionDefault';
import IFederationScraping from '@interfaces/IFederationScraping';
import CompetitionType from '@enums/CompetitionType';
import DfbLeagueScraping from './leagues/DfbLeagueScraping';
import DfbTableScraping from './tables/DfbTableScraping';

class DfbScraping implements IFederationScraping {
  public lastYear: boolean;
  private dbcLeagueScraping: DfbLeagueScraping;
  private dfbTableScraping: DfbTableScraping;

  constructor(lastYear = false) {
    this.lastYear = lastYear;

    this.dbcLeagueScraping = new DfbLeagueScraping(this.lastYear);
    this.dfbTableScraping = new DfbTableScraping(this.lastYear);
  }

  public async run(competition: ICompetitionDefault) {
    switch (competition.type) {
      case CompetitionType.LEAGUE:
        await this.runLeague(competition);
        break;
      default:
        break;
    }
  }

  public async runTable(competition: ICompetitionDefault) {
    if (competition.type === CompetitionType.LEAGUE) {
      await this.dfbTableScraping.run(competition);
    } else {
      throw new Error('Competition does not have a table');
    }
  }

  public async runLeague(competition: ICompetitionDefault) {
    await this.dbcLeagueScraping.run(competition);
  }
}

export default DfbScraping;
