import * as md5 from 'md5';

import MatchScraping from './MatchScraping';

import { Round, IRound } from '../schemas/Round';
import { ICompetition } from '../schemas/Competition';

class RoundScraping {
    private matchScraping: MatchScraping;

    constructor() {
        this.matchScraping = new MatchScraping;
    }

    public async runCbf(roundHtml:any,competition:ICompetition): Promise<IRound> {
        let round = new Round;
        round.goals = 0;
        round.goalsHome = 0;
        round.goalsGuest = 0;
        round.number =  roundHtml.children('header').children('h3').text().replace('Rodada ','');
        round.matchs = [];
        round.competition = competition._id;
        round.hash = md5(competition.code+competition.year+round.number);

        console.log("\t\t\t-> Round "+round.number);

        competition.rounds.push(round._id);

        let matchsHtml = roundHtml.find(".list-unstyled").children();
        
        for(let i = 0; i < matchsHtml.length; i++){
            let matchResult = await this.matchScraping.runCbf(matchsHtml.eq(i));

            if(matchResult.teamGuest.goals && matchResult.teamHome.goals) {
                round.goals += (matchResult.teamGuest.goals + matchResult.teamHome.goals);
                round.goalsGuest += matchResult.teamGuest.goals;
                round.goalsHome += matchResult.teamHome.goals;
            }

            round.matchs.push(matchResult)
        }

        let roundOld = await Round.findOne({"hash":round.hash});
        if(roundOld) {
            let roundAux:any = round.toObject();
            delete roundAux._id;
            
            await Round.updateOne({"_id":roundOld._id},roundAux);
        }
        else await Round.create(round);

        return round;
    }
}

export default RoundScraping;