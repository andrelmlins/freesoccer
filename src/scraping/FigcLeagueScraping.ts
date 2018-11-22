import * as request from 'request-promise-any';
import * as cheerio from 'cheerio';
import * as md5 from 'md5';
import * as moment from 'moment';

import FigcConstants from '../constants/FigcConstants';
import Helpers from '../utils/Helpers';
import ICompetitionDefault from '../interfaces/ICompetitionDefault';

import { Competition, ICompetition } from '../schemas/Competition';
import { Round, IRound } from '../schemas/Round';
import Match from '../schemas/Match';
import TeamResult from '../schemas/TeamResult';

export default class FigcLeagueScraping {
    constructor() {
        
    }

    public async run(competition: ICompetitionDefault) {
        console.log("-> FIGC LEAGUE SCRAPING");

        await this.runCompetition(competition)
    }

    public async runCompetition(competitionDefault: ICompetitionDefault) {
        console.log("\t-> "+competitionDefault.name);

        for(let i = 0 ; i < competitionDefault.years!.length; i++) {
            console.log("\t\t-> "+competitionDefault.years![i]);

            let competition = new Competition;
            competition.name = competitionDefault.name;
            competition.code = competitionDefault.code;
            competition.type = competitionDefault.type;
            competition.year = competitionDefault.years![i];
            competition.country = FigcConstants.COUNTRY;
            competition.rounds = [];

            let newYear = (parseInt(competition.year.substring(2,4))+1)+"";
            if(newYear.length==1) newYear = "0"+newYear;

            let year = competition.year + "-" + newYear;
            
            let page = await request({
                url: competitionDefault.aux.url+"/"+year+"/UNICO/UNI/1",
                rejectUnauthorized: false
            });
            
            let $ = cheerio.load(page);
            let data = $("#menu-giornate").children();

            for(let j = 0; j < 2; j++){
                let rounds = data.eq(j).children();

                for(let k = 1; k < rounds.length; k++){
                    let roundResult = await this.runRound(rounds.eq(k),competition, competitionDefault, year);
                    competition.rounds.push(roundResult!._id);
                }
            }

            await Helpers.replaceCompetition(competition);
        }
    }

    public async runRound(roundHtml:any, competition:ICompetition, competitionDefault:any, year:string): Promise<IRound | null> {
        let number = parseInt(roundHtml.text().trim());

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
            url: competitionDefault.aux.url+"/"+year+"/UNICO/UNI/"+number,
            rejectUnauthorized: false
        });
        
        let $ = cheerio.load(page);
        let matches = $(".risultati").children();

        for(let i = 1; i < matches.length; i++){
            let matchResult = await this.runMatch(matches.eq(i));
            
            if(matchResult.teamGuest.goals && matchResult.teamHome.goals) {
                round.goals += (matchResult.teamGuest.goals + matchResult.teamHome.goals);
                round.goalsGuest += matchResult.teamGuest.goals;
                round.goalsHome += matchResult.teamHome.goals;
            }

            round.matchs.push(matchResult);
        }

        return await Helpers.replaceRound(round);
    }

    public async runMatch(matchHtml:any): Promise<Match> {
        let match = new Match;
        match.teamHome = new TeamResult;
        match.teamGuest = new TeamResult;

        let data = matchHtml.children();
        let date = data.eq(0).children("p").children("span").text().trim();
        if(date.length<16) date = date+" 00:00";

        let location = data.eq(0).children("p").html().split("</span>")[1].split("<br>")[1].replace("Stadium: ","").trim();
        location = location.split("(");

        match.name = "";
        match.date = moment.utc(date, 'DD/MM/YYYY HH:mm').format();
        match.stadium = location[0].trim();
        match.location = location[1] ? location[1].replace(")","").trim() : "";
        
        match.teamHome.initials = "";
        match.teamHome.name = data.eq(1).children(".nomesquadra").text().trim();
        match.teamHome.flag = FigcConstants.URL_DEFAULT+data.eq(1).children("img").attr("src");
        match.teamHome.goals = data.eq(1).children("span").text().trim()=="-" ? undefined : parseInt(data.eq(1).children("span").text().trim());

        match.teamGuest.initials = "";
        match.teamGuest.name = data.eq(2).children(".nomesquadra").text().trim();
        match.teamGuest.flag = FigcConstants.URL_DEFAULT+data.eq(2).children("img").attr("src");
        match.teamGuest.goals = data.eq(2).children("span").text().trim()=="-" ? undefined : parseInt(data.eq(2).children("span").text().trim());

        return match;
    }
}