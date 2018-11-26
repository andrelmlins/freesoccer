import { Response, Request } from "express";

import { Competition } from "../schemas/Competition";
import Helpers from "../utils/Helpers";

export default class CompetitionController {
    public async all(req: Request, res: Response) {
        try {
            let competitions = await Competition.aggregate([
                {
                    $match: req.query,
                },
                {
                    $group: { 
                        _id:"$code",
                        name: {$first: "$name"},
                        code: {$first: "$code"},
                        type: {$first: "$type"},
                        country: {$first: "$country"},
                        federation: {$first: "$federation"},
                        years: {$push: "$year"}
                    },
                },
                { 
                    $project : {
                        _id : 0,
                        type: 1,
                        code: 1,
                        name: 1,
                        country: 1,
                        federation: 1,
                        url:{$concat:[Helpers.getUrl(req, req.url),"/","$code"]},
                        years : "$years",
                    }
                }
            ]);
            
            res.send({competitions:competitions});
        } catch (error) {
            res.status(404).send({error:true});
        }
    }

    public async get(req: Request, res: Response) {
        try {
            let competitions = await Competition.aggregate([
                {
                    $match: {"code":req.params.competition},
                },
                {
                    $group: { 
                        _id: "$code",
                        name: {$first: "$name"},
                        code: {$first: "$code"},
                        type: {$first: "$type"},
                        country: {$first: "$country"},
                        federation: {$first: "$federation"},
                        years:  {
                            $push: {
                                year: "$year",
                                rounds: {$sum: { $size: "$rounds" } },
                                url:{$concat:[Helpers.getUrl(req, req.url),"/","$year"]}
                            }
                        }
                    },
                },
                { 
                    $project : {
                        _id : 0,
                        type: 1,
                        code: 1,
                        name: 1,
                        country: 1,
                        federation: 1,
                        url: Helpers.getUrl(req, req.url),
                        years : "$years"
                    }
                }
            ]);

            res.send({ competition: competitions[0] });
        } catch (error) {
            res.status(404).send({error:true});
        }
    }

    public async getYear(req: Request, res: Response) {
        try {
            let competitions = await Competition.aggregate([
                {
                    $match: {"code":req.params.competition,"year":req.params.year},
                },
                {
                    $group: { 
                        _id: "$code",
                        name: {$first: "$name"},
                        code: {$first: "$code"},
                        type: {$first: "$type"},
                        country: {$first: "$country"},
                        federation: {$first: "$federation"},
                        year: {$first: "$year"},
                        rounds: {$sum: { $size: "$rounds" } }
                    },
                },
                { 
                    $project : {
                        _id : 0,
                        type: 1,
                        code: 1,
                        name: 1,
                        country: 1,
                        federation: 1,
                        year : 1,
                        rounds : 1,
                        url: Helpers.getUrl(req, req.url),
                        urls: {
                            rounds: Helpers.getUrl(req, req.url)+"/rounds",
                            matches: Helpers.getUrl(req, req.url)+"/matches",
                            statistics: Helpers.getUrl(req, req.url)+"/statistics",
                            table: Helpers.getUrl(req, req.url)+"/table"
                        }
                    }
                }
            ]);

            res.send({ competition: competitions[0] });
        } catch (error) {
            res.status(404).send({error:true});
        }
    }
}