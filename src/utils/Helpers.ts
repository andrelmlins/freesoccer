import { Request } from 'express';
import puppeteer from 'puppeteer-extra';
import autoScrollPlugin from 'puppeteer-extra-plugin-auto-scroll';

import ICompetitionDefault from '../interfaces/ICompetitionDefault';

import { ICompetition, Competition } from '../schemas/Competition';

export default class Helpers {
  public static getEnumKeyByEnumValue(myEnum: any, enumValue: String) {
    let keys = Object.keys(myEnum).filter(x => myEnum[x] == enumValue);
    return keys.length > 0 ? keys[0] : null;
  }

  public static async createCompetition(competitionDefault: ICompetitionDefault, year: string, constants: any): Promise<ICompetition> {
    let competition = await Competition.findOne({ code: competitionDefault.code, year: year });
    if (competition) {
      competition.rounds = [];
    } else {
      competition = new Competition();
      competition.name = competitionDefault.name;
      competition.code = competitionDefault.code;
      competition.type = competitionDefault.type;
      competition.year = year;
      competition.country = constants.COUNTRY;
      competition.federation = constants.FEDERATION;
      competition.rounds = [];
      competition.stages = [];
    }

    return competition;
  }

  public static getUrl(req: Request, url: string): string {
    return req.protocol + '://' + req.get('host') + url;
  }
}
