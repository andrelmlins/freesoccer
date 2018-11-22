import ICompetitionDefault from "../interfaces/ICompetitionDefault";

import { IRound, Round } from "../schemas/Round";
import { ICompetition, Competition } from "../schemas/Competition";
import { ITable, Table } from "../schemas/Table";

class Helpers {

    public static getCompetition (competitions: Array<ICompetitionDefault>, code: String) : ICompetitionDefault {
        for(let i = 0;i < competitions.length; i++){
            if(competitions[i].code==code) return competitions[i];
        }
        throw new Error("Competition does not exist");
    }

    public static async replaceRound(round:IRound): Promise<IRound | null>{
        let roundOld = await Round.findOne({"hash":round.hash});
        if(roundOld) {
            let roundAux:any = round.toObject();
            delete roundAux._id;
            
            await Round.updateOne({"_id":roundOld._id},roundAux);
            
            let roundResult = await Round.findOne({"hash":round.hash});
            return roundResult;
        } else {
            let roundResult = await Round.create(round);
            return roundResult;
        }
    }

    public static async replaceCompetition(competition:ICompetition){
        let competitionOld = await Competition.findOne({"code":competition.code,"year":competition.year});
        if(competitionOld) {
            let competitionAux:any = competition.toObject();
            delete competitionAux._id;
            
            await Competition.updateOne({"_id":competitionOld._id},competitionAux);
        }
        else await competition.save();
    }

    public static async replaceTable(table:ITable){
        let tableOld = await Table.findOne({"competition":table.competition});

        if(tableOld) {
            let tableAux:any = table.toObject();
            delete tableAux._id;
            
            await Table.updateOne({"competition":table.competition},tableAux);
        }
        else await table.save();
    }
}

export default Helpers;