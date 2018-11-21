import * as request from 'request-promise-any';
import * as cheerio from 'cheerio';

import CbfConstants from '../constants/CbfConstants';
import RfefConstants from '../constants/RfefConstants';
import FffConstants from '../constants/FffConstants';

import { Competition, ICompetition } from '../schemas/Competition';
import RoundScraping from './RoundScraping';

class CompetitionScraping {
    private roundScraping: RoundScraping;

    constructor() {
        this.roundScraping = new RoundScraping;
    }

    public async replaceCompetition(competition:ICompetition){
        let competitionOld = await Competition.findOne({"code":competition.code,"year":competition.year});
        if(competitionOld) {
            let competitionAux:any = competition.toObject();
            delete competitionAux._id;
            
            await Competition.updateOne({"_id":competitionOld._id},competitionAux);
        }
        else await competition.save();
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
            competition.country = CbfConstants.COUNTRY;
            competition.rounds = [];

            let page = await request(CbfConstants.URL_DEFAULT+"/"+competition.code+"/"+competition.year);
            
            let $ = cheerio.load(page);

            let section = $(".container section");
            let rounds = section.children().eq(1).children('aside').children('div').children();

            for(let j = 0; j < rounds.length; j++){
                let roundResult = await this.roundScraping.runCbf(rounds.eq(j),competition);
                competition.rounds.push(roundResult._id);
            }

            await this.replaceCompetition(competition);
        }
    }

    public async runRfef(competitionDefault:any) {
        console.log("\t-> "+competitionDefault.name);

        for(let i = 0 ; i < competitionDefault.years.length; i++) {
            console.log("\t\t-> "+competitionDefault.years[i]);

            let competition = new Competition;
            competition.name = competitionDefault.name;
            competition.code = competitionDefault.code;
            competition.type = competitionDefault.type;
            competition.year = competitionDefault.years[i];
            competition.country = RfefConstants.COUNTRY;
            competition.rounds = [];

            let page = await request(RfefConstants.URL_DEFAULT+competitionDefault.url+"/resultados?t="+competition.year);

            let $ = cheerio.load(page);
            let data = $(".postcontent").find(".content").children(".container-fluid").eq(competitionDefault.number);
            let rounds = data.children("div").children().eq(1).children("div").children("ul").children();

            for(let j = 0; j < rounds.length; j++){
                let roundResult = await this.roundScraping.runRfef(rounds.eq(j),competition,competitionDefault.url);
                competition.rounds.push(roundResult._id);
            }

            await this.replaceCompetition(competition);
        }
    }

    public async runFff(competitionDefault:any) {
        console.log("\t-> "+competitionDefault.name);

        let pageSeason = await request({
            url: FffConstants.URL_DEFAULT+"/"+competitionDefault.code+"/calendrier_resultat",
            rejectUnauthorized: false
        });
        
        let $ = cheerio.load(pageSeason);
        let seasons = $("select[name='saison']").children();

        for(let i = 0; i <= seasons.length; i++) {
            let numberSeason = parseInt(seasons.eq(i).attr("value"));
            
            if(numberSeason>=FffConstants.START_SEASON) {
                let year = parseInt(seasons.eq(i).text().split("/")[1]);
                
                console.log("\t\t-> "+year);

                let competition = new Competition;
                competition.name = competitionDefault.name;
                competition.code = competitionDefault.code;
                competition.type = competitionDefault.type;
                competition.year = year+"";
                competition.country = FffConstants.COUNTRY;
                competition.rounds = [];
                
                let page = await request({
                    url: FffConstants.URL_DEFAULT+"/"+competitionDefault.code+"/calendrier_resultat?sai="+numberSeason,
                    rejectUnauthorized: false
                });
                
                let $ = cheerio.load(page);
                let rounds = $("select[name='journee']").children();
                
                for(let j = 0; j < rounds.length; j++){
                    if(rounds.eq(j).text().includes("Week")) {
                        let roundResult = await this.roundScraping.runFff(rounds.eq(j),competition,competitionDefault,numberSeason);
                        competition.rounds.push(roundResult._id);
                    }
                }
                
                await this.replaceCompetition(competition);
            }
        }
    }
}

export default CompetitionScraping;