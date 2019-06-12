import { Response, Request } from 'express';

import FffConstants from '../../constants/FffConstants';
import FffScraping from '../../scraping/FffScraping';
import CompetitionUtil from '../../utils/CompetitionUtil';
import ICompetitionDefault from '../../interfaces/ICompetitionDefault';

export default class FffController {
  public async loadResults(req: Request, res: Response) {
    try {
      let competition: ICompetitionDefault = CompetitionUtil.getCompetition(FffConstants.COMPETITIONS, req.params.competition);

      let fffScraping: FffScraping = new FffScraping();
      await fffScraping.run(competition);

      res.send({ message: 'Success' });
    } catch (error) {
      res.status(404).send({ error: error + '' });
    }
  }

  public async loadTable(req: Request, res: Response) {
    try {
      let competition: ICompetitionDefault = CompetitionUtil.getCompetition(FffConstants.COMPETITIONS, req.params.competition);

      let fffScraping: FffScraping = new FffScraping();
      await fffScraping.runTable(competition);

      res.send({ message: 'Success' });
    } catch (error) {
      res.status(404).send({ error: error + '' });
    }
  }
}
