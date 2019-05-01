import cron from "cron";

import CbfConstants from "../constants/CbfConstants";
import FffConstants from "../constants/FffConstants";
import FigcConstants from "../constants/FigcConstants";
import FpfConstants from "../constants/FpfConstants";
import RfefConstants from "../constants/RfefConstants";

import CbfScraping from "../scraping/federations/CbfScraping";
import FffScraping from "../scraping/federations/FffScraping";
import FigcScraping from "../scraping/federations/FigcScraping";
import FpfScraping from "../scraping/federations/FpfScraping";
import RfefScraping from "../scraping/federations/RfefScraping";
import DfbScraping from "../scraping/federations/DfbScraping";
import DfbConstants from "../constants/DfbConstants";
import ICompetitionDefault from "../interfaces/ICompetitionDefault";

import CompetitionType from "../enums/CompetitionType";

export default class CronJobs {
  constructor() {}

  public crons(): void {
    // new cron.CronJob(
    //   "0 */30 * * * *",
    //   async () => {
    //     console.log("START CRAWLER YEAR CURRENT");

    //     this.loopGeneric(CbfConstants.COMPETITIONS, new CbfScraping(true));
    //     this.loopGeneric(DfbConstants.COMPETITIONS, new DfbScraping(true));
    //     this.loopGeneric(FffConstants.COMPETITIONS, new FffScraping(true));
    //     this.loopGeneric(FigcConstants.COMPETITIONS, new FigcScraping(true));
    //     this.loopGeneric(FpfConstants.COMPETITIONS, new FpfScraping(true));
    //     this.loopGeneric(RfefConstants.COMPETITIONS, new RfefScraping(true));
    //   },
    //   null,
    //   true,
    //   "America/Los_Angeles"
    // );

    new cron.CronJob(
      "0 0 */12 * * *",
      async () => {
        console.log("START CRAWLER");

        this.loopGeneric(CbfConstants.COMPETITIONS, new CbfScraping(false));
        this.loopGeneric(DfbConstants.COMPETITIONS, new DfbScraping(false));
        this.loopGeneric(FffConstants.COMPETITIONS, new FffScraping(false));
        this.loopGeneric(FigcConstants.COMPETITIONS, new FigcScraping(false));
        this.loopGeneric(FpfConstants.COMPETITIONS, new FpfScraping(false));
        this.loopGeneric(RfefConstants.COMPETITIONS, new RfefScraping(false));
      },
      null,
      true,
      "America/Los_Angeles"
    );
  }

  private async loopGeneric(competitions: Array<ICompetitionDefault>, scraping: any) {
    for (let i = 0; i < competitions.length; i++) {
      await scraping.run(competitions[i]);
      if (competitions[i].type == CompetitionType.LEAGUE) {
        await scraping.runTable(competitions[i]);
      }
    }
  }
}
