import * as request from 'request-promise-any';
import * as cheerio from 'cheerio';

import DfbConstants from '../constants/DfbConstants';
import Helpers from '../utils/Helpers';
import ICompetitionDefault from '../interfaces/ICompetitionDefault';

import { Competition } from '../schemas/Competition';
import { Table } from '../schemas/Table';
import ItemTable from '../schemas/ItemTable';

export default class DfbTableScraping {
    constructor() {
        
    }

    public async run(competition: ICompetitionDefault) {
        console.log("-> DFB TABLE LEAGUE SCRAPING");

        await this.runCompetition(competition)
    }

    public async runCompetition(competitionDefault: ICompetitionDefault) {
        console.log("\t-> "+competitionDefault.name);
        
        let pageSeason = await request({
            url: DfbConstants.URL_DEFAULT+"/"+competitionDefault.code+"/spieltagtabelle",
            rejectUnauthorized: false
        });
        
        let $ = cheerio.load(pageSeason);
        let seasons = $("select[name='seasons']").children();

        for(let i = 0; i <= seasons.length; i++) {
            let numberSeason = seasons.eq(i).attr("value");
            let year = parseInt(seasons.eq(i).text().split("/")[0]);
            
            if(year>=2000) {
                console.log("\t\t-> "+year);

                let competition = await Competition.findOne({"code":competitionDefault.code,"year":year});
                
                let page = await request({
                    url: DfbConstants.URL_DEFAULT+"/"+competitionDefault.code+"/spieltagtabelle/?spieledb_path=/competitions/"+competitionDefault.aux.number+"/seasons/"+numberSeason+"/matchday&spieledb_path=%2Fcompetitions%2F"+competitionDefault.aux.number+"%2Fseasons%2F"+numberSeason+"%2Fmatchday%2Fcurrent",
                    rejectUnauthorized: false
                });
                
                let $ = cheerio.load(page);
                let tableHtml = $("table.data-table tbody").children();
                
                let table = new Table;
                table.competition = competition!._id;
                table.itens = [];

                for(let j = 0; j < tableHtml.length; j++){
                    let item = this.runItemTable(tableHtml.eq(j),j+1);
                    if(item) table.itens.push(item);
                }

                await Helpers.replaceTable(table);
            }
        }
    }

    public runItemTable(tableHtml:any, position: number): ItemTable | null {
        let data = tableHtml.children();

        let item = new ItemTable;
        item.position = position;
        item.name = data.eq(2).text().trim();
        item.flag = data.eq(1).find("img").attr("src").trim();
        item.points = parseInt(data.eq(9).text().trim());
        item.matches = parseInt(data.eq(3).text().trim());
        item.win = parseInt(data.eq(4).text().trim());
        item.draw = parseInt(data.eq(5).text().trim());
        item.lose = parseInt(data.eq(6).text().trim());
        item.goalsScored = parseInt(data.eq(7).text().trim().split(":")[0]);
        item.goalsAgainst = parseInt(data.eq(7).text().trim().split(":")[1]);
        item.goalsDifference = item.goalsScored-item.goalsAgainst;
        item.yellowCard = undefined;
        item.redCard = undefined;

        return item;
    }
}