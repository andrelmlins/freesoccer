import { Request } from 'express';
import puppeteer from 'puppeteer';

import ICompetitionDefault from '../interfaces/ICompetitionDefault';

import { ICompetition, Competition } from '../schemas/Competition';
import { IStage, Stage } from '../schemas/Stage';

export default class Helpers {
  public static getEnumKeyByEnumValue(myEnum: any, enumValue: String) {
    let keys = Object.keys(myEnum).filter(x => myEnum[x] == enumValue);
    return keys.length > 0 ? keys[0] : null;
  }

  public static async replaceStage(stage: IStage): Promise<IStage | null> {
    let stageOld = await Stage.findOne({ hash: stage.hash });
    if (stageOld) {
      let stageAux: any = stage.toObject();
      delete stageAux._id;

      await Stage.updateOne({ _id: stageOld._id }, stageAux);

      let stageResult = await Stage.findOne({ hash: stage.hash });
      return stageResult;
    } else {
      let stageResult = await Stage.create(stage);
      return stageResult;
    }
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

  public static async autoScroll(page: any) {
    await page.evaluate(`(async () => {
      await new Promise((resolve, reject) => {
        let totalHeight = 0;
        let distance = 100;
        let timer = setInterval(() => {
          let scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 1000);
      });
    })()`);
  }

  public static async getPageDinamically(url: String, stop: String): Promise<String> {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector(stop);

    let content = await page.content();
    await browser.close();
    return content;
  }

  public static async getPageDinamicallyScroll(url: String): Promise<String> {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url);
    await Helpers.autoScroll(page);

    let content = await page.content();
    await browser.close();
    return content;
  }
}
