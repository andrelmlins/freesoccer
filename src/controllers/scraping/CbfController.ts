import { Response, Request } from "express";

import CbfConstants from "../../constants/CbfConstants";
import CbfScraping from "../../scraping/federations/CbfScraping";
import CompetitionUtil from "../../utils/CompetitionUtil";
import ICompetitionDefault from "../../interfaces/ICompetitionDefault";

export default class CbfController {
  public async loadResults(req: Request, res: Response) {
    try {
      let competition: ICompetitionDefault = CompetitionUtil.getCompetition(CbfConstants.COMPETITIONS, req.params.competition);

      let cbfScraping: CbfScraping = new CbfScraping();
      await cbfScraping.run(competition);

      res.send({ message: "Success" });
    } catch (error) {
      console.log(error);
      res.status(404).send({ error: error + "" });
    }
  }

  public async loadTable(req: Request, res: Response) {
    try {
      let competition: ICompetitionDefault = CompetitionUtil.getCompetition(CbfConstants.COMPETITIONS, req.params.competition);

      let cbfScraping: CbfScraping = new CbfScraping();
      await cbfScraping.runTable(competition);

      res.send({ message: "Success" });
    } catch (error) {
      res.status(404).send({ error: error + "" });
    }
  }
}
