import { Response, Request } from "express";

import RfefConstants from "../../constants/RfefConstants";
import RfefScraping from "../../scraping/federations/RfefScraping";
import Helpers from "../../utils/Helpers";
import ICompetitionDefault from "../../interfaces/ICompetitionDefault";

export default class RfefController {

    public async load (req: Request, res: Response) {
        try {
            let competition: ICompetitionDefault = Helpers.getCompetition(RfefConstants.COMPETITIONS,req.params.competition);
            
            let rfefScraping: RfefScraping = new RfefScraping;
            await rfefScraping.run(competition);

            res.send({message:"Success"});
        } catch (error) {
            res.status(404).send({error:error+""});
        }
    }
}