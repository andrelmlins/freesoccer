import { Response, Request } from "express";

import FigcConstants from "../../constants/FigcConstants";
import FigcScraping from "../../scraping/federations/FigcScraping";
import Helpers from "../../utils/Helpers";
import ICompetitionDefault from "../../interfaces/ICompetitionDefault";

export default class FigcController {

    public async loadResults (req: Request, res: Response) {
        try {
            let competition: ICompetitionDefault = Helpers.getCompetition(FigcConstants.COMPETITIONS,req.params.competition);

            let figcScraping: FigcScraping = new FigcScraping;
            await figcScraping.run(competition);

            res.send({message:"Success"});
        } catch (error) {
            console.log(error);
            res.status(404).send({error:error+""});
        }
    }

    public async loadTable (req: Request, res: Response) {
        try {
            let competition: ICompetitionDefault = Helpers.getCompetition(FigcConstants.COMPETITIONS,req.params.competition);

            let figcScraping: FigcScraping = new FigcScraping;
            await figcScraping.runTable(competition);

            res.send({message:"Success"});
        } catch (error) {
            console.log(error);
            res.status(404).send({error:error+""});
        }
    }
}