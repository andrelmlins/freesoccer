import ICompetitionDefault from '../interfaces/ICompetitionDefault';
import LoadingCli from '../utils/LoadingCli';

export default abstract class ScrapingBasic {
  public lastYear: boolean;
  protected loadingCli: LoadingCli;

  constructor(lastYear: boolean) {
    this.lastYear = lastYear;
    this.loadingCli = new LoadingCli();
  }

  public abstract async runCompetition(competitionDefault: ICompetitionDefault): Promise<any>;
  public abstract getTitle(): string;

  public async run(competition: ICompetitionDefault) {
    this.loadingCli.start();
    this.loadingCli.push(this.getTitle());

    await this.runBasicCompetition(competition);

    this.loadingCli.pop();
  }

  public async runBasicCompetition(competitionDefault: ICompetitionDefault) {
    this.loadingCli.push(competitionDefault.name);

    await this.runCompetition(competitionDefault);
  }
}
