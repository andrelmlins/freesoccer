import CbfConstants from '@constants/CbfConstants';
import ICompetitionDefault from '@interfaces/ICompetitionDefault';

import { Competition } from '@schemas/Competition';
import { Table } from '@schemas/Table';
import ItemTable from '@schemas/ItemTable';
import TableRepository from '@repository/TableRepository';
import ScrapingBasic from '../ScrapingBasic';

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

      const competition = await Competition.findOne({
        code: competitionDefault.code,
        year: competitionDefault.years![i],
      });

      const $ = await this.getPageData(`${competition!.code}/${competition!.year}`);

      const section = $('.container section');
      const tableHtml = section.children().eq(0).children('table').children('tbody').children();

      const table = new Table();
      table.competition = competition!._id;
      table.itens = [];

      for (let j = 0; j < tableHtml.length; j++) {
        const item = this.runItemTable(tableHtml.eq(j), j + 1);
        if (item) table.itens.push(item);
      }

      await this.tableRepository.save(table);

      this.loadingCli.pop();
    }
  }

  public runItemTable(tableHtml: any, position: number): ItemTable | null {
    const data = tableHtml.children();

    if (data.length > 1) {
      const item = new ItemTable();
      item.position = position;
      item.name = data.eq(0).children().last().text().trim();
      item.flag = data.eq(0).children('img').attr('src').trim();
      item.points = Number(data.eq(1).text().trim());
      item.matches = Number(data.eq(2).text().trim());
      item.win = Number(data.eq(3).text().trim());
      item.draw = Number(data.eq(4).text().trim());
      item.lose = Number(data.eq(5).text().trim());
      item.goalsScored = Number(data.eq(6).text().trim());
      item.goalsAgainst = Number(data.eq(7).text().trim());
      item.goalsDifference = Number(data.eq(8).text().trim());
      item.yellowCard = Number(data.eq(9).text().trim());
      item.redCard = Number(data.eq(10).text().trim());

      return item;
    }

    return null;
  }
}
