import * as moment from 'moment';

import { Match, IMatch } from '../schemas/Match';
import { TeamResult } from '../schemas/TeamResult';
import FffConstants from '../constants/FffConstants';

class MatchScraping {
    constructor() {
        
    }

    public async runCbf(matchHtml:any): Promise<IMatch> {
        let match = new Match;
        match.teamHome = new TeamResult;
        match.teamGuest = new TeamResult;

        matchHtml.find(".partida-desc").eq(0).find(".partida-desc").remove();

        let result = matchHtml.find(".partida-horario").children("span").text().split(" x ");
        let location = matchHtml.find(".partida-desc").eq(1).text().trim().replace(" Como foi o jogo","").split(" - ");
        let date = matchHtml.find(".partida-desc").eq(0).text().trim().split(" - ")[0].split(",")[1].trim();

        match.name = matchHtml.find(".partida-desc").eq(0).text().trim().split(" - ")[1].trim();
        match.date = moment.utc(date, 'DD/MM/YYYY HH:mm').format();
        match.stadium = location[0];
        match.location = location[1]+"/"+location[2];
        
        match.teamHome.initials = matchHtml.find(".time.pull-left").find(".time-sigla").text();
        match.teamHome.name = matchHtml.find(".time.pull-left").find("img").attr("alt");
        match.teamHome.flag = matchHtml.find(".time.pull-left").find("img").attr("src");
        match.teamHome.goals = result[0]=="" ? undefined : parseInt(result[0]);

        match.teamGuest.initials = matchHtml.find(".time.pull-right").find(".time-sigla").text();
        match.teamGuest.name = matchHtml.find(".time.pull-right").find("img").attr("alt");
        match.teamGuest.flag = matchHtml.find(".time.pull-right").find("img").attr("src");
        match.teamGuest.goals = result[1]=="" ? undefined : parseInt(result[1]);

        return match;
    }

    public async runRfef(matchHtml:any, date:string): Promise<IMatch> {
        let childrens = matchHtml.children();
        
        let match = new Match;
        match.teamHome = new TeamResult;
        match.teamGuest = new TeamResult;

        match.name = "";
        match.date = date;
        match.stadium = "";
        match.location = "";

        match.teamHome.initials = "";
        match.teamHome.name = childrens.eq(0).text().replace("SAD","").trim();
        match.teamHome.flag = "";
        match.teamHome.goals = parseInt(childrens.eq(1).text().trim());

        match.teamGuest.initials = "";
        match.teamGuest.name = childrens.eq(3).text().replace("SAD","").trim();
        match.teamGuest.flag = "";
        match.teamGuest.goals = parseInt(childrens.eq(2).text().trim());

        return match;
    }

    public async runFff(matchHtml:any, date:string): Promise<IMatch> {
        let match = new Match;
        match.teamHome = new TeamResult;
        match.teamGuest = new TeamResult;

        let data = matchHtml.children();
        let result = data.eq(3).children("a").text().trim().split(" - ");
        date = date+" "+data.eq(0).children("a").text().trim();

        match.name = "";
        match.date = moment.utc(date, 'DD MMMM YYYY HH:mm').format();
        match.stadium = "";
        match.location = "";
        
        match.teamHome.initials = "";
        match.teamHome.name = data.eq(1).children("a").text().trim();
        match.teamHome.flag = FffConstants.URL_DEFAULT+data.eq(2).children("a").children("img").attr("src");
        match.teamHome.goals = result.length==1 ? undefined : parseInt(result[0]);

        match.teamGuest.initials = "";
        match.teamGuest.name = data.eq(5).children("a").text().trim();
        match.teamGuest.flag = FffConstants.URL_DEFAULT+data.eq(4).children("a").children("img").attr("src");
        match.teamGuest.goals = result.length==1 ? undefined : parseInt(result[1]);

        return match;
    }
}

export default MatchScraping;