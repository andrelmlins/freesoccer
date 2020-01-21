import { Competition } from '../schemas/Competition';
import { Table } from '../schemas/Table';

export default class TableRepository {
  public async get(competitionCode: String, year: String) {
    const competition = await Competition.findOne({ code: competitionCode, year });

    if (!competition) {
      throw new Error('Competition does not exist');
    }

    const table = await Table.aggregate([
      { $match: { competition: competition._id } },
      {
        $project: {
          _id: 0,
          //   url: { $concat: [Helpers.getUrl(req, req.url)] },
          positions: '$itens'
        }
      }
    ]);

    return table[0];
  }

  public async getPosition(competitionCode: String, year: String, position: Number) {
    const competition = await Competition.findOne({ code: competitionCode, year });

    if (!competition) {
      throw new Error('Competition does not exist');
    }

    const table = await Table.aggregate([
      { $match: { competition: competition._id } },
      { $unwind: '$itens' },
      {
        $project: {
          _id: 0,
          //   url: { $concat: [Helpers.getUrl(req, req.url)] },
          position: '$itens.position',
          name: '$itens.name',
          flag: '$itens.flag',
          points: '$itens.points',
          matches: '$itens.matches',
          win: '$itens.win',
          draw: '$itens.draw',
          lose: '$itens.lose',
          goalsScored: '$itens.goalsScored',
          goalsAgainst: '$itens.goalsAgainst',
          goalsDifference: '$itens.goalsDifference',
          yellowCard: '$itens.yellowCard',
          redCard: '$itens.redCard'
        }
      },
      { $match: { position } }
    ]);

    return table[0];
  }
}
