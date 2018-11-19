import * as request from 'request-promise-any';
import * as cheerio from 'cheerio';

import CbfConstants from '../constants/CbfConstants';
import { Competition } from '../schemas/Competition';
import RoundScraping from './RoundScraping';

class CompetitionScraping {
    private roundScraping: RoundScraping;

    constructor() {
        this.roundScraping = new RoundScraping;
    }

    public async runCbf(competitionDefault:any) {
        console.log("\t-> "+competitionDefault.name);

        for(let i = 0 ; i < competitionDefault.years.length; i++) {
            console.log("\t\t-> "+competitionDefault.years[i]);

            let competition = new Competition;
            competition.name = competitionDefault.name;
            competition.code = competitionDefault.code;
            competition.type = competitionDefault.type;
            competition.year = competitionDefault.years[i];
            competition.rounds = [];

            let page = await request(CbfConstants.URL_DEFAULT+"/"+competition.code+"/"+competition.year);
            
            let $ = cheerio.load(page);

            let section = $(".container section");
            let rounds = section.children().eq(1).children('aside').children('div').children();

            for(let j = 0; j < rounds.length; j++){
                let roundResult = await this.roundScraping.runCbf(rounds.eq(j),competition);
                competition.rounds.push(roundResult._id);
            }
                
            let competitionOld = await Competition.findOne({"code":competition.code,"year":competition.year});
            if(competitionOld) {
                let competitionAux:any = competition.toObject();
                delete competitionAux._id;
                
                await Competition.updateOne({"_id":competitionOld._id},competitionAux);
            }
            else await competition.save();
        }
    }
}

export default CompetitionScraping;