import { Response, Request } from 'express';
import TableRepository from '../repository/TableRepository';

import { Competition } from '../schemas/Competition';
import { Table } from '../schemas/Table';
import Helpers from '../utils/Helpers';

export default class TableController {
  private tableRepository: TableRepository;

  constructor() {
    this.tableRepository = new TableRepository();
  }

  public async get(req: Request, res: Response) {
    try {
      res.send({ table: await this.tableRepository.get(req.params.competition, req.params.year) });
    } catch (error) {
      res.status(404).send({ error: true });
    }
  }

  public async getPosition(req: Request, res: Response) {
    try {
      res.send({ positionTable: await this.tableRepository.getPosition(req.params.competition, req.params.year, parseInt(req.params.position)) });
    } catch (error) {
      res.status(404).send({ error: true });
    }
  }
}
