import DfbConstants from '@constants/DfbConstants';
import ICompetitionDefault from '@interfaces/ICompetitionDefault';

import { Competition } from '@schemas/Competition';
import { Table } from '@schemas/Table';
import ItemTable from '@schemas/ItemTable';
import TableRepository from '@repository/TableRepository';
import ScrapingBasic from '../ScrapingBasic';

class DfbTableScraping extends ScrapingBasic {
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
    const $page = await this.getPageData(`${competitionDefault.code}/spieltagtabelle`);
    const seasons = $page('select[name="seasons"]').children();

    let end = seasons.length;
    if (this.lastYear) end = 1;

    for (let i = 0; i < end; i++) {
      const numberSeason = seasons.eq(i).attr('value');
      const year = seasons.eq(i).text().split('/')[0];

      if (year >= 2000) {
        this.loadingCli.push(`Year ${year}`);

        const competition = await Competition.findOne({
          code: competitionDefault.code,
          year,
        });

        const $ = await this.getPageData(
          `${competitionDefault.code}/spieltagtabelle/?spieledb_path=/competitions/${competitionDefault.aux.number}/seasons/${numberSeason}/matchday&spieledb_path=%2Fcompetitions%2F${competitionDefault.aux.number}%2Fseasons%2F${numberSeason}%2Fmatchday%2Fcurrent`
        );

        const tableHtml = $('#tabular table tbody').children();

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
  }

  public runItemTable(tableHtml: any, position: number): ItemTable | null {
    const data = tableHtml.children();

    const item = new ItemTable();
    item.position = position;
    item.name = data.eq(2).text().trim();
    item.flag = data.eq(1).find('img').attr('src').trim();
    item.points = Number(data.eq(9).text().trim());
    item.matches = Number(data.eq(3).text().trim());
    item.win = Number(data.eq(4).text().trim());
    item.draw = Number(data.eq(5).text().trim());
    item.lose = Number(data.eq(6).text().trim());
    item.goalsScored = Number(data.eq(7).text().trim().split(':')[0]);
    item.goalsAgainst = Number(data.eq(7).text().trim().split(':')[1]);
    item.goalsDifference = item.goalsScored - item.goalsAgainst;
    item.yellowCard = undefined;
    item.redCard = undefined;

    return item;
  }
}

export default DfbTableScraping;
