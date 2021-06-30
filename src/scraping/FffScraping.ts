import ICompetitionDefault from '@interfaces/ICompetitionDefault';
import IFederationScraping from '@interfaces/IFederationScraping';
import CompetitionType from '@enums/CompetitionType';
import FffLeagueScraping from './leagues/FffLeagueScraping';
import FffTableScraping from './tables/FffTableScraping';
import FffEliminationScraping from './elimination/FffEliminationScraping';

class FffScraping implements IFederationScraping {
  public lastYear: boolean;
  private fffLeagueScraping: FffLeagueScraping;
  private fffTableScraping: FffTableScraping;
  private fffEliminationScraping: FffEliminationScraping;

  constructor(lastYear = false) {
    this.lastYear = lastYear;

    this.fffLeagueScraping = new FffLeagueScraping(this.lastYear);
    this.fffTableScraping = new FffTableScraping(this.lastYear);
    this.fffEliminationScraping = new FffEliminationScraping(this.lastYear);
  }

  public async run(competition: ICompetitionDefault) {
    switch (competition.type) {
      case CompetitionType.LEAGUE:
        await this.runLeague(competition);
        break;
      case CompetitionType.ELIMINATION:
        await this.runElimination(competition);
        break;
      default:
        break;
    }
  }

  public async runTable(competition: ICompetitionDefault) {
    if (competition.type === CompetitionType.LEAGUE) {
      await this.fffTableScraping.run(competition);
    } else {
      throw new Error('Competition does not have a table');
    }
  }

  public async runLeague(competition: ICompetitionDefault) {
    await this.fffLeagueScraping.run(competition);
  }

  public async runElimination(competition: ICompetitionDefault) {
    await this.fffEliminationScraping.run(competition);
  }
}

export default FffScraping;
