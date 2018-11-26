import { Response, Request } from "express";

import { Competition } from "../schemas/Competition";
import Helpers from "../utils/Helpers";
import { Round } from "../schemas/Round";

export default class RoundController {
    public async all(req: Request, res: Response) {
        try {
            let competition = await Competition.findOne({"code":req.params.competition,"year":req.params.year});

            if (competition==null) {
                throw new Error("Competition does not exist")
            } else {
                let rounds = await Round.aggregate([
                    {
                        $match: req.query,
                    },
                    { 
                        $project : {
                            _id : 0,
                            number: 1,
                            goals: 1,
                            goalsHome: 1,
                            goalsGuest: 1,
                            url: {$concat:[Helpers.getUrl(req, req.url),"/","$number"]},
                            matches: { $size: "$matchs" }
                        }
                    }
                ])

                res.send({ rounds });
            }
        } catch (error) {
            console.log(error);
            res.status(404).send({error:true});
        }
    }
}