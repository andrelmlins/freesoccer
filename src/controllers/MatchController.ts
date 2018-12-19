import { Response, Request } from "express";

import { Competition } from "../schemas/Competition";
import { Round } from "../schemas/Round";
import Helpers from "../utils/Helpers";

export default class MatchController {
  public async getRound(req: Request, res: Response) {
    try {
      let round = await Round.findOne({ hash: req.params.round });
      let matches = round!.matchs.sort((a, b) => (a.date > b.date ? 1 : b.date > a.date ? -1 : 0));

      res.send({ matches });
    } catch (error) {
      res.status(404).send({ error: true });
    }
  }

  public async getCompetition(req: Request, res: Response) {
    try {
      let competition = await Competition.findOne({ code: req.params.competition, year: req.params.year });

      if (competition == null) {
        throw new Error("Competition does not exist");
      } else {
        let matches = await Round.aggregate([
          {
            $match: { competition: competition._id }
          },
          {
            $unwind: "$matchs"
          },
          {
            $project: {
              _id: 0,
              round: {
                number: "$number",
                hash: "$hash",
                url: { $concat: [Helpers.getUrl(req, "/api/rounds"), "/", "$hash"] }
              },
              date: "$matchs.date",
              stadium: "$matchs.stadium",
              location: "$matchs.location",
              teamHome: "$matchs.teamHome",
              teamGuest: "$matchs.teamGuest"
            }
          }
        ]);

        res.send({ matches });
      }
    } catch (error) {
      res.status(404).send({ error: true });
    }
  }
}
