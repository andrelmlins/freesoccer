import axios from 'axios';
import https from 'https';
import cheerio from 'cheerio';

import FffConstants from '@constants/FffConstants';
import ICompetitionDefault from '@interfaces/ICompetitionDefault';

import { Competition } from '@schemas/Competition';
import { Table } from '@schemas/Table';
import ItemTable from '@schemas/ItemTable';
import TableRepository from '@repository/TableRepository';

class FffTableScraping {
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
    console.log('-> FFF TABLE LEAGUE SCRAPING');

    await this.runCompetition(competition);
  }

  public async runCompetition(competitionDefault: ICompetitionDefault) {
    console.log(`\t-> ${competitionDefault.name}`);

    const pageSeason = await this.axios.get(`${FffConstants.URL_DEFAULT}/${competitionDefault.code}/classement`);

    const $page = cheerio.load(pageSeason.data);
    const seasons = $page('select[name="saison"]').children();

    let end = seasons.length;
    if (this.lastYear) end = 1;

    for (let i = 0; i < end; i++) {
      const numberSeason = Number(seasons.eq(i).attr('value'));

      if (numberSeason >= FffConstants.START_SEASON) {
        const year = seasons.eq(i).text().split('/')[0];

        console.log(`\t\t-> ${year}`);

        const competition = await Competition.findOne({
          code: competitionDefault.code,
          year,
        });

        const page = await this.axios.get(`${FffConstants.URL_DEFAULT}/${competitionDefault.code}/classement?sai=${numberSeason}`);

        const $ = cheerio.load(page.data);
        const tableHtml = $('#liste_classement table tbody').children();

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
  }

  public runItemTable(tableHtml: any, position: number): ItemTable | null {
    const data = tableHtml.children();

    const item = new ItemTable();
    item.position = position;
    item.name = data.eq(2).text().trim();
    item.flag = FffConstants.URL_DEFAULT + data.eq(2).find('img').attr('src').trim();
    item.points = Number(data.eq(10).text().trim());
    item.matches = Number(data.eq(3).text().trim());
    item.win = Number(data.eq(4).text().trim());
    item.draw = Number(data.eq(5).text().trim());
    item.lose = Number(data.eq(6).text().trim());
    item.goalsScored = Number(data.eq(7).text().trim());
    item.goalsAgainst = Number(data.eq(8).text().trim());
    item.goalsDifference = item.goalsScored - item.goalsAgainst;
    item.yellowCard = undefined;
    item.redCard = undefined;

    return item;
  }
}

export default FffTableScraping;
