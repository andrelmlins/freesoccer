import axios from 'axios';
import cheerio from 'cheerio';

import RfefConstants from '@constants/RfefConstants';
import ICompetitionDefault from '@interfaces/ICompetitionDefault';

import { Competition, ICompetition } from '@schemas/Competition';
import { Table } from '@schemas/Table';
import ItemTable from '@schemas/ItemTable';
import TableRepository from '@repository/TableRepository';

export default class RfefTableScraping {
  public lastYear: boolean;
  private tableRepository: TableRepository;

  constructor(lastYear: boolean) {
    this.lastYear = lastYear;
    this.tableRepository = new TableRepository();
  }

  public async run(competition: ICompetitionDefault) {
    console.log('-> RFEF TABLE LEAGUE SCRAPING');

    await this.runCompetition(competition);
  }

  public async runCompetition(competitionDefault: ICompetitionDefault) {
    console.log(`\t-> ${competitionDefault.name}`);

    let initial = 0;
    if (this.lastYear) initial = competitionDefault.years!.length - 1;

    for (let i = initial; i < competitionDefault.years!.length; i++) {
      console.log(`\t\t-> ${competitionDefault.years![i]}`);

      const year = (Number(competitionDefault.years![i]) - 1).toString();
      const competition = await Competition.findOne({
        code: competitionDefault.code,
        year,
      });

      const page = await axios.get(`${RfefConstants.URL_DEFAULT + competitionDefault.aux.url}/clasificaciones?t=${competitionDefault.years![i]}`);

      const $ = cheerio.load(page.data);
      const list = $('.postcontent').find('.content').children('.container-fluid');

      for (let j = 0; j < list.length; j++) {
        if (list.eq(j).children('div').children().eq(0).text().trim().includes(competitionDefault.aux.name)) {
          const rounds = list.eq(j).children('div').children().eq(1).children('div').children('ul').children();

          await this.runTable(rounds.eq(0), competition!, competitionDefault.aux.url);
          break;
        }
      }
    }
  }

  public async runTable(roundHtml: any, competition: ICompetition, url: string) {
    const route = roundHtml.children('a').attr('href');

    const table = new Table();
    table.competition = competition!._id;
    table.itens = [];

    const page = await axios.get(`${RfefConstants.URL_DEFAULT + url}/${route}`);
    const $ = cheerio.load(page.data);
    const tableHtml = $('.postcontent').find('.content').find('table').find('tbody').children();

    for (let j = 0; j < tableHtml.length; j++) {
      const item = this.runItemTable(tableHtml.eq(j), j + 1);
      if (item) table.itens.push(item);
    }

    await this.tableRepository.save(table);
  }

  public runItemTable(tableHtml: any, position: number): ItemTable | null {
    const data = tableHtml.children();

    const item = new ItemTable();
    item.position = position;
    item.name = data.eq(1).text().trim();
    item.flag = '';
    item.points = Number(data.eq(2).text().trim());
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
