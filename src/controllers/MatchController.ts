import { Response, Request } from 'express';
import MatchRepository from '../repository/MatchRepository';

export default class MatchController {
  private matchRepository: MatchRepository;

  constructor() {
    this.matchRepository = new MatchRepository();
  }

  public async getRound(req: Request, res: Response) {
    try {
      res.send({ matches: await this.matchRepository.allPerRound(req.params.round) });
    } catch (error) {
      res.status(404).send({ error: true });
    }
  }

  public async getCompetition(req: Request, res: Response) {
    try {
      res.send({ matches: await this.matchRepository.allPerCompetition(req.params.competition, req.params.year) });
    } catch (error) {
      res.status(404).send({ error: true });
    }
  }
}
