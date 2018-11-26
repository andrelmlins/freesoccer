import { Response, Request } from "express";

import { Competition } from "../schemas/Competition";
import { Table } from "../schemas/Table";
import Helpers from "../utils/Helpers";

export default class TableController {
    public async get(req: Request, res: Response) {
        try {
            let competition = await Competition.findOne({"code":req.params.competition,"year":req.params.year});

            if (competition==null) {
                throw new Error("Competition does not exist")
            } else {
                let table = await Table.aggregate([
                    {
                        $match: {"competition":competition._id},
                    },
                    { 
                        $project : {
                            _id : 0,
                            url: {$concat:[Helpers.getUrl(req, req.url)]},
                            list: "$itens"
                        }
                    }
                ])

                res.send({ table:table[0] });
            }
        } catch (error) {
            console.log(error);
            res.status(404).send({error:true});
        }
    }
}