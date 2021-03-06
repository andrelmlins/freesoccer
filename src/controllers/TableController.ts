import { Response, Request } from 'express';
import CompetitionCode from '@enums/CompetitionCode';
import TableRepository from '@repository/TableRepository';

class TableController {
  private tableRepository: TableRepository;

  constructor() {
    this.tableRepository = new TableRepository();
  }

  public async get(req: Request, res: Response) {
    try {
      res.send({
        table: await this.tableRepository.get(req.params.competition as CompetitionCode, req.params.year),
      });
    } catch (error) {
      res.status(404).send({ error: true });
    }
  }

  public async getPosition(req: Request, res: Response) {
    try {
      res.send({ positionTable: await this.tableRepository.getPosition(req.params.competition as CompetitionCode, req.params.year, Number(req.params.position)) });
    } catch (error) {
      res.status(404).send({ error: true });
    }
  }
}

export default TableController;
