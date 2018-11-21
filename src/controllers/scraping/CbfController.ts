import { Response, Request } from "express";

import CbfConstants from "../../constants/CbfConstants";
import CbfScraping from "../../scraping/federations/CbfScraping";
import Helpers from "../../utils/Helpers";
import ICompetitionDefault from "../../interfaces/ICompetitionDefault";

export default class CbfController {

    public async load (req: Request, res: Response) {
        try {
            let competition: ICompetitionDefault = Helpers.getCompetition(CbfConstants.COMPETITIONS,req.params.competition);
            
            let cbfScraping: CbfScraping = new CbfScraping;
            await cbfScraping.run(competition);

            res.send({message:"Success"});
        } catch (error) {
            res.status(404).send({error:error+""});
        }
    }
}