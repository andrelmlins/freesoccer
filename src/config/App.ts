import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import path from "path";

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
    const ipMongo = process.env.IP_MONGO || "localhost";
    const baseMongo = process.env.BASE_MONGO || "freesoccer";
    const usrMongo = process.env.USR_MONGO;
    const pswMongo = process.env.PSW_MONGO;

    if (usrMongo) {
      mongoose.connect(`mongodb://${usrMongo}:${pswMongo}@${ipMongo}/${baseMongo}`);
    } else {
      mongoose.connect(`mongodb://${ipMongo}/${baseMongo}`);
    }

    this.app.use(bodyParser.json({ limit: "50mb" }));
    this.app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
    this.app.use(cors());
    this.app.use(morgan("dev"));
  }
}

export default new App().app;
