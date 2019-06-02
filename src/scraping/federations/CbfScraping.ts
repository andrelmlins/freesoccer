import ICompetitionDefault from "../../interfaces/ICompetitionDefault";
import IFederationScraping from "../../interfaces/IFederationScraping";

import CompetitionType from "../../enums/CompetitionType";

import CbfLeagueScraping from "../leagues/CbfLeagueScraping";
import CbfTableScraping from "../tables/CbfTableScraping";
import CbfEliminationScraping from "../elimination/CbfEliminationScraping";

export default class CbfScraping implements IFederationScraping {
  public lastYear: boolean;
  private cbfLeagueScraping: CbfLeagueScraping;
  private cbfTableScraping: CbfTableScraping;
  private cbfEliminationScraping: CbfEliminationScraping;

  constructor(lastYear: boolean = false) {
    this.lastYear = lastYear;

    this.cbfLeagueScraping = new CbfLeagueScraping(this.lastYear);
    this.cbfTableScraping = new CbfTableScraping(this.lastYear);
    this.cbfEliminationScraping = new CbfEliminationScraping(this.lastYear);
  }

  public async run(competition: ICompetitionDefault) {
    console.log("-> CBF SCRAPING");
    this.lastYear = true;

    switch (competition.type) {
      case CompetitionType.LEAGUE:
        await this.runLeague(competition);
        break;
      case CompetitionType.ELIMINATION:
        await this.runElimination(competition);
        break;
    }
  }

  public async runTable(competition: ICompetitionDefault) {
    console.log("-> CBF TABLE SCRAPING");

    if (competition.type === CompetitionType.LEAGUE) {
      await this.cbfTableScraping.run(competition);
    } else {
      throw new Error("Competition does not have a table");
    }
  }

  public async runLeague(competition: ICompetitionDefault) {
    await this.cbfLeagueScraping.run(competition);
  }

  public async runElimination(competition: ICompetitionDefault) {
    await this.cbfEliminationScraping.run(competition);
  }
}
