import cheerio from 'cheerio';
import axios from 'axios';
import https from 'https';

import LoadingCli from '@utils/LoadingCli';
import ICompetitionDefault from '@interfaces/ICompetitionDefault';
import { ICompetition, Competition } from '@schemas/Competition';

abstract class ScrapingBasic {
  protected lastYear: boolean;
  protected loadingCli: LoadingCli;

  constructor(lastYear: boolean) {
    this.lastYear = lastYear;
    this.loadingCli = new LoadingCli();
  }

  public abstract runCompetition(competitionDefault: ICompetitionDefault): Promise<any>;
  public abstract getTitle(): string;
  public abstract getConstants(): any;

  public async getPageData(url: string): Promise<any> {
    const axiosObject = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });

    const page = await axiosObject.get(`${this.getConstants().URL_DEFAULT}/${url}`);
    const $ = cheerio.load(page.data);

    return $;
  }

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

  public async createCompetition(competitionDefault: ICompetitionDefault, year: string): Promise<ICompetition> {
    let competition = await Competition.findOne({
      code: competitionDefault.code,
      year,
    });
    if (competition) {
      competition.rounds = [];
    } else {
      competition = new Competition();
      competition.name = competitionDefault.name;
      competition.code = competitionDefault.code;
      competition.type = competitionDefault.type;
      competition.year = year;
      competition.country = this.getConstants().COUNTRY;
      competition.federation = this.getConstants().FEDERATION;
      competition.rounds = [];
      competition.stages = [];
    }

    return competition;
  }
}

export default ScrapingBasic;
