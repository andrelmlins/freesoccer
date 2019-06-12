import { Response, Request } from 'express';

import { Competition } from '../schemas/Competition';
import { Table } from '../schemas/Table';
import Helpers from '../utils/Helpers';

export default class TableController {
  public async get(req: Request, res: Response) {
    try {
      let competition = await Competition.findOne({ code: req.params.competition, year: req.params.year });

      if (competition == null) {
        throw new Error('Competition does not exist');
      } else {
        let table = await Table.aggregate([
          {
            $match: { competition: competition._id }
          },
          {
            $project: {
              _id: 0,
              url: { $concat: [Helpers.getUrl(req, req.url)] },
              positions: '$itens'
            }
          }
        ]);

        res.send({ table: table[0] });
      }
    } catch (error) {
      res.status(404).send({ error: true });
    }
  }

  public async getPosition(req: Request, res: Response) {
    try {
      let competition = await Competition.findOne({ code: req.params.competition, year: req.params.year });

      if (competition == null) {
        throw new Error('Competition does not exist');
      } else {
        let table = await Table.aggregate([
          {
            $match: { competition: competition._id }
          },
          {
            $unwind: '$itens'
          },
          {
            $project: {
              _id: 0,
              url: { $concat: [Helpers.getUrl(req, req.url)] },
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
          {
            $match: { position: parseInt(req.params.position) }
          }
        ]);

        res.send({ positionTable: table[0] });
      }
    } catch (error) {
      res.status(404).send({ error: true });
    }
  }
}
