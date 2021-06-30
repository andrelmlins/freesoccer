import CompetitionCode from '@enums/CompetitionCode';
import { Round, IRound } from '@schemas/Round';
import CompetitionRepository from './CompetitionRepository';

class RoundRepository {
  private competitioRepository: CompetitionRepository;

  constructor() {
    this.competitioRepository = new CompetitionRepository();
  }

  public async all(code: CompetitionCode, year: string) {
    let rounds = [];
    const competition = await this.competitioRepository.getBasicYear(code, year);

    if (!competition) {
      throw new Error('Competition does not exist');
    } else {
      rounds = await Round.aggregate([
        { $match: { competition: competition._id } },
        {
          $project: {
            _id: 0,
            number: 1,
            goals: 1,
            goalsHome: 1,
            goalsGuest: 1,
            hash: 1,
            //   url: { $concat: [Helpers.getUrl(req, '/api/rounds'), '/', '$hash'] },
            matches: { $size: '$matchs' },
          },
        },
      ]);
    }

    return rounds;
  }

  public async get(roundCode: string) {
    const rounds = await Round.aggregate([
      { $match: { hash: roundCode } },
      {
        $project: {
          _id: 0,
          number: 1,
          goals: 1,
          goalsHome: 1,
          goalsGuest: 1,
          hash: 1,
          matches: { $size: '$matchs' },
          //   url: { $concat: [Helpers.getUrl(req, req.url), '/', '$hash'] },
          //   urls: {
          //     matches: Helpers.getUrl(req, req.url) + '/matches',
          //     statistics: Helpers.getUrl(req, req.url) + '/statistics'
          //   }
        },
      },
    ]);

    return rounds[0];
  }

  public async save(round: IRound): Promise<IRound | null> {
    const roundOld = await Round.findOne({ hash: round.hash });
    if (roundOld) {
      const roundAux: any = round.toObject();
      delete roundAux._id;

      await Round.updateOne({ _id: roundOld._id }, roundAux);

      const roundResult = await Round.findOne({ hash: round.hash });
      return roundResult;
    }
    const roundResult = await Round.create(round);
    return roundResult;
  }
}

export default RoundRepository;
