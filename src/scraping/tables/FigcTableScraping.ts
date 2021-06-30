import axios from 'axios';
import https from 'https';
import cheerio from 'cheerio';

import FigcConstants from '@constants/FigcConstants';
import ICompetitionDefault from '@interfaces/ICompetitionDefault';

import { Competition } from '@schemas/Competition';
import { Table } from '@schemas/Table';
import ItemTable from '@schemas/ItemTable';
import TableRepository from '@repository/TableRepository';

class FigcTableScraping {
  public lastYear: boolean;
  private axios: any;
  private tableRepository: TableRepository;

  constructor(lastYear: boolean) {
    this.lastYear = lastYear;
    this.tableRepository = new TableRepository();

    this.axios = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });
  }

  public async run(competition: ICompetitionDefault) {
    console.log('-> FIGC TABLE LEAGUE SCRAPING');

    await this.runCompetition(competition);
  }

  public async runCompetition(competitionDefault: ICompetitionDefault) {
    console.log(`\t-> ${competitionDefault.name}`);

    let initial = 0;
    if (this.lastYear) initial = competitionDefault.years!.length - 1;

    for (let i = initial; i < competitionDefault.years!.length; i++) {
      console.log(`\t\t-> ${competitionDefault.years![i]}`);

      const competition = await Competition.findOne({
        code: competitionDefault.code,
        year: competitionDefault.years![i],
      });

      let newYear = `${Number(competition!.year.substring(2, 4)) + 1}`;
      if (newYear.length === 1) newYear = `0${newYear}`;

      const year = `${competition!.year}-${newYear}`;

      const page = await this.axios.get(`${competitionDefault.aux.url}/classifica/${year}`);

      const $ = cheerio.load(page.data);
      const tableHtml = $('.competizione-classifica table tbody').children();

      const table = new Table();
      table.competition = competition!._id;
      table.itens = [];

      for (let j = 0; j < tableHtml.length; j++) {
        const item = this.runItemTable(tableHtml.eq(j), j + 1);
        if (item) table.itens.push(item);
      }

      await this.tableRepository.save(table);
    }
  }

  public runItemTable(tableHtml: any, position: number): ItemTable | null {
    const data = tableHtml.children();
    data.eq(0).children('span').remove();

    const item = new ItemTable();
    item.position = position;
    item.name = data.eq(0).text().trim();
    item.flag = FigcConstants.URL_DEFAULT + data.eq(0).find('img').attr('src').trim();
    item.points = Number(data.eq(1).text().trim());
    item.matches = Number(data.eq(2).text().trim());
    item.win = Number(data.eq(3).text().trim());
    item.draw = Number(data.eq(4).text().trim());
    item.lose = Number(data.eq(5).text().trim());
    item.goalsScored = Number(data.eq(14).text().trim());
    item.goalsAgainst = Number(data.eq(15).text().trim());
    item.goalsDifference = item.goalsScored - item.goalsAgainst;
    item.yellowCard = undefined;
    item.redCard = undefined;

    return item;
  }
}

export default FigcTableScraping;
