import { Response, Request } from 'express';

class Controller {
  public async getSwagger(_: Request, res: Response) {
    try {
      res.send(require('../../public/assets/swagger.json'));
    } catch (error) {
      res.status(404).send({ error: true });
    }
  }
}

export default Controller;
