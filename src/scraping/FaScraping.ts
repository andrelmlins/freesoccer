import ICompetitionDefault from '@interfaces/ICompetitionDefault';
import IFederationScraping from '@interfaces/IFederationScraping';
import CompetitionType from '@enums/CompetitionType';
import FaLeagueScraping from './leagues/FaLeagueScraping';

class FaScraping implements IFederationScraping {
  public lastYear: boolean;
  private faLeagueScraping: FaLeagueScraping;

  constructor(lastYear = false) {
    this.lastYear = lastYear;

    this.faLeagueScraping = new FaLeagueScraping(this.lastYear);
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

  public async runLeague(competition: ICompetitionDefault) {
    await this.faLeagueScraping.run(competition);
  }
}

export default FaScraping;
