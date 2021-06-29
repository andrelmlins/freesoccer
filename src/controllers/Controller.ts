import { Response, Request } from 'express';

export default class Controller {
  public async getSwagger(_: Request, res: Response) {
    try {
      res.send(require('../../public/assets/swagger.json'));
    } catch (error) {
      res.status(404).send({ error: true });
    }
  }
}
