import axios from "axios";
import cheerio from "cheerio";

import RfefConstants from "../../constants/RfefConstants";
import Helpers from "../../utils/Helpers";
import ICompetitionDefault from "../../interfaces/ICompetitionDefault";

import { Competition, ICompetition } from "../../schemas/Competition";
import { Table } from "../../schemas/Table";
import ItemTable from "../../schemas/ItemTable";

export default class RfefTableScraping {
  public lastYear: boolean;

  constructor(lastYear: boolean) {
    this.lastYear = lastYear;
  }

  public async run(competition: ICompetitionDefault) {
    console.log("-> RFEF TABLE LEAGUE SCRAPING");

    await this.runCompetition(competition);
  }

  public async runCompetition(competitionDefault: ICompetitionDefault) {
    console.log("\t-> " + competitionDefault.name);

    let initial = 0;
    if (this.lastYear) initial = competitionDefault.years!.length - 1;

    for (let i = initial; i < competitionDefault.years!.length; i++) {
      console.log("\t\t-> " + competitionDefault.years![i]);

      let year = (parseInt(competitionDefault.years![i]) - 1).toString();
      let competition = await Competition.findOne({ code: competitionDefault.code, year: year });

      let page = await axios.get(
        RfefConstants.URL_DEFAULT + competitionDefault.aux.url + "/clasificaciones?t=" + competitionDefault.years![i]
      );

      let $ = cheerio.load(page.data);
      let list = $(".postcontent").find(".content").children(".container-fluid");

      for (let j = 0; j < list.length; j++) {
        if (list.eq(j).children("div").children().eq(0).text().trim().includes(competitionDefault.aux.name)) {
          let rounds = list.eq(j).children("div").children().eq(1).children("div").children("ul").children();

          await this.runTable(rounds.eq(0), competition!, competitionDefault.aux.url);
          break;
        }
      }
    }
  }

  public async runTable(roundHtml: any, competition: ICompetition, url: String) {
    let route = roundHtml.children("a").attr("href");

    let table = new Table();
    table.competition = competition!._id;
    table.itens = [];

    let page = await axios.get(RfefConstants.URL_DEFAULT + url + "/" + route);
    let $ = cheerio.load(page.data);
    let tableHtml = $(".postcontent").find(".content").find("table").find("tbody").children();

    for (let j = 0; j < tableHtml.length; j++) {
      let item = this.runItemTable(tableHtml.eq(j), j + 1);
      if (item) table.itens.push(item);
    }

    await Helpers.replaceTable(table);
  }

  public runItemTable(tableHtml: any, position: number): ItemTable | null {
    let data = tableHtml.children();

    let item = new ItemTable();
    item.position = position;
    item.name = data.eq(1).text().trim();
    item.flag = "";
    item.points = parseInt(data.eq(2).text().trim());
    item.matches = parseInt(data.eq(3).text().trim());
    item.win = parseInt(data.eq(4).text().trim());
    item.draw = parseInt(data.eq(5).text().trim());
    item.lose = parseInt(data.eq(6).text().trim());
    item.goalsScored = parseInt(data.eq(7).text().trim());
    item.goalsAgainst = parseInt(data.eq(8).text().trim());
    item.goalsDifference = item.goalsScored - item.goalsAgainst;
    item.yellowCard = undefined;
    item.redCard = undefined;

    return item;
  }
}
