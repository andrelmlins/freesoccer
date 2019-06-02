import { Response, Request } from "express";

import RfefConstants from "../../constants/RfefConstants";
import RfefScraping from "../../scraping/federations/RfefScraping";
import CompetitionUtil from "../../utils/CompetitionUtil";
import ICompetitionDefault from "../../interfaces/ICompetitionDefault";

export default class RfefController {
  public async loadResults(req: Request, res: Response) {
    try {
      let competition: ICompetitionDefault = CompetitionUtil.getCompetition(RfefConstants.COMPETITIONS, req.params.competition);

      let rfefScraping: RfefScraping = new RfefScraping();
      await rfefScraping.run(competition);

      res.send({ message: "Success" });
    } catch (error) {
      res.status(404).send({ error: error + "" });
    }
  }

  public async loadTable(req: Request, res: Response) {
    try {
      let competition: ICompetitionDefault = CompetitionUtil.getCompetition(RfefConstants.COMPETITIONS, req.params.competition);

      let fpfScraping: RfefScraping = new RfefScraping();
      await fpfScraping.runTable(competition);

      res.send({ message: "Success" });
    } catch (error) {
      //console.log(error);
      res.status(404).send({ error: error + "" });
    }
  }
}
