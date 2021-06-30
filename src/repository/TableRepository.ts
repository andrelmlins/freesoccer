import CompetitionCode from '@enums/CompetitionCode';
import { Competition } from '@schemas/Competition';
import { Table, ITable } from '@schemas/Table';

class TableRepository {
  public async get(code: CompetitionCode, year: string) {
    const competition = await Competition.findOne({ code, year });

    if (!competition) {
      throw new Error('Competition does not exist');
    }

    const table = await Table.aggregate([
      { $match: { competition: competition._id } },
      {
        $project: {
          _id: 0,
          //   url: { $concat: [Helpers.getUrl(req, req.url)] },
          positions: '$itens',
        },
      },
    ]);

    return table[0];
  }

  public async getPosition(code: CompetitionCode, year: string, position: number) {
    const competition = await Competition.findOne({ code, year });

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
          redCard: '$itens.redCard',
        },
      },
      { $match: { position } },
    ]);

    return table[0];
  }

  public async save(table: ITable) {
    const tableOld = await Table.findOne({ competition: table.competition });

    if (tableOld) {
      const tableAux: any = table.toObject();
      delete tableAux._id;

      await Table.updateOne({ competition: table.competition }, tableAux);
    } else await table.save();
  }
}

export default TableRepository;
