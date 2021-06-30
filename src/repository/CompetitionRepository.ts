import CompetitionCode from '@enums/CompetitionCode';
import { Competition, ICompetition } from '@schemas/Competition';

class CompetitionRepository {
  public async all(params: any) {
    const competitions = await Competition.aggregate([
      { $match: params },
      {
        $group: {
          _id: '$code',
          name: { $first: '$name' },
          code: { $first: '$code' },
          type: { $first: '$type' },
          country: { $first: '$country' },
          federation: { $first: '$federation' },
          years: { $push: '$year' },
        },
      },
      {
        $project: {
          _id: 0,
          type: 1,
          code: 1,
          name: 1,
          country: 1,
          federation: 1,
          years: '$years',
        },
      },
    ]);

    return competitions;
  }

  public async get(competitionCode: string) {
    const competitions = await Competition.aggregate([
      { $match: { code: competitionCode } },
      {
        $group: {
          _id: '$code',
          name: { $first: '$name' },
          code: { $first: '$code' },
          type: { $first: '$type' },
          country: { $first: '$country' },
          federation: { $first: '$federation' },
          years: {
            $push: {
              year: '$year',
              rounds: { $sum: { $size: '$rounds' } },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          type: 1,
          code: 1,
          name: 1,
          country: 1,
          federation: 1,
          years: '$years',
        },
      },
    ]);

    return competitions[0];
  }

  public async getYear(competitionCode: string, year: string) {
    const competitions = await Competition.aggregate([
      { $match: { code: competitionCode, year } },
      {
        $group: {
          _id: '$code',
          name: { $first: '$name' },
          code: { $first: '$code' },
          type: { $first: '$type' },
          country: { $first: '$country' },
          federation: { $first: '$federation' },
          year: { $first: '$year' },
          rounds: { $sum: { $size: '$rounds' } },
        },
      },
      {
        $project: {
          _id: 0,
          type: 1,
          code: 1,
          name: 1,
          country: 1,
          federation: 1,
          year: 1,
          rounds: 1,
        },
      },
    ]);

    return competitions[0];
  }

  public async getBasicYear(code: CompetitionCode, year: string) {
    return Competition.findOne({ code, year });
  }

  public async save(competition: ICompetition) {
    const competitionOld = await Competition.findOne({
      code: competition.code,
      year: competition.year,
    });
    if (competitionOld) {
      const competitionAux: any = competition.toObject();
      delete competitionAux._id;

      await Competition.updateOne({ _id: competitionOld._id }, competitionAux);
    } else await competition.save();
  }
}

export default CompetitionRepository;
