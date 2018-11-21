import FffScraping from "../../scraping/FffScraping";
import { Response, Request } from "express";

class FffController {

    public async load (req: Request, res: Response) {
        try {
            let fffScraping: FffScraping = new FffScraping;
            await fffScraping.run();

            res.send({message:"Success"});
        } catch (error) {

            console.log(error);
            res.status(500).send({error:error+""});
        }
    }

}

export default FffController;