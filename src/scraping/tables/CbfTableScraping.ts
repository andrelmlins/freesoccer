import CbfConstants from '@constants/CbfConstants';
import ICompetitionDefault from '@interfaces/ICompetitionDefault';
import ScrapingBasic from '../ScrapingBasic';

import { Competition } from '@schemas/Competition';
import { Table } from '@schemas/Table';
import ItemTable from '@schemas/ItemTable';
import TableRepository from '@repository/TableRepository';

export default class CbfTableScraping extends ScrapingBasic {
  private tableRepository: TableRepository;

  constructor(lastYear: boolean) {
    super(lastYear);

    this.tableRepository = new TableRepository();
  }

  public getTitle(): string {
    return 'CBF TABLE LEAGUE SCRAPING';
  }

  public getConstants(): any {
    return CbfConstants;
  }

  public async runCompetition(competitionDefault: ICompetitionDefault) {
    let initial = 0;
    if (this.lastYear) initial = competitionDefault.years!.length - 1;

    for (let i = initial; i < competitionDefault.years!.length; i++) {
      this.loadingCli.push(`Year ${competitionDefault.years![i]}`);

      let competition = await Competition.findOne({ code: competitionDefault.code, year: competitionDefault.years![i] });

      let $ = await this.getPageData(`${competition!.code}/${competition!.year}`);

      let section = $('.container section');
      let tableHtml = section.children().eq(0).children('table').children('tbody').children();

      let table = new Table();
      table.competition = competition!._id;
      table.itens = [];

      for (let j = 0; j < tableHtml.length; j++) {
        let item = this.runItemTable(tableHtml.eq(j), j + 1);
        if (item) table.itens.push(item);
      }

      await this.tableRepository.save(table);

      this.loadingCli.pop();
    }
  }

  public runItemTable(tableHtml: any, position: number): ItemTable | null {
    let data = tableHtml.children();

    if (data.length > 1) {
      let item = new ItemTable();
      item.position = position;
      item.name = data.eq(0).children().last().text().trim();
      item.flag = data.eq(0).children('img').attr('src').trim();
      item.points = parseInt(data.eq(1).text().trim());
      item.matches = parseInt(data.eq(2).text().trim());
      item.win = parseInt(data.eq(3).text().trim());
      item.draw = parseInt(data.eq(4).text().trim());
      item.lose = parseInt(data.eq(5).text().trim());
      item.goalsScored = parseInt(data.eq(6).text().trim());
      item.goalsAgainst = parseInt(data.eq(7).text().trim());
      item.goalsDifference = parseInt(data.eq(8).text().trim());
      item.yellowCard = parseInt(data.eq(9).text().trim());
      item.redCard = parseInt(data.eq(10).text().trim());

      return item;
    }

    return null;
  }
}
