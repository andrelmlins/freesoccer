import * as request from 'request-promise-any';
import * as cheerio from 'cheerio';
import * as md5 from 'md5';
import * as moment from 'moment';

import FffConstants from '../../constants/FffConstants';
import Helpers from '../../utils/Helpers';
import ICompetitionDefault from '../../interfaces/ICompetitionDefault';

import { ICompetition } from '../../schemas/Competition';
import { IStage, Stage } from '../../schemas/Stage';
import Match from '../../schemas/Match';
import TeamResult from '../../schemas/TeamResult';

export default class FffEliminationScraping {
    public lastYear: boolean;

    constructor(lastYear: boolean) {
        this.lastYear = lastYear;    
    }

    public async run(competition: ICompetitionDefault) {
        console.log("-> FFF ELIMATION SCRAPING");

        await this.runCompetition(competition);
    }

    public async runCompetition(competitionDefault: ICompetitionDefault) {
        console.log("\t-> "+competitionDefault.name);
        
        let pageSeason = await request({
            url: FffConstants.URL_DEFAULT+"/"+competitionDefault.aux.url+"/calendrier_resultat",
            rejectUnauthorized: false
        });
        
        let $ = cheerio.load(pageSeason);
        let seasons = $("select[name='saison']").children();

        let end = seasons.length;
        if(this.lastYear) end = 1;

        for(let i = 0; i < end; i++) {
            let numberSeason = parseInt(seasons.eq(i).attr("value"));
            
            if(numberSeason>=FffConstants.START_SEASON) {
                let year = parseInt(seasons.eq(i).text().split("/")[0]);
                
                console.log("\t\t-> "+year);

                let competition = await Helpers.createCompetition(competitionDefault,year+"",FffConstants);
                
                let page = await request({
                    url: FffConstants.URL_DEFAULT+"/"+competitionDefault.aux.url+"/calendrier_resultat?sai="+numberSeason,
                    rejectUnauthorized: false
                });
                
                let $ = cheerio.load(page);
                let stages = $("select[name='journee']").children();
                
                for(let j = 0; j < stages.length; j++){
                    let roundResult = await this.runStage(stages.eq(j),competition,competitionDefault,numberSeason);
                    competition.rounds.push(roundResult!._id);
                }
                
                await Helpers.replaceCompetition(competition);
            }
        }
    }

    public async runStage(stageHtml:any, competition:ICompetition, competitionDefault:any, codeyear:number): Promise<IStage | null> {
        let number = parseInt(stageHtml.attr("value"));

        let stage = new Stage;
        stage.goals = 0;
        stage.name =  stageHtml.text();
        stage.matchs = [];
        stage.competition = competition._id;
        stage.hash = md5(competition.code+competition.year+stage.name);
        console.log("\t\t\t-> Stage "+stage.name);
        
        let page = await request({
            url: FffConstants.URL_DEFAULT+"/"+competitionDefault.aux.url+"/calendrier_resultat?sai="+codeyear+"&jour="+number,
            rejectUnauthorized: false
        });

        let $ = cheerio.load(page);
        let data = $("#tableaux_rencontres").children("div").find("table");

        for(let i = 0; i < data.length; i++){
            let date = data.eq(i).children("caption").text().replace("Fixtures of ","").trim();
            let matchs = data.eq(i).children("tbody").children();

            for(let i = 0; i < matchs.length; i++){
                let matchResult = await this.runMatch(matchs.eq(i),date);

                if(matchResult.teamGuest.goals && matchResult.teamHome.goals) {
                    stage.goals += (matchResult.teamGuest.goals + matchResult.teamHome.goals);
                }
    
                stage.matchs.push(matchResult);
            }
        }

        return await Helpers.replaceStage(stage);
    }

    public async runMatch(matchHtml:any, date:string): Promise<Match> {
        let match = new Match;
        match.teamHome = new TeamResult;
        match.teamGuest = new TeamResult;

        let data = matchHtml.children();
        let penalty = null;

        let childrenResult = data.eq(3).children("a").children()
        
        if(childrenResult.length>=1){
            if(childrenResult.text().includes("pens")){
                penalty = childrenResult.eq(0).text().replace("on pens").trim().split(" - ");
            }
            data.eq(3).children("a").children().eq(0).remove();
        }

        if(childrenResult.length>=2){
            penalty = childrenResult.eq(1).text().replace("on pens").trim().split(" - ");
            data.eq(3).children("a").children().eq(0).remove();
        }

        let result = data.eq(3).children("a").text().trim().split(" - ");
        
        date = date+" "+data.eq(0).children("a").text().trim();

        match.date = moment.utc(date, 'DD MMMM YYYY HH:mm').format();
        match.stadium = "";
        match.location = "";
        
        match.teamHome.initials = "";
        match.teamHome.name = data.eq(1).text().trim();
        match.teamHome.flag = FffConstants.URL_DEFAULT+data.eq(2).find("img").attr("src");
        match.teamHome.goals = result.length==1 ? undefined : parseInt(result[0]);
        match.teamHome.goalsPenalty = !penalty ? undefined : parseInt(penalty[0]);

        match.teamGuest.initials = "";
        match.teamGuest.name = data.eq(5).text().trim();
        match.teamGuest.flag = FffConstants.URL_DEFAULT+data.eq(4).find("img").attr("src");
        match.teamGuest.goals = result.length==1 ? undefined : parseInt(result[1]);
        match.teamGuest.goalsPenalty = !penalty ? undefined : parseInt(penalty[1]);

        return match;
    }
}