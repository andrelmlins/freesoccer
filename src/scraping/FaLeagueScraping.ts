import * as cheerio from "cheerio";
import * as md5 from "md5";
import * as moment from "moment";

import FaConstants from "../constants/FaConstants";
import Helpers from "../utils/Helpers";
import ICompetitionDefault from "../interfaces/ICompetitionDefault";

import { ICompetition } from "../schemas/Competition";
import { Round, IRound } from "../schemas/Round";
import Match from "../schemas/Match";
import TeamResult from "../schemas/TeamResult";

export default class FigcLeagueScraping {
  public lastYear: boolean;

  constructor(lastYear: boolean) {
    this.lastYear = lastYear;
  }

  public async run(competition: ICompetitionDefault) {
    console.log("-> FA LEAGUE SCRAPING");

    await this.runCompetition(competition);
  }

  public async runCompetition(competitionDefault: ICompetitionDefault) {
    console.log("\t-> " + competitionDefault.name);

    let page = await Helpers.getPageDinamically(FaConstants.URL_DEFAULT + "/results", "div[data-dropdown-block='compSeasons'] ul li");
    let $ = cheerio.load(page);
    let seasons = $("div[data-dropdown-block='compSeasons'] ul").children();
    
    let end = seasons.length;
    if (this.lastYear) end = 1;

    for (let i = 0; i < end; i++) {
      let numberSeason = seasons.eq(i).attr("data-option-id");
      let year = parseInt(seasons.eq(i).text().split("/")[0]);

      if (year >= 2000) {
        console.log("\t\t-> " + year);
        let competition = await Helpers.createCompetition(competitionDefault, year + "", FaConstants);

        let page = await Helpers.getPageDinamicallyScroll(FaConstants.URL_DEFAULT + "/results"+"?co="+competitionDefault.aux.code+"&se="+numberSeason);

        let $ = cheerio.load(page);
        let rounds = $(".fixtures").children();

        let roundsResult = await this.runRound(rounds, competition, competitionDefault, numberSeason);
        competition.rounds = roundsResult!;

        await Helpers.replaceCompetition(competition);
      }
    }
  }

  public async runRound(roundsHtml:any, competition:ICompetition, competitionDefault:any, codeyear:number): Promise<IRound[] | null> {
    let rounds: IRound[] = [];
    let countMatches = 0;
    
    for(let i = 0; i < roundsHtml.length; i++) {
      if(!roundsHtml.eq(i).attr("datetime")){
        countMatches += roundsHtml.eq(i).children().eq(1).children().length;
      } 
    }

    let countRounds = countMatches/10;
    let j = 0;

    for(let i = 0; i < countMatches/10; i++) {
      let round: IRound = new Round;
      round.goals = 0;
      round.goalsHome = 0;
      round.goalsGuest = 0;
      round.number =  countRounds+"";
      round.matchs = [];
      round.competition = competition._id;
      round.hash = md5(competition.code+competition.year+round.number);
      console.log("\t\t\t-> Round "+round.number);

      let date = "";
      let matchesCount = 0;

      for(j; j < roundsHtml.length; j++) {
        if(roundsHtml.eq(j).attr("datetime")) {
          if(date=="") date = roundsHtml.eq(j).text().trim().split(" ").slice(1).join(" ");
        } else {
          let matches = roundsHtml.eq(j).children().eq(1).children();
          matchesCount = matches.length;
          
          for(let k = 0; k < matches.length; k++){
              let matchResult = await this.runMatch(matches.eq(k),date);

              if(matchResult.teamGuest.goals && matchResult.teamHome.goals) {
                  round.goals += (matchResult.teamGuest.goals + matchResult.teamHome.goals);
                  round.goalsGuest += matchResult.teamGuest.goals;
                  round.goalsHome += matchResult.teamHome.goals;
              }

              round.matchs.push(matchResult);
          }

          if(matchesCount >= 10) break; 
        }
      }

      countRounds--;
      rounds.push((await Helpers.replaceRound(round))!);
      date = "";
    }

    return rounds;
  }

  public async runMatch(matchHtml:any, date:string): Promise<Match> {
    const match = new Match;
    match.teamHome = new TeamResult;
    match.teamGuest = new TeamResult;

    const data = matchHtml.find("overview").children();

    match.date = moment.utc(date+" 00:00", 'DD MMMM YYYY HH:mm').format();
    match.stadium = data.eq(1).text();
    match.location = "";

    const dataResult = data.eq(0).children();
    const result = dataResult.eq(1).text().trim().split("-");
    
    match.teamHome.initials = "";
    match.teamHome.name = dataResult.eq(0).find("teamName");
    match.teamHome.flag = "";
    match.teamHome.goals = result.length>1 ? undefined : parseInt(result[0]);

    match.teamGuest.initials = "";
    match.teamGuest.name = dataResult.eq(2).find("teamName");
    match.teamGuest.flag = "";
    match.teamGuest.goals = result.length>1 ? undefined : parseInt(result[1]);

    return match;
  }
}
