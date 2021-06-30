import CompetitionCode from '@enums/CompetitionCode';
import Helpers from '@utils/Helpers';
import CompetitionUtil from '@utils/CompetitionUtil';

class Scraping {
  public lastYear: boolean;
  public competition: String;

  constructor(competition: String, lastYear: boolean) {
    this.lastYear = lastYear;
    this.competition = competition;
  }

  public async run() {
    const competitionEnum = Helpers.getEnumKeyByEnumValue(CompetitionCode, this.competition);
    const federation = CompetitionUtil.getFederation(competitionEnum!.split('_')[0]);
    const competition = CompetitionUtil.getCompetition(federation.Constant.COMPETITIONS, this.competition);
    const scraping = new federation.Scraping();
    await scraping.run(competition);
  }
}

export default Scraping;
