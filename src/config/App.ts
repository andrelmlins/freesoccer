import * as express from "express";
import * as bodyParser from "body-parser";
import { Routes } from "./Routes";
import * as mongoose from 'mongoose';
import * as morgan from 'morgan';
import * as cors from 'cors';

class App {

    public app: express.Application;
    public routes: Routes;

    constructor() {
        this.routes = new Routes;
        this.app = express();
        this.config();        
        this.routes.routes(this.app);
    }

    private config(): void{
        mongoose.connect('mongodb://localhost/maisfutebol', { useNewUrlParser: true });

        this.app.use(bodyParser.json({ limit: '50mb' }));
        this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
        this.app.use(cors());
        this.app.use(morgan('dev'));
    }

}

export default new App().app;