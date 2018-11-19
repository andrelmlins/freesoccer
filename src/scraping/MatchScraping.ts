import * as moment from 'moment';

import { Match, IMatch } from '../schemas/Match';
import { TeamResult } from '../schemas/TeamResult';

class MatchScraping {
    constructor() {
        
    }

    public async runCbf(matchHtml:any): Promise<IMatch> {
        let match = new Match;
        match.teamHome = new TeamResult;
        match.teamGuest = new TeamResult;

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
}

export default MatchScraping;