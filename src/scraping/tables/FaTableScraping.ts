import ICompetitionDefault from '../../interfaces/ICompetitionDefault';

export default class FaTableScraping {
  public lastYear: boolean;

  constructor(lastYear: boolean) {
    this.lastYear = lastYear;
  }

  public async run(competition: ICompetitionDefault) {
    console.log('-> FA TABLE LEAGUE SCRAPING');

    //await this.runCompetition(competition)
  }
}
