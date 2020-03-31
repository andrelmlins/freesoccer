import axios from 'axios';
import cheerio from 'cheerio';
import md5 from 'md5';
import moment from 'moment';

import DfbConstants from '../../constants/DfbConstants';
import Helpers from '../../utils/Helpers';
import ICompetitionDefault from '../../interfaces/ICompetitionDefault';

import { ICompetition } from '../../schemas/Competition';
import { Round, IRound } from '../../schemas/Round';
import Match from '../../schemas/Match';
import TeamResult from '../../schemas/TeamResult';
import CompetitionRepository from '../../repository/CompetitionRepository';
import RoundRepository from '../../repository/RoundRepository';

export default class DfbLeagueScraping {
  public lastYear: boolean;
  private competitionRepository: CompetitionRepository;
  private roundRepository: RoundRepository;

  constructor(lastYear: boolean) {
    this.lastYear = lastYear;
    this.competitionRepository = new CompetitionRepository();
    this.roundRepository = new RoundRepository();
  }

  public async run(competition: ICompetitionDefault) {
    console.log('-> DFB LEAGUE SCRAPING');

    await this.runCompetition(competition);
  }

  public async runCompetition(competitionDefault: ICompetitionDefault) {
    console.log('\t-> ' + competitionDefault.name);

    let pageSeason = await axios.get(DfbConstants.URL_DEFAULT + '/' + competitionDefault.code + '/spieltagtabelle');

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
        let competition = await Helpers.createCompetition(competitionDefault, year + '', DfbConstants);

        let page = await axios.get(
          DfbConstants.URL_DEFAULT +
            '/' +
            competitionDefault.code +
            '/spieltagtabelle?spieledb_path=%2Fcompetitions%2F' +
            competitionDefault.aux.number +
            '%2Fseasons%2F' +
            numberSeason +
            '%2Fmatchday'
        );

        let $ = cheerio.load(page.data);
        let rounds = $('select[name="matchdays"]').children();

        for (let j = 0; j < rounds.length; j++) {
          if (
            rounds
              .eq(j)
              .text()
              .includes('Spieltag ')
          ) {
            let roundResult = await this.runRound(rounds.eq(j), competition, competitionDefault, numberSeason);
            competition.rounds.push(roundResult!._id);
          }
        }

        await this.competitionRepository.save(competition);
      }
    }
  }

  public async runRound(roundHtml: any, competition: ICompetition, competitionDefault: ICompetitionDefault, codeyear: string): Promise<IRound | null> {
    let number = parseInt(roundHtml.attr('value'));

    let round = new Round();
    round.goals = 0;
    round.goalsHome = 0;
    round.goalsGuest = 0;
    round.number = number + '';
    round.matchs = [];
    round.competition = competition._id;
    round.hash = md5(competition.code + competition.year + round.number);
    console.log('\t\t\t-> Round ' + round.number);

    let page = await axios.get(
      DfbConstants.URL_DEFAULT +
        '/' +
        competitionDefault.code +
        '/spieltagtabelle/?spieledb_path=/competitions/' +
        competitionDefault.aux.number +
        '/seasons/' +
        codeyear +
        '/matchday&spieledb_path=%2Fcompetitions%2F' +
        competitionDefault.aux.number +
        '%2Fseasons%2F' +
        codeyear +
        '%2Fmatchday%2F' +
        number
    );

    let $ = cheerio.load(page.data);
    let matches = $('.table-match-comparison')
      .children('tbody')
      .children();

    for (let i = 0; i < matches.length; i++) {
      let matchResult = await this.runMatch(matches.eq(i));

      if (matchResult.teamGuest.goals && matchResult.teamHome.goals) {
        round.goals += matchResult.teamGuest.goals + matchResult.teamHome.goals;
        round.goalsGuest += matchResult.teamGuest.goals;
        round.goalsHome += matchResult.teamHome.goals;
      }

      round.matchs.push(matchResult);
    }

    return await this.roundRepository.save(round);
  }

  public async runMatch(matchHtml: any): Promise<Match> {
    let match = new Match();
    match.teamHome = new TeamResult();
    match.teamGuest = new TeamResult();

    let data = matchHtml.children();

    let result = data
      .eq(3)
      .text()
      .trim()
      .split(' : ');

    if (
      data
        .eq(0)
        .children('em')
        .text()
    ) {
      let date = data
        .eq(0)
        .children('em')
        .text();
      date = date.split(' ~ ')[0] + date.split(' ~ ')[1].split('.')[2] + ' 00:00';
      match.date = date;
    } else {
      let date = data
        .eq(0)
        .html()
        .split('<br>');

      if (date.length > 2) {
        date = date[1].trim() + ' ' + date[2].split(' ')[0].trim();
        match.date = moment.utc(date, 'DD.MM.YYYY HH:mm').format();
      } else {
        date = date[1].trim();
        match.date = moment.utc(date, 'DD.MM.YYYY').format();
      }
    }

    match.stadium = '';
    match.location = '';

    match.teamHome.initials = '';
    match.teamHome.name = data
      .eq(1)
      .text()
      .trim();
    match.teamHome.flag = data
      .eq(2)
      .children('img')
      .attr('src');
    match.teamHome.goals = result[0] == '-' ? undefined : parseInt(result[0]);

    match.teamGuest.initials = '';
    match.teamGuest.name = data
      .eq(5)
      .text()
      .trim();
    match.teamGuest.flag = data
      .eq(4)
      .children('img')
      .attr('src');
    match.teamGuest.goals = result[1] == '-' ? undefined : parseInt(result[1]);

    return match;
  }
}
