import { Round } from '../schemas/Round';
import CompetitionRepository from './CompetitionRepository';

export default class RoundRepository {
  private competitioRepository: CompetitionRepository;

  constructor() {
    this.competitioRepository = new CompetitionRepository();
  }

  public async all(competitionCode: String, year: String) {
    let rounds = [];
    const competition = await this.competitioRepository.getBasicYear(competitionCode, year);

    if (competition == null) {
      throw new Error('Competition does not exist');
    } else {
      rounds = await Round.aggregate([
        {
          $match: { competition: competition._id }
        },
        {
          $project: {
            _id: 0,
            number: 1,
            goals: 1,
            goalsHome: 1,
            goalsGuest: 1,
            hash: 1,
            //   url: { $concat: [Helpers.getUrl(req, '/api/rounds'), '/', '$hash'] },
            matches: { $size: '$matchs' }
          }
        }
      ]);
    }

    return rounds;
  }

  public async get(roundCode: String) {
    const rounds = await Round.aggregate([
      {
        $match: { hash: roundCode }
      },
      {
        $project: {
          _id: 0,
          number: 1,
          goals: 1,
          goalsHome: 1,
          goalsGuest: 1,
          hash: 1,
          matches: { $size: '$matchs' }
          //   url: { $concat: [Helpers.getUrl(req, req.url), '/', '$hash'] },
          //   urls: {
          //     matches: Helpers.getUrl(req, req.url) + '/matches',
          //     statistics: Helpers.getUrl(req, req.url) + '/statistics'
          //   }
        }
      }
    ]);

    return rounds[0];
  }
}
