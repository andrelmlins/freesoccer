import * as cron from 'cron';

import CbfController from '../controllers/scraping/CbfController';
import RfefController from "../controllers/scraping/RfefController";
import FffController from "../controllers/scraping/FffController";
import FigcController from "../controllers/scraping/FigcController";
import DfbController from "../controllers/scraping/DfbController";
import FpfController from "../controllers/scraping/FpfController";

export default class CronJobs { 
    public cbfController: CbfController;
    public rfefController: RfefController;
    public fffController: FffController;
    public figcController: FigcController;
    public dfbController: DfbController;
    public fpfController: FpfController;

    constructor() {
        this.cbfController = new CbfController;
        this.rfefController = new RfefController;
        this.fffController = new FffController;
        this.figcController = new FigcController;
        this.dfbController = new DfbController;
        this.fpfController = new FpfController;
    }
    
    public crons(app:any): void { 
        new cron.CronJob('* * * * * *', function() {
            console.log('You will see this message every second');
          }, null, true, 'America/Los_Angeles');
    }
}