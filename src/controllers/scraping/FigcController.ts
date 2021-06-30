import { Response, Request } from 'express';

import FigcConstants from '@constants/FigcConstants';
import FigcScraping from '@scraping/FigcScraping';
import CompetitionUtil from '@utils/CompetitionUtil';
import ICompetitionDefault from '@interfaces/ICompetitionDefault';

class FigcController {
  public async loadResults(req: Request, res: Response) {
    try {
      let competition: ICompetitionDefault = CompetitionUtil.getCompetition(FigcConstants.COMPETITIONS, req.params.competition);

      let figcScraping: FigcScraping = new FigcScraping();
      await figcScraping.run(competition);

      res.send({ message: 'Success' });
    } catch (error) {
      console.log(error);
      res.status(404).send({ error: error + '' });
    }
  }

  public async loadTable(req: Request, res: Response) {
    try {
      let competition: ICompetitionDefault = CompetitionUtil.getCompetition(FigcConstants.COMPETITIONS, req.params.competition);

      let figcScraping: FigcScraping = new FigcScraping();
      await figcScraping.runTable(competition);

      res.send({ message: 'Success' });
    } catch (error) {
      console.log(error);
      res.status(404).send({ error: error + '' });
    }
  }
}

export default FigcController;
