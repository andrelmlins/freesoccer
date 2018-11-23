import { Response, Request } from "express";

import { Competition } from "../schemas/Competition";

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
                        id: {$first: "$code"},
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
                        id: 1,
                        name: 1,
                        country: 1,
                        federation: 1,
                        years : 1,
                    }
                }
            ]);
            
            res.send({competitions:competitions});
        } catch (error) {
            console.log(error);
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
                        _id:"$code",
                        name: {$first: "$name"},
                        id: {$first: "$code"},
                        type: {$first: "$type"},
                        country: {$first: "$country"},
                        federation: {$first: "$federation"},
                        years: {
                            year: {$push: "$year"},
                            rounds: {$sum: "$rounds"}
                        }
                    },
                },
                { 
                    $project : {
                        _id : 0,
                        type: 1,
                        id: 1,
                        name: 1,
                        country: 1,
                        federation: 1,
                        years : 1,
                    }
                }
            ]);
            
            res.send({competition:competitions[0]});
        } catch (error) {
            console.log(error);
            res.status(404).send({error:true});
        }
    }
}