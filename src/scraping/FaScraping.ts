import ICompetitionDefault from '@interfaces/ICompetitionDefault';
import IFederationScraping from '@interfaces/IFederationScraping';
import CompetitionType from '@enums/CompetitionType';
import FaLeagueScraping from './leagues/FaLeagueScraping';
import FaTableScraping from './tables/FaTableScraping';

class FaScraping implements IFederationScraping {
  public lastYear: boolean;
  private faLeagueScraping: FaLeagueScraping;
  private faTableScraping: FaTableScraping;

  constructor(lastYear: boolean = false) {
    this.lastYear = lastYear;

    this.faLeagueScraping = new FaLeagueScraping(this.lastYear);
    this.faTableScraping = new FaTableScraping(this.lastYear);
  }

  public async run(competition: ICompetitionDefault) {
    switch (competition.type) {
      case CompetitionType.LEAGUE:
        await this.runLeague(competition);
        break;
    }
  }

  public async runTable(competition: ICompetitionDefault) {
    if (competition.type === CompetitionType.LEAGUE) {
      await this.faTableScraping.run(competition);
    } else {
      throw new Error('Competition does not have a table');
    }
  }

  public async runLeague(competition: ICompetitionDefault) {
    await this.faLeagueScraping.run(competition);
  }
}

export default FaScraping;
