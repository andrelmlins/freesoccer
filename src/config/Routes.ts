import {Request, Response} from "express";
import CbfController from '../controllers/scraping/CbfController';
import RfefController from "../controllers/scraping/RfefController";
import FffController from "../controllers/scraping/FffController";
import FigcController from "../controllers/scraping/FigcController";
import DfbController from "../controllers/scraping/DfbController";
import FpfController from "../controllers/scraping/FpfController";

export class Routes { 
    public cbfController: CbfController;
    public rfefController: RfefController;
    public fffController: FffController;
    public figcController: FigcController;
    public dfbController: DfbController;
    public fpfController: FpfController;

    constructor() {
        this.cbfController = new CbfController;
        this.rfefController = new RfefController;
        this.fffController = new FffController;
        this.figcController = new FigcController;
        this.dfbController = new DfbController;
        this.fpfController = new FpfController;
    }
    
    public routes(app:any): void {   
        
        app.route('/')
        .get((req: Request, res: Response) => {            
            res.status(200).send({
                message: 'GET request successfulll!!!!'
            })
        })    

        app.route('/scraping/cbf/:competition/results').get(this.cbfController.loadResults);
        app.route('/scraping/cbf/:competition/table').get(this.cbfController.loadTable);

        app.route('/scraping/fff/:competition/results').get(this.fffController.loadResults);
        app.route('/scraping/fff/:competition/table').get(this.fffController.loadTable);

        app.route('/scraping/rfef/:competition').get(this.rfefController.load);
        app.route('/scraping/figc/:competition').get(this.figcController.load);
        app.route('/scraping/dfb/:competition').get(this.dfbController.load);

        app.route('/scraping/fpf/:competition/results').get(this.fpfController.loadResults);
        app.route('/scraping/fpf/:competition/table').get(this.fpfController.loadTable);
    }
}