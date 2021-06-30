import CompetitionCode from '@enums/CompetitionCode';
import { Competition } from '@schemas/Competition';
import { Round } from '@schemas/Round';

class MatchRepository {
  public async allPerRound(roundCode: string) {
    const round = await Round.findOne({ hash: roundCode });

    if (!round) {
      throw Error('Round does not exist');
    }

    const matches = round.matchs.sort((a, b) => a.date.getTime() - b.date.getTime());
    return matches;
  }

  public async allPerCompetition(code: CompetitionCode, year: string) {
    const competition = await Competition.findOne({ code, year });

    if (!competition) {
      throw new Error('Competition does not exist');
    }

    const matches = await Round.aggregate([
      { $match: { competition: competition._id } },
      { $unwind: '$matchs' },
      {
        $project: {
          _id: 0,
          round: { number: '$number', hash: '$hash' },
          date: '$matchs.date',
          stadium: '$matchs.stadium',
          location: '$matchs.location',
          teamHome: '$matchs.teamHome',
          teamGuest: '$matchs.teamGuest',
        },
      },
    ]);

    return matches;
  }
}

export default MatchRepository;
