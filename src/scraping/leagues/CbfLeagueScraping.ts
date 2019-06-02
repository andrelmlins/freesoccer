import request from "request-promise-any";
import cheerio from "cheerio";
import md5 from "md5";
import moment from "moment";

import CbfConstants from "../../constants/CbfConstants";
import Helpers from "../../utils/Helpers";
import ICompetitionDefault from "../../interfaces/ICompetitionDefault";

import { ICompetition } from "../../schemas/Competition";
import { Round, IRound } from "../../schemas/Round";
import Match from "../../schemas/Match";
import TeamResult from "../../schemas/TeamResult";

export default class CbfLeagueScraping {
  public lastYear: boolean;

  constructor(lastYear: boolean) {
    this.lastYear = lastYear;
  }

  public async run(competition: ICompetitionDefault) {
    console.log("-> CBF LEAGUE SCRAPING");

    await this.runCompetition(competition);
  }

  public async runCompetition(competitionDefault: ICompetitionDefault) {
    console.log("\t-> " + competitionDefault.name);

    let initial = 0;
    if (this.lastYear) initial = competitionDefault.years!.length - 1;

    for (let i = initial; i < competitionDefault.years!.length; i++) {
      console.log("\t\t-> " + competitionDefault.years![i]);

      let competition = await Helpers.createCompetition(competitionDefault, competitionDefault.years![i], CbfConstants);

      let page = await request(CbfConstants.URL_DEFAULT + "/" + competition.code + "/" + competition.year);

      let $ = cheerio.load(page);

      let section = $(".container section");
      let rounds = section
        .children()
        .eq(1)
        .children("aside")
        .children("div")
        .children();

      for (let j = 0; j < rounds.length; j++) {
        let roundResult = await this.runRound(rounds.eq(j), competition);
        competition.rounds.push(roundResult!._id);
      }

      await Helpers.replaceCompetition(competition);
    }
  }

  public async runRound(roundHtml: any, competition: ICompetition): Promise<IRound | null> {
    let round = new Round();
    round.goals = 0;
    round.goalsHome = 0;
    round.goalsGuest = 0;
    round.number = roundHtml
      .children("header")
      .children("h3")
      .text()
      .replace("Rodada ", "");
    round.matchs = [];
    round.competition = competition._id;
    round.hash = md5(competition.code + competition.year + round.number);

    console.log("\t\t\t-> Round " + round.number);

    let matchsHtml = roundHtml.find(".list-unstyled").children();

    for (let i = 0; i < matchsHtml.length; i++) {
      let matchResult = await this.runMatch(matchsHtml.eq(i));

      if (matchResult.teamGuest.goals && matchResult.teamHome.goals) {
        round.goals += matchResult.teamGuest.goals + matchResult.teamHome.goals;
        round.goalsGuest += matchResult.teamGuest.goals;
        round.goalsHome += matchResult.teamHome.goals;
      }

      round.matchs.push(matchResult);
    }

    return await Helpers.replaceRound(round);
  }

  public async runMatch(matchHtml: any): Promise<Match> {
    let match = new Match();
    match.teamHome = new TeamResult();
    match.teamGuest = new TeamResult();

    matchHtml
      .find(".partida-desc")
      .eq(0)
      .find(".partida-desc")
      .remove();

    let result = matchHtml
      .find(".partida-horario")
      .children("span")
      .text()
      .split(" x ");
    let location = matchHtml
      .find(".partida-desc")
      .eq(1)
      .text()
      .trim()
      .replace(" Como foi o jogo", "")
      .split(" - ");
    let date = matchHtml
      .find(".partida-desc")
      .eq(0)
      .text()
      .trim()
      .split(" - ")[0]
      .split(",")[1]
      .trim();

    match.date = moment.utc(date, "DD/MM/YYYY HH:mm").format();
    match.stadium = location[0];
    match.location = location[1] + "/" + location[2];

    match.teamHome.initials = matchHtml
      .find(".time.pull-left")
      .find(".time-sigla")
      .text();
    match.teamHome.name = matchHtml
      .find(".time.pull-left")
      .find("img")
      .attr("alt");
    match.teamHome.flag = matchHtml
      .find(".time.pull-left")
      .find("img")
      .attr("src");
    match.teamHome.goals = result[0] == "" ? undefined : parseInt(result[0]);

    match.teamGuest.initials = matchHtml
      .find(".time.pull-right")
      .find(".time-sigla")
      .text();
    match.teamGuest.name = matchHtml
      .find(".time.pull-right")
      .find("img")
      .attr("alt");
    match.teamGuest.flag = matchHtml
      .find(".time.pull-right")
      .find("img")
      .attr("src");
    match.teamGuest.goals = result[1] == "" ? undefined : parseInt(result[1]);

    return match;
  }
}
