import axios from 'axios';
import cheerio from 'cheerio';

import FaConstants from '../../constants/FaConstants';
import Helpers from '../../utils/Helpers';
import ICompetitionDefault from '../../interfaces/ICompetitionDefault';

import { Competition } from '../../schemas/Competition';
import { Table } from '../../schemas/Table';
import ItemTable from '../../schemas/ItemTable';

export default class FaTableScraping {
  public lastYear: boolean;

  constructor(lastYear: boolean) {
    this.lastYear = lastYear;
  }

  public async run(competition: ICompetitionDefault) {
    console.log('-> FA TABLE LEAGUE SCRAPING');

    //await this.runCompetition(competition)
  }
}
