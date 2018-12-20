import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import * as morgan from "morgan";
import * as cors from "cors";
import * as path from "path";

import { Routes } from "./Routes";
import CronJobs from "./CronJobs";

class App {
  public app: express.Application;
  public routes: Routes;
  public cronJobs: CronJobs;

  constructor() {
    this.routes = new Routes();
    this.cronJobs = new CronJobs();

    this.app = express();
    this.config();

    this.app.use(express.static(path.join(__dirname + "../../../public")));

    this.routes.routes(this.app);
    this.cronJobs.crons();
  }

  private config(): void {
    mongoose.connect("mongodb://localhost/freesoccer");

    this.app.use(bodyParser.json({ limit: "50mb" }));
    this.app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
    this.app.use(cors());
    this.app.use(morgan("dev"));
  }
}

export default new App().app;
