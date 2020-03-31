import axios from 'axios';
import cheerio from 'cheerio';

import DfbConstants from '../../constants/DfbConstants';
import ICompetitionDefault from '../../interfaces/ICompetitionDefault';

import { Competition } from '../../schemas/Competition';
import { Table } from '../../schemas/Table';
import ItemTable from '../../schemas/ItemTable';
import TableRepository from '../../repository/TableRepository';

export default class DfbTableScraping {
  public lastYear: boolean;
  private tableRepository: TableRepository;

  constructor(lastYear: boolean) {
    this.lastYear = lastYear;
    this.tableRepository = new TableRepository();
  }

  public async run(competition: ICompetitionDefault) {
    console.log('-> DFB TABLE LEAGUE SCRAPING');

    await this.runCompetition(competition);
  }

  public async runCompetition(competitionDefault: ICompetitionDefault) {
    console.log('\t-> ' + competitionDefault.name);

    let pageSeason = await axios.get(`${DfbConstants.URL_DEFAULT}/${competitionDefault.code}/spieltagtabelle`);

    let $ = cheerio.load(pageSeason.data);
    let seasons = $('select[name="seasons"]').children();

    let end = seasons.length;
    if (this.lastYear) end = 1;

    for (let i = 0; i < end; i++) {
      let numberSeason = seasons.eq(i).attr('value');
      let year = parseInt(
        seasons
          .eq(i)
          .text()
          .split('/')[0]
      );

      if (year >= 2000) {
        console.log('\t\t-> ' + year);

        let competition = await Competition.findOne({ code: competitionDefault.code, year: year });

        let page = await axios.get(
          DfbConstants.URL_DEFAULT +
            '/' +
            competitionDefault.code +
            '/spieltagtabelle/?spieledb_path=/competitions/' +
            competitionDefault.aux.number +
            '/seasons/' +
            numberSeason +
            '/matchday&spieledb_path=%2Fcompetitions%2F' +
            competitionDefault.aux.number +
            '%2Fseasons%2F' +
            numberSeason +
            '%2Fmatchday%2Fcurrent'
        );

        let $ = cheerio.load(page.data);
        let tableHtml = $('#tabular table tbody').children();

        let table = new Table();
        table.competition = competition!._id;
        table.itens = [];

        for (let j = 0; j < tableHtml.length; j++) {
          let item = this.runItemTable(tableHtml.eq(j), j + 1);
          if (item) table.itens.push(item);
        }

        await this.tableRepository.save(table);
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
    item.flag = data
      .eq(1)
      .find('img')
      .attr('src')
      .trim();
    item.points = parseInt(
      data
        .eq(9)
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
        .split(':')[0]
    );
    item.goalsAgainst = parseInt(
      data
        .eq(7)
        .text()
        .trim()
        .split(':')[1]
    );
    item.goalsDifference = item.goalsScored - item.goalsAgainst;
    item.yellowCard = undefined;
    item.redCard = undefined;

    return item;
  }
}
