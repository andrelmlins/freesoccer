import { Response, Request } from "express";

import FaConstants from "../../constants/FaConstants";
import FaScraping from "../../scraping/federations/FaScraping";
import Helpers from "../../utils/Helpers";
import ICompetitionDefault from "../../interfaces/ICompetitionDefault";

export default class FaController {
  public async loadResults(req: Request, res: Response) {
    try {
      let competition: ICompetitionDefault = Helpers.getCompetition(FaConstants.COMPETITIONS, req.params.competition);

      let faScraping: FaScraping = new FaScraping();
      await faScraping.run(competition);

      res.send({ message: "Success" });
    } catch (error) {
      console.log(error);
      res.status(404).send({ error: error + "" });
    }
  }

  public async loadTable(req: Request, res: Response) {
    try {
      let competition: ICompetitionDefault = Helpers.getCompetition(FaConstants.COMPETITIONS, req.params.competition);

      let faScraping: FaScraping = new FaScraping();
      await faScraping.runTable(competition);

      res.send({ message: "Success" });
    } catch (error) {
      console.log(error);
      res.status(404).send({ error: error + "" });
    }
  }
}
