import * as md5 from 'md5';
import * as request from 'request-promise-any';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

import MatchScraping from './MatchScraping';

import { Round, IRound } from '../schemas/Round';
import { ICompetition } from '../schemas/Competition';
import RfefConstants from '../constants/RfefConstants';
import FffConstants from '../constants/FffConstants';

class RoundScraping {
    private matchScraping: MatchScraping;

    constructor() {
        this.matchScraping = new MatchScraping;
    }

    public async replaceRound(round:IRound){
        let roundOld = await Round.findOne({"hash":round.hash});
        if(roundOld) {
            let roundAux:any = round.toObject();
            delete roundAux._id;
            
            let roundResult = await Round.updateOne({"_id":roundOld._id},roundAux);
            return roundResult
        } else {
            let roundResult = await Round.create(round);
            return roundResult;
        }
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

        return await this.replaceRound(round);
    }

    public async runRfef(roundHtml:any, competition:ICompetition, url:String) {
        let route = roundHtml.children("a").attr("href");

        let round = new Round;
        round.goals = 0;
        round.goalsHome = 0;
        round.goalsGuest = 0;
        round.number =  roundHtml.children('a').text().split(' · ')[0].replace("Jornada ","").trim();
        round.matchs = [];
        round.competition = competition._id;
        round.hash = md5(competition.code+competition.year+round.number);
        console.log("\t\t\t-> Round "+round.number);
        
        let page = await request(RfefConstants.URL_DEFAULT+url+"/"+route);

        let $ = cheerio.load(page);
        let data = $(".postcontent").find(".content").children("div");
        let matchs = data.children(".view-content").children("table").children("tbody").children();

        let date = data.children(".attachment").find(".views-field-fechaJornada").children("span").text();
        date = date.trim().replace(")","").replace("(","");
        date = moment.utc(date, 'YYYY-MM-DD').format();

        for(let i = 0; i < matchs.length; i++){
            let matchResult = await this.matchScraping.runRfef(matchs.eq(i),date);

            if(matchResult.teamGuest.goals && matchResult.teamHome.goals) {
                round.goals += (matchResult.teamGuest.goals + matchResult.teamHome.goals);
                round.goalsGuest += matchResult.teamGuest.goals;
                round.goalsHome += matchResult.teamHome.goals;
            }

            round.matchs.push(matchResult);
        }

        return await this.replaceRound(round);
    }

    public async runFff(roundHtml:any, competition:ICompetition, competitionDefault:any, codeyear:number) {
        let number = parseInt(roundHtml.attr("value"));

        let round = new Round;
        round.goals = 0;
        round.goalsHome = 0;
        round.goalsGuest = 0;
        round.number =  number+"";
        round.matchs = [];
        round.competition = competition._id;
        round.hash = md5(competition.code+competition.year+round.number);
        console.log("\t\t\t-> Round "+round.number);
        
        let page = await request({
            url: FffConstants.URL_DEFAULT+"/"+competitionDefault.code+"/calendrier_resultat?sai="+codeyear+"&jour="+number,
            rejectUnauthorized: false
        });

        let $ = cheerio.load(page);
        let data = $("#tableaux_rencontres").children("div").find("table");

        for(let i = 0; i < data.length; i++){
            let date = data.eq(i).children("caption").text().replace("Fixtures of ","").trim();
            let matchs = data.eq(i).children("tbody").children();

            for(let i = 0; i < matchs.length; i++){
                let matchResult = await this.matchScraping.runFff(matchs.eq(i),date);

                if(matchResult.teamGuest.goals && matchResult.teamHome.goals) {
                    round.goals += (matchResult.teamGuest.goals + matchResult.teamHome.goals);
                    round.goalsGuest += matchResult.teamGuest.goals;
                    round.goalsHome += matchResult.teamHome.goals;
                }
    
                round.matchs.push(matchResult);
            }
        }

        return await this.replaceRound(round);
    }
}

export default RoundScraping;