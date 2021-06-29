import DfbConstants from '../../constants/DfbConstants';
import ICompetitionDefault from '../../interfaces/ICompetitionDefault';
import ScrapingBasic from '../ScrapingBasic';

import { Competition } from '../../schemas/Competition';
import { Table } from '../../schemas/Table';
import ItemTable from '../../schemas/ItemTable';
import TableRepository from '../../repository/TableRepository';

export default class DfbTableScraping extends ScrapingBasic {
  private tableRepository: TableRepository;

  constructor(lastYear: boolean) {
    super(lastYear);

    this.tableRepository = new TableRepository();
  }

  public getTitle(): string {
    return 'DFB TABLE LEAGUE SCRAPING';
  }

  public getConstants(): any {
    return DfbConstants;
  }

  public async runCompetition(competitionDefault: ICompetitionDefault) {
    let $ = await this.getPageData(`${competitionDefault.code}/spieltagtabelle`);
    let seasons = $('select[name="seasons"]').children();

    let end = seasons.length;
    if (this.lastYear) end = 1;

    for (let i = 0; i < end; i++) {
      let numberSeason = seasons.eq(i).attr('value');
      let year = seasons.eq(i).text().split('/')[0];

      if (year >= 2000) {
        this.loadingCli.push(`Year ${year}`);

        let competition = await Competition.findOne({ code: competitionDefault.code, year });

        let $ = await this.getPageData(
          `${competitionDefault.code}/spieltagtabelle/?spieledb_path=/competitions/${competitionDefault.aux.number}/seasons/${numberSeason}/matchday&spieledb_path=%2Fcompetitions%2F${competitionDefault.aux.number}%2Fseasons%2F${numberSeason}%2Fmatchday%2Fcurrent`
        );

        let tableHtml = $('#tabular table tbody').children();

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
  }

  public runItemTable(tableHtml: any, position: number): ItemTable | null {
    let data = tableHtml.children();

    let item = new ItemTable();
    item.position = position;
    item.name = data.eq(2).text().trim();
    item.flag = data.eq(1).find('img').attr('src').trim();
    item.points = parseInt(data.eq(9).text().trim());
    item.matches = parseInt(data.eq(3).text().trim());
    item.win = parseInt(data.eq(4).text().trim());
    item.draw = parseInt(data.eq(5).text().trim());
    item.lose = parseInt(data.eq(6).text().trim());
    item.goalsScored = parseInt(data.eq(7).text().trim().split(':')[0]);
    item.goalsAgainst = parseInt(data.eq(7).text().trim().split(':')[1]);
    item.goalsDifference = item.goalsScored - item.goalsAgainst;
    item.yellowCard = undefined;
    item.redCard = undefined;

    return item;
  }
}
