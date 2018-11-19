import CbfScraping from "../../scraping/CbfScraping";
import { Response, Request } from "express";

class CbfController {

    public async load (req: Request, res: Response) {
        try {
            let cbfScraping: CbfScraping = new CbfScraping;
            await cbfScraping.run();

            res.send({message:"Success"});
        } catch (error) {
            res.status(500).send({error:error+""});
        }
    }

}

export default CbfController;