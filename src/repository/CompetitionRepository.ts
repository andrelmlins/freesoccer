import CompetitionCode from '../enums/CompetitionCode';
import { Competition, ICompetition } from '../schemas/Competition';

export default class CompetitionRepository {
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
          //   url: { $concat: [Helpers.getUrl(req, req.url), '/', '$code'] },
          years: '$years',
        },
      },
    ]);

    return competitions;
  }

  public async get(competitionCode: String) {
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
              //   url: { $concat: [Helpers.getUrl(req, req.url), '/', '$year'] }
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
          //   url: Helpers.getUrl(req, req.url),
          years: '$years',
        },
      },
    ]);

    return competitions[0];
  }

  public async getYear(competitionCode: String, year: String) {
    const competitions = await Competition.aggregate([
      { $match: { code: competitionCode, year: year } },
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
          //   url: Helpers.getUrl(req, req.url),
          //   urls: {
          //     rounds: Helpers.getUrl(req, req.url) + '/rounds',
          //     matches: Helpers.getUrl(req, req.url) + '/matches',
          //     statistics: Helpers.getUrl(req, req.url) + '/statistics',
          //     table: Helpers.getUrl(req, req.url) + '/table'
          //   }
        },
      },
    ]);

    return competitions[0];
  }

  public async getBasicYear(code: CompetitionCode, year: string) {
    return await Competition.findOne({ code, year });
  }

  public async save(competition: ICompetition) {
    let competitionOld = await Competition.findOne({ code: competition.code, year: competition.year });
    if (competitionOld) {
      let competitionAux: any = competition.toObject();
      delete competitionAux._id;

      await Competition.updateOne({ _id: competitionOld._id }, competitionAux);
    } else await competition.save();
  }
}
