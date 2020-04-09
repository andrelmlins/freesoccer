import commander from 'commander';
import mongoose from 'mongoose';

import CompetitionUtil from '../utils/CompetitionUtil';

class Commander {
  public program: commander.Command;

  constructor() {
    this.program = new commander.Command();
    this.program.version('0.0.1');

    this.config();
    this.run();
  }

  private config(): void {
    const ipMongo = process.env.IP_MONGO || 'localhost';
    const baseMongo = process.env.BASE_MONGO || 'freesoccer';
    const usrMongo = process.env.USR_MONGO;
    const pswMongo = process.env.PSW_MONGO;

    if (usrMongo) {
      mongoose.connect(`mongodb://${usrMongo}:${pswMongo}@${ipMongo}/${baseMongo}`, { useUnifiedTopology: true, useNewUrlParser: true });
    } else {
      mongoose.connect(`mongodb://${ipMongo}/${baseMongo}`, { useUnifiedTopology: true, useNewUrlParser: true });
    }
  }

  private run(): void {
    this.program
      .option('-c, --competition <competition>', 'scraping in competition')
      .option('-l, --last-year', 'scraping in lastyear')
      .option('-t, --table', 'scraping in table competition');

    this.program.parse(process.argv);

    if (this.program.competition) {
      CompetitionUtil.runScraping(this.program.competition, this.program.lastYear, this.program.table);
    } else {
      throw new Error('Competition does not exist');
    }
  }
}

export default new Commander();
