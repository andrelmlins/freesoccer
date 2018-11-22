import {Request, Response} from "express";
import CbfController from '../controllers/scraping/CbfController';
import RfefController from "../controllers/scraping/RfefController";
import FffController from "../controllers/scraping/FffController";
import FigcController from "../controllers/scraping/FigcController";
import DfbController from "../controllers/scraping/DfbController";

export class Routes { 
    public cbfController: CbfController;
    public rfefController: RfefController;
    public fffController: FffController;
    public figcController: FigcController;
    public dfbController: DfbController;

    constructor() {
        this.cbfController = new CbfController;
        this.rfefController = new RfefController;
        this.fffController = new FffController;
        this.figcController = new FigcController;
        this.dfbController = new DfbController;
    }
    
    public routes(app:any): void {   
        
        app.route('/')
        .get((req: Request, res: Response) => {            
            res.status(200).send({
                message: 'GET request successfulll!!!!'
            })
        })    

        app.route('/scraping/cbf/:competition').get(this.cbfController.load);
        app.route('/scraping/rfef/:competition').get(this.rfefController.load);
        app.route('/scraping/fff/:competition').get(this.fffController.load);
        app.route('/scraping/figc/:competition').get(this.figcController.load);
        app.route('/scraping/dfb/:competition').get(this.dfbController.load);
    }
}