import cron from 'cron';

import CbfConstants from '../constants/CbfConstants';
import FffConstants from '../constants/FffConstants';
import FigcConstants from '../constants/FigcConstants';
import FpfConstants from '../constants/FpfConstants';
import RfefConstants from '../constants/RfefConstants';
import DfbConstants from '../constants/DfbConstants';
import FaConstants from '../constants/FaConstants';

import CbfScraping from '../scraping/CbfScraping';
import FffScraping from '../scraping/FffScraping';
import FigcScraping from '../scraping/FigcScraping';
import FpfScraping from '../scraping/FpfScraping';
import RfefScraping from '../scraping/RfefScraping';
import DfbScraping from '../scraping/DfbScraping';
import FaScraping from '../scraping/FaScraping';

import ICompetitionDefault from '../interfaces/ICompetitionDefault';

import CompetitionType from '../enums/CompetitionType';

export default class CronJobs {
  constructor() {}

  public crons(): void {
    new cron.CronJob(
      '0 */15 * * * *',
      async () => {
        console.log('START CRAWLER YEAR CURRENT');

        this.loopGeneric(CbfConstants.COMPETITIONS, new CbfScraping(true));
        this.loopGeneric(DfbConstants.COMPETITIONS, new DfbScraping(true));
        this.loopGeneric(FffConstants.COMPETITIONS, new FffScraping(true));
        this.loopGeneric(FigcConstants.COMPETITIONS, new FigcScraping(true));
        this.loopGeneric(FpfConstants.COMPETITIONS, new FpfScraping(true));
        this.loopGeneric(RfefConstants.COMPETITIONS, new RfefScraping(true));
        this.loopGeneric(FaConstants.COMPETITIONS, new FaScraping(true));
      },
      null,
      true,
      'America/Los_Angeles'
    );

    new cron.CronJob(
      '0 0 */12 * * *',
      async () => {
        console.log('START CRAWLER');

        this.loopGeneric(CbfConstants.COMPETITIONS, new CbfScraping(false));
        this.loopGeneric(DfbConstants.COMPETITIONS, new DfbScraping(false));
        this.loopGeneric(FffConstants.COMPETITIONS, new FffScraping(false));
        this.loopGeneric(FigcConstants.COMPETITIONS, new FigcScraping(false));
        this.loopGeneric(FpfConstants.COMPETITIONS, new FpfScraping(false));
        this.loopGeneric(RfefConstants.COMPETITIONS, new RfefScraping(false));
        this.loopGeneric(FaConstants.COMPETITIONS, new FaScraping(false));
      },
      null,
      true,
      'America/Los_Angeles'
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
