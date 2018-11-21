import {Request, Response} from "express";
import CbfController from '../controllers/scraping/CbfController';
import RfefController from "../controllers/scraping/RfefController";
import FffController from "../controllers/scraping/FffController";

export class Routes { 
    public cbfController: CbfController;
    public rfefController: RfefController;
    public fffController: FffController;

    constructor() {
        this.cbfController = new CbfController;
        this.rfefController = new RfefController;
        this.fffController = new FffController;
    }
    
    public routes(app:any): void {   
        
        app.route('/')
        .get((req: Request, res: Response) => {            
            res.status(200).send({
                message: 'GET request successfulll!!!!'
            })
        })    

        app.route('/scraping/cbf').get(this.cbfController.load);
        app.route('/scraping/rfef').get(this.rfefController.load);
        app.route('/scraping/fff').get(this.fffController.load);
    }
}