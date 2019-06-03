import cheerio from "cheerio";
import md5 from "md5";
import moment from "moment";

import FaConstants from "../../constants/FaConstants";
import Helpers from "../../utils/Helpers";
import ICompetitionDefault from "../../interfaces/ICompetitionDefault";

import { ICompetition } from "../../schemas/Competition";
import { Round, IRound } from "../../schemas/Round";
import Match from "../../schemas/Match";
import TeamResult from "../../schemas/TeamResult";

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

        let page = await Helpers.getPageDinamicallyScroll(
          FaConstants.URL_DEFAULT + "/results" + "?co=" + competitionDefault.aux.code + "&se=" + numberSeason
        );
        let $ = cheerio.load(page);

        if (i == 0) {
          let pageFixtures = await Helpers.getPageDinamicallyScroll(FaConstants.URL_DEFAULT + "/fixtures");
          let $_fixtures = cheerio.load(pageFixtures);

          let roundsFixtures = $_fixtures(".fixtures").children();
          for (let i = 0; i < roundsFixtures.length; i++) {
            $(".fixtures").prepend(roundsFixtures.eq(i).html());
          }
        }

        let rounds = $(".fixtures").children();

        let roundsResult = await this.runRound(rounds, competition);
        competition.rounds = roundsResult!;

        await Helpers.replaceCompetition(competition);
      }
    }
  }

  public async runRound(roundsHtml: any, competition: ICompetition): Promise<IRound[] | null> {
    let rounds: IRound[] = [];
    let countMatches = 0;

    for (let i = 0; i < roundsHtml.length; i++) {
      if (!roundsHtml.eq(i).attr("datetime")) {
        countMatches += roundsHtml.eq(i).children().eq(1).children().length;
      }
    }

    let countRounds = Math.round(countMatches / 10);
    let j = 0;

    for (let i = 0; i < countRounds; i++) {
      let round: IRound = new Round();
      round.goals = 0;
      round.goalsHome = 0;
      round.goalsGuest = 0;
      round.number = countRounds - i + "";
      round.matchs = [];
      round.competition = competition._id;
      round.hash = md5(competition.code + competition.year + round.number);
      console.log("\t\t\t-> Round " + round.number);

      let matchesCount = 0;
      let date = "";

      for (j; j < roundsHtml.length; j++) {
        if (roundsHtml.eq(j).attr("datetime")) {
          if (date == "")
            date = roundsHtml.eq(j).text().trim().split(" ").slice(1).join(" ");
        } else {
          let matches = roundsHtml.eq(j).children().eq(1).children();
          matchesCount += matches.length;

          for (let k = 0; k < matches.length; k++) {
            let matchResult = await this.runMatch(matches.eq(k), date);

            if (matchResult.teamGuest.goals && matchResult.teamHome.goals) {
              round.goals += matchResult.teamGuest.goals + matchResult.teamHome.goals;
              round.goalsGuest += matchResult.teamGuest.goals;
              round.goalsHome += matchResult.teamHome.goals;
            }
            round.matchs.push(matchResult);
          }

          if (matchesCount >= 10) break;
        }
      }

      rounds.push((await Helpers.replaceRound(round))!);
    }

    return rounds;
  }

  public async runMatch(matchHtml: any, date: string): Promise<Match> {
    const match = new Match();
    match.teamHome = new TeamResult();
    match.teamGuest = new TeamResult();

    const data = matchHtml.find(".overview").children();
    const location = matchHtml.eq(1).text().split(", ");

    match.date = moment.utc(date + " 00:00", "DD MMMM YYYY HH:mm").format();
    match.stadium = location[0];
    match.location = location[1];

    const dataResult = data.eq(0).children();
    const result = dataResult.eq(1).text().trim().split("-");

    match.teamHome.initials = "";
    match.teamHome.name = dataResult.eq(0).text().trim();
    match.teamHome.flag = "";
    match.teamHome.goals = result.length < 2 ? undefined : parseInt(result[0]);

    match.teamGuest.initials = "";
    match.teamGuest.name = dataResult.eq(2).text().trim();
    match.teamGuest.flag = "";
    match.teamGuest.goals = result.length < 2 ? undefined : parseInt(result[1]);

    return match;
  }
}
