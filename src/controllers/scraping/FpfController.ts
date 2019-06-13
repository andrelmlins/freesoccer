import { Response, Request } from 'express';

import FpfConstants from '../../constants/FpfConstants';
import FpfScraping from '../../scraping/FpfScraping';
import CompetitionUtil from '../../utils/CompetitionUtil';
import ICompetitionDefault from '../../interfaces/ICompetitionDefault';

export default class FpfController {
  public async loadResults(req: Request, res: Response) {
    try {
      let competition: ICompetitionDefault = CompetitionUtil.getCompetition(FpfConstants.COMPETITIONS, req.params.competition);

      let fpfScraping: FpfScraping = new FpfScraping();
      await fpfScraping.run(competition);

      res.send({ message: 'Success' });
    } catch (error) {
      console.log(error);
      res.status(404).send({ error: error + '' });
    }
  }

  public async loadTable(req: Request, res: Response) {
    try {
      let competition: ICompetitionDefault = CompetitionUtil.getCompetition(FpfConstants.COMPETITIONS, req.params.competition);

      let fpfScraping: FpfScraping = new FpfScraping();
      await fpfScraping.runTable(competition);

      res.send({ message: 'Success' });
    } catch (error) {
      res.status(404).send({ error: error + '' });
    }
  }
}
