import {Request, Response} from "express";
import CbfController from '../controllers/scraping/CbfController';

export class Routes { 
    public cbfController: CbfController;

    constructor() {
        this.cbfController = new CbfController;
    }
    
    public routes(app:any): void {   
        
        app.route('/')
        .get((req: Request, res: Response) => {            
            res.status(200).send({
                message: 'GET request successfulll!!!!'
            })
        })    

        app.route('/scraping/cbf').get(this.cbfController.load)

    }
}