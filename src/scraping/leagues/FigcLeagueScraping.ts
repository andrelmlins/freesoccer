import md5 from 'md5';
import moment from 'moment';

import FigcConstants from '@constants/FigcConstants';
import ICompetitionDefault from '@interfaces/ICompetitionDefault';

import { ICompetition } from '@schemas/Competition';
import { Round, IRound } from '@schemas/Round';
import Match from '@schemas/Match';
import TeamResult from '@schemas/TeamResult';
import CompetitionRepository from '@repository/CompetitionRepository';
import RoundRepository from '@repository/RoundRepository';

import ScrapingBasic from '../ScrapingBasic';

class FigcLeagueScraping extends ScrapingBasic {
  private competitionRepository: CompetitionRepository;
  private roundRepository: RoundRepository;

  constructor(lastYear: boolean) {
    super(lastYear);

    this.competitionRepository = new CompetitionRepository();
    this.roundRepository = new RoundRepository();
  }

  public getTitle(): string {
    return 'FIGC LEAGUE SCRAPING';
  }

  public getConstants(): any {
    return FigcConstants;
  }

  public async runCompetition(competitionDefault: ICompetitionDefault) {
    let initial = 0;
    if (this.lastYear) initial = competitionDefault.years!.length - 1;

    for (let i = initial; i < competitionDefault.years!.length; i++) {
      this.loadingCli.push(`Year ${competitionDefault.years![i]}`);

      const competition = await this.createCompetition(competitionDefault, competitionDefault.years![i]);

      let newYear = `${Number(competition.year.substring(2, 4)) + 1}`;
      if (newYear.length === 1) newYear = `0${newYear}`;

      const year = `${competition.year}-${newYear}`;

      const $ = await this.getPageData(`${competitionDefault.aux.url}/calendario-e-risultati/${year}/UNICO/UNI/1`);
      const data = $('#menu-giornate').children();

      for (let j = 0; j < 2; j++) {
        const rounds = data.eq(j).children();

        for (let k = 1; k < rounds.length; k++) {
          const roundResult = await this.runRound(rounds.eq(k), competition, competitionDefault, year);
          competition.rounds.push(roundResult!._id);
        }
      }

      await this.competitionRepository.save(competition);

      this.loadingCli.pop();
    }
  }

  public async runRound(roundHtml: any, competition: ICompetition, competitionDefault: any, year: string): Promise<IRound | null> {
    const number = Number(roundHtml.text().trim());

    const round = new Round();
    round.goals = 0;
    round.goalsHome = 0;
    round.goalsGuest = 0;
    round.number = `${number}`;
    round.matchs = [];
    round.competition = competition._id;
    round.hash = md5(competition.code + competition.year + round.number);

    this.loadingCli.push(`Round ${round.number}`);

    const $ = await this.getPageData(`${competitionDefault.aux.url}/calendario-e-risultati/${year}/UNICO/UNI/${number}`);
    const matches = $('.risultati').children();

    for (let i = 1; i < matches.length; i++) {
      const matchResult = await this.runMatch(matches.eq(i));

      if (matchResult.teamGuest.goals && matchResult.teamHome.goals) {
        round.goals += matchResult.teamGuest.goals + matchResult.teamHome.goals;
        round.goalsGuest += matchResult.teamGuest.goals;
        round.goalsHome += matchResult.teamHome.goals;
      }

      round.matchs.push(matchResult);
    }

    const result = await this.roundRepository.save(round);
    this.loadingCli.pop();
    return result;
  }

  public async runMatch(matchHtml: any): Promise<Match> {
    const match = new Match();
    match.teamHome = new TeamResult();
    match.teamGuest = new TeamResult();

    const data = matchHtml.children();
    let date = data.eq(0).children('p').children('span').text().trim();
    if (date.length < 16) date += ' 00:00';

    let location = data.eq(0).children('p').html().split('</span>')[1].split('<br>')[1].replace('Stadium: ', '').trim();
    location = location.split('(');

    match.date = moment.utc(date, 'DD/MM/YYYY HH:mm').toDate();
    match.stadium = location[0].trim();
    match.location = location[1] ? location[1].replace(')', '').trim() : '';

    match.teamHome.initials = '';
    match.teamHome.name = data.eq(1).children('.nomesquadra').text().trim();
    match.teamHome.flag = FigcConstants.URL_DEFAULT + data.eq(1).children('img').attr('src');
    match.teamHome.goals = data.eq(1).children('span').text().trim() === '-' ? undefined : Number(data.eq(1).children('span').text().trim());

    match.teamGuest.initials = '';
    match.teamGuest.name = data.eq(2).children('.nomesquadra').text().trim();
    match.teamGuest.flag = FigcConstants.URL_DEFAULT + data.eq(2).children('img').attr('src');
    match.teamGuest.goals = data.eq(2).children('span').text().trim() === '-' ? undefined : Number(data.eq(2).children('span').text().trim());

    return match;
  }
}

export default FigcLeagueScraping;
