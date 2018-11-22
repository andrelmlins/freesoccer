import { Response, Request } from "express";

import DbcConstants from "../../constants/DfbConstants";
import DfbScraping from "../../scraping/federations/DfbScraping";
import Helpers from "../../utils/Helpers";
import ICompetitionDefault from "../../interfaces/ICompetitionDefault";

export default class DfbController {

    public async load (req: Request, res: Response) {
        try {
            let competition: ICompetitionDefault = Helpers.getCompetition(DbcConstants.COMPETITIONS,req.params.competition);
            
            let dfbScraping: DfbScraping = new DfbScraping;
            await dfbScraping.run(competition);

            res.send({message:"Success"});
        } catch (error) {
            console.log(error);
            res.status(404).send({error:error+""});
        }
    }
}