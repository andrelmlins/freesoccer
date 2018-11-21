import { Response, Request } from "express";

import FffConstants from "../../constants/FffConstants";
import FffScraping from "../../scraping/federations/FffScraping";
import Helpers from "../../utils/Helpers";
import ICompetitionDefault from "../../interfaces/ICompetitionDefault";

export default class FffController {

    public async load (req: Request, res: Response) {
        try {
            let competition: ICompetitionDefault = Helpers.getCompetition(FffConstants.COMPETITIONS,req.params.competition);

            let fffScraping: FffScraping = new FffScraping;
            await fffScraping.run(competition);

            res.send({message:"Success"});
        } catch (error) {
            res.status(404).send({error:error+""});
        }
    }
}