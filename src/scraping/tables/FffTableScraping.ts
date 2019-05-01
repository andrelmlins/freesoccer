import request from "request-promise-any";
import cheerio from "cheerio";

import FffConstants from "../../constants/FffConstants";
import Helpers from "../../utils/Helpers";
import ICompetitionDefault from "../../interfaces/ICompetitionDefault";

import { Competition } from "../../schemas/Competition";
import { Table } from "../../schemas/Table";
import ItemTable from "../../schemas/ItemTable";

export default class FffTableScraping {
  public lastYear: boolean;

  constructor(lastYear: boolean) {
    this.lastYear = lastYear;
  }

  public async run(competition: ICompetitionDefault) {
    console.log("-> FFF TABLE LEAGUE SCRAPING");

    await this.runCompetition(competition);
  }

  public async runCompetition(competitionDefault: ICompetitionDefault) {
    console.log("\t-> " + competitionDefault.name);

    let pageSeason = await request({
      url: FffConstants.URL_DEFAULT + "/" + competitionDefault.code + "/classement",
      rejectUnauthorized: false
    });

    let $ = cheerio.load(pageSeason);
    let seasons = $("select[name='saison']").children();

    let end = seasons.length;
    if (this.lastYear) end = 1;

    for (let i = 0; i < end; i++) {
      let numberSeason = parseInt(seasons.eq(i).attr("value"));

      if (numberSeason >= FffConstants.START_SEASON) {
        let year = parseInt(
          seasons
            .eq(i)
            .text()
            .split("/")[0]
        );

        console.log("\t\t-> " + year);

        let competition = await Competition.findOne({ code: competitionDefault.code, year: year });

        let page = await request({
          url: FffConstants.URL_DEFAULT + "/" + competitionDefault.code + "/classement?sai=" + numberSeason,
          rejectUnauthorized: false
        });

        let $ = cheerio.load(page);
        let tableHtml = $("#liste_classement table tbody").children();

        let table = new Table();
        table.competition = competition!._id;
        table.itens = [];

        for (let j = 0; j < tableHtml.length; j++) {
          let item = this.runItemTable(tableHtml.eq(j), j + 1);
          if (item) table.itens.push(item);
        }

        await Helpers.replaceTable(table);
      }
    }
  }

  public runItemTable(tableHtml: any, position: number): ItemTable | null {
    let data = tableHtml.children();

    let item = new ItemTable();
    item.position = position;
    item.name = data
      .eq(2)
      .text()
      .trim();
    item.flag =
      FffConstants.URL_DEFAULT +
      data
        .eq(2)
        .find("img")
        .attr("src")
        .trim();
    item.points = parseInt(
      data
        .eq(10)
        .text()
        .trim()
    );
    item.matches = parseInt(
      data
        .eq(3)
        .text()
        .trim()
    );
    item.win = parseInt(
      data
        .eq(4)
        .text()
        .trim()
    );
    item.draw = parseInt(
      data
        .eq(5)
        .text()
        .trim()
    );
    item.lose = parseInt(
      data
        .eq(6)
        .text()
        .trim()
    );
    item.goalsScored = parseInt(
      data
        .eq(7)
        .text()
        .trim()
    );
    item.goalsAgainst = parseInt(
      data
        .eq(8)
        .text()
        .trim()
    );
    item.goalsDifference = item.goalsScored - item.goalsAgainst;
    item.yellowCard = undefined;
    item.redCard = undefined;

    return item;
  }
}
