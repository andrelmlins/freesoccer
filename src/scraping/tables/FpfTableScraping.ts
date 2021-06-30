import axios from 'axios';
import https from 'https';
import cheerio from 'cheerio';

import FpfConstants from '@constants/FpfConstants';
import ICompetitionDefault from '@interfaces/ICompetitionDefault';

import { Competition } from '@schemas/Competition';
import { Table } from '@schemas/Table';
import ItemTable from '@schemas/ItemTable';
import TableRepository from '@repository/TableRepository';

class FpfTableScraping {
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
    console.log('-> FPF TABLE LEAGUE SCRAPING');

    await this.runCompetition(competition);
  }

  public async runCompetition(competitionDefault: ICompetitionDefault) {
    console.log(`\t-> ${competitionDefault.name}`);

    let initial = 0;
    if (this.lastYear) initial = competitionDefault.years!.length - 1;

    for (let i = initial; i < competitionDefault.years!.length; i++) {
      const year = competitionDefault.years![i];
      const codeYear = year + (Number(year) + 1);
      const url = competitionDefault.aux.urls[i];

      console.log(`\t\t-> ${year}`);

      const competition = await Competition.findOne({
        code: competitionDefault.code,
        year,
      });

      const page = await this.axios.get(`${FpfConstants.URL_DEFAULT}/classificacao/${codeYear}/${url}`);

      const $ = cheerio.load(page.data);
      const tableHtml = $('table#primeiraLiga tbody').children();

      const table = new Table();
      table.competition = competition!._id;
      table.itens = [];

      for (let j = 1; j < tableHtml.length; j++) {
        const item = this.runItemTable(tableHtml.eq(j), j + 1);
        if (item) table.itens.push(item);
      }

      await this.tableRepository.save(table);
    }
  }

  public runItemTable(tableHtml: any, position: number): ItemTable | null {
    const data = tableHtml.children();

    const item = new ItemTable();
    item.position = position;
    item.name = data.eq(2).text().trim();
    item.flag = '';
    item.points = Number(data.eq(19).text().trim());
    item.matches = Number(data.eq(3).text().trim());
    item.win = Number(data.eq(4).text().trim());
    item.draw = Number(data.eq(5).text().trim());
    item.lose = Number(data.eq(6).text().trim());
    item.goalsScored = Number(data.eq(15).text().trim());
    item.goalsAgainst = Number(data.eq(16).text().trim());
    item.goalsDifference = item.goalsScored - item.goalsAgainst;
    item.yellowCard = undefined;
    item.redCard = undefined;

    return item;
  }
}

export default FpfTableScraping;
