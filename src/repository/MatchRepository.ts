import { Competition } from '../schemas/Competition';
import { Round } from '../schemas/Round';

export default class MatchRepository {
  public async allPerRound(roundCode: String) {
    const round = await Round.findOne({ hash: roundCode });

    if (!round) {
      throw Error('Round does not exist');
    }

    const matches = round.matchs.sort((a, b) => (a.date > b.date ? 1 : b.date > a.date ? -1 : 0));
    return matches;
  }

  public async allPerCompetition(competitionCode: String, year: String) {
    const competition = await Competition.findOne({ code: competitionCode, year });

    if (!competition) {
      throw new Error('Competition does not exist');
    }

    const matches = await Round.aggregate([
      { $match: { competition: competition._id } },
      { $unwind: '$matchs' },
      {
        $project: {
          _id: 0,
          round: {
            number: '$number',
            hash: '$hash'
            //   url: { $concat: [Helpers.getUrl(req, '/api/rounds'), '/', '$hash'] }
          },
          date: '$matchs.date',
          stadium: '$matchs.stadium',
          location: '$matchs.location',
          teamHome: '$matchs.teamHome',
          teamGuest: '$matchs.teamGuest'
        }
      }
    ]);

    return matches;
  }
}
