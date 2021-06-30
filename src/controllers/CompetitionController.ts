import { Response, Request } from 'express';
import CompetitionRepository from '@repository/CompetitionRepository';

class CompetitionController {
  private competitionRepository: CompetitionRepository;

  constructor() {
    this.competitionRepository = new CompetitionRepository();
  }

  public async all(req: Request, res: Response) {
    try {
      res.send({ competitions: await this.competitionRepository.all(req.query) });
    } catch (error) {
      res.status(404).send({ error: true });
    }
  }

  public async get(req: Request, res: Response) {
    try {
      res.send({ competition: await this.competitionRepository.get(req.params.competition) });
    } catch (error) {
      res.status(404).send({ error: true });
    }
  }

  public async getYear(req: Request, res: Response) {
    try {
      res.send({ competition: await this.competitionRepository.getYear(req.params.competition, req.params.year) });
    } catch (error) {
      res.status(404).send({ error: true });
    }
  }
}

export default CompetitionController;
