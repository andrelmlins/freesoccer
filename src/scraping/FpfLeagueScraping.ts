import * as request from 'request-promise-any';
import * as cheerio from 'cheerio';
import * as md5 from 'md5';
import * as moment from 'moment';

import FpfConstants from '../constants/FpfConstants';
import Helpers from '../utils/Helpers';
import ICompetitionDefault from '../interfaces/ICompetitionDefault';

import { ICompetition } from '../schemas/Competition';
import { Round, IRound } from '../schemas/Round';
import Match from '../schemas/Match';
import TeamResult from '../schemas/TeamResult';

export default class FffLeagueScraping {
    public lastYear: boolean;

    constructor(lastYear: boolean) {
        this.lastYear = lastYear;    
    }

    public async run(competition: ICompetitionDefault) {
        console.log("-> FPF LEAGUE SCRAPING");

        await this.runCompetition(competition)
    }

    public async runCompetition(competitionDefault: ICompetitionDefault) {
        console.log("\t-> "+competitionDefault.name);

        let initial = 0;
        if(this.lastYear) initial = competitionDefault.years!.length-1; 

        for(let i = initial; i < competitionDefault.years!.length; i++) {
            let year = competitionDefault.years![i];
            let codeYear = year+(parseInt(year)+1);
            let url = competitionDefault.aux.urls[i];
                
            console.log("\t\t-> "+year);

            let competition = await Helpers.createCompetition(competitionDefault,year+"",FpfConstants);
            
            let page = await request({
                url: FpfConstants.URL_DEFAULT+"/jornada/"+codeYear+"/"+url,
                rejectUnauthorized: false
            });
            
            let $ = cheerio.load(page);
            let rounds = $("select[name='ddlMatchdays']").children();
            
            for(let j = 0; j < rounds.length; j++){
                if(rounds.eq(j).text().includes("Week")) {
                    let roundResult = await this.runRound(rounds.eq(j),competition,url,codeYear);
                    competition.rounds.push(roundResult!._id);
                }
            }
            
            await Helpers.replaceCompetition(competition);
        }
    }

    public async runRound(roundHtml:any, competition:ICompetition, url:string, codeYear:string): Promise<IRound | null> {
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
            url: FpfConstants.URL_DEFAULT+"/jornada/"+codeYear+"/"+url+"/"+number,
            rejectUnauthorized: false
        });

        let $ = cheerio.load(page);
        let data = $(".container").eq(2).children(".tab-content").children().eq(0).children("div");
        let matches = data.children().eq(0).children();

        let date = "";
        for(let i = 1; i < matches.length-1; i++){
            if(matches.eq(i).hasClass("match-day")){
                date = matches.eq(i).text().trim();
            } else {
                let matchResult = await this.runMatch(matches.eq(i),date);
    
                if(matchResult.teamGuest.goals && matchResult.teamHome.goals) {
                    round.goals += (matchResult.teamGuest.goals + matchResult.teamHome.goals);
                    round.goalsGuest += matchResult.teamGuest.goals;
                    round.goalsHome += matchResult.teamHome.goals;
                }
    
                round.matchs.push(matchResult);
            }
        }

        return await Helpers.replaceRound(round);
    }

    public async runMatch(matchHtml:any, date:string): Promise<Match> {
        let match = new Match;
        match.teamHome = new TeamResult;
        match.teamGuest = new TeamResult;

        let data = matchHtml.children("div").children().eq(1).children();
        let result = null;

        if(matchHtml.children("div").children().eq(0).children().length==2){
            date = date.split(", ")[1]+" "+data.eq(1).text().trim().replace("H",":");
        } else {
            result = data.eq(1).text().trim().split(" - ");
            date = date.split(", ")[1]+" "+matchHtml.children("div").children().eq(0).children(".time").text().trim().replace("H",":");
        }

        match.date = moment.utc(date, 'DD MMMM YYYY HH:mm').format();
        match.stadium = "";
        match.location = "";
        
        // let positions = data.eq(0).children(".teams-logo").css("background-position").split(" ");
        // let height = parseInt(data.eq(0).children(".teams-logo").css("height").replace("px",""));

        // let x = parseInt(positions[0].replace("px",""))/height;
        // let y = parseInt(positions[1].replace("px",""))/height;
        
        // let position = x*y; 
        
        match.teamHome.initials = "";
        match.teamHome.name = data.eq(0).children(".teams-name").text().trim();
        //match.teamHome.flag = Helpers.getUrl(this.request, "/assets/flags/fpf/image_part_"+('000'+position).slice(-3));
        match.teamHome.flag = "";
        match.teamHome.goals = result==null ? undefined : parseInt(result[0]);

        match.teamGuest.initials = "";
        match.teamGuest.name = data.eq(2).children(".teams-name").text().trim();
        match.teamGuest.flag = "";
        match.teamGuest.goals = result==null ? undefined : parseInt(result[1]);

        return match;
    }
}