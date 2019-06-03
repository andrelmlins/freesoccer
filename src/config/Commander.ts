import commander from "commander";
import mongoose from "mongoose";

import CompetitionUtil from "../utils/CompetitionUtil";

class Commander {
  public program: commander.Command;

  constructor() {
    this.program = new commander.Command();
    this.program.version('0.0.1');

    this.config();
    this.run();
  }

  private config(): void {
    const ipMongo = process.env.IP_MONGO || "localhost";
    const baseMongo = process.env.BASE_MONGO || "freesoccer";
    const usrMongo = process.env.USR_MONGO;
    const pswMongo = process.env.PSW_MONGO;

    if (usrMongo) {
      mongoose.connect(`mongodb://${usrMongo}:${pswMongo}@${ipMongo}/${baseMongo}`);
    } else {
      mongoose.connect(`mongodb://${ipMongo}/${baseMongo}`);
    }
  }

  private run(): void {
    this.program
      .option('-c, --competition <competition>', 'scraping in competition')
      .option('-l, --last-year', 'scraping in lastyear');

    this.program.parse(process.argv);

    if(this.program.competition){
      CompetitionUtil.runScraping(this.program.competition, this.program.lastYear);
    }
  }
}

export default new Commander();
