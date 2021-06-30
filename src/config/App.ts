import express from 'express';
import mongoose from 'mongoose';
import { json } from 'body-parser';
import cors from 'cors';
import path from 'path';
import swaggerUI from 'swagger-ui-express';
import swagger from './swagger.json';

import { Routes } from './Routes';
import CronJobs from './CronJobs';

class App {
  public app: express.Application;
  public routes: Routes;
  public cronJobs: CronJobs;

  constructor() {
    this.routes = new Routes();
    this.cronJobs = new CronJobs();

    this.app = express();

    const swaggerOptions = {
      customSiteTitle: 'API Free Soccer',
      customCss: '.swagger-ui .topbar { display: none }',
    };
    // this.app.route('/', swaggerUI.serve, swaggerUI.setup(swagger, swaggerOptions));

    this.app.use('/', swaggerUI.serve);
    this.app.route('/').get(swaggerUI.setup(swagger, swaggerOptions));

    this.config();

    this.app.use(express.static(path.join(`${__dirname}../../../public`)));

    this.routes.routes(this.app);
    this.cronJobs.crons();
  }

  private config(): void {
    const ipMongo = process.env.IP_MONGO || 'localhost';
    const baseMongo = process.env.BASE_MONGO || 'freesoccer';
    const usrMongo = process.env.USR_MONGO;
    const pswMongo = process.env.PSW_MONGO;

    if (usrMongo) {
      mongoose.connect(`mongodb://${usrMongo}:${pswMongo}@${ipMongo}/${baseMongo}`, { useUnifiedTopology: true, useNewUrlParser: true });
    } else {
      mongoose.connect(`mongodb://${ipMongo}/${baseMongo}`, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
    }

    this.app.use(json({ limit: '50mb' }));
    this.app.use(cors());
  }
}

export default App;
