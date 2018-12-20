import { Response, Request } from "express";
import * as jwt from "jsonwebtoken";

var swaggerDocument = require("../../public/assets/swagger.json");

export default class Controller {
  public async getSwagger(req: Request, res: Response) {
    try {
      res.send(swaggerDocument);
    } catch (error) {
      res.status(404).send({ error: true });
    }
  }

  public async validateToken(req: Request, res: Response, next: any) {
    var token = req.body.token || req.query.token || req.headers["x-access-token"];

    if (token) {
      try {
        jwt.verify(token, "shhhhh");
        next();
      } catch (err) {
        return res.status(403).send({ success: false, message: "No access" });
      }
    } else {
      return res.status(403).send({ success: false, message: "No access" });
    }
  }
}
