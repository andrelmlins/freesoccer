import RfefScraping from "../../scraping/RfefScraping";
import { Response, Request } from "express";

class RfefController {

    public async load (req: Request, res: Response) {
        try {
            let rfefScraping: RfefScraping = new RfefScraping;
            let result = await rfefScraping.run();

            res.send(result);
        } catch (error) {
            res.status(500).send({error:error+""});
        }
    }

}

export default RfefController;