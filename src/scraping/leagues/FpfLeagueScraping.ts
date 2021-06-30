import md5 from 'md5';
import moment from 'moment';

import FpfConstants from '@constants/FpfConstants';
import Helpers from '@utils/Helpers';
import ICompetitionDefault from '@interfaces/ICompetitionDefault';

import { ICompetition } from '@schemas/Competition';
import { Round, IRound } from '@schemas/Round';
import Match from '@schemas/Match';
import TeamResult from '@schemas/TeamResult';
import CompetitionRepository from '@repository/CompetitionRepository';
import RoundRepository from '@repository/RoundRepository';

import ScrapingBasic from '../ScrapingBasic';

class FpfLeagueScraping extends ScrapingBasic {
  private competitionRepository: CompetitionRepository;
  private roundRepository: RoundRepository;

  constructor(lastYear: boolean) {
    super(lastYear);

    this.competitionRepository = new CompetitionRepository();
    this.roundRepository = new RoundRepository();
  }

  public getTitle(): string {
    return 'FPF LEAGUE SCRAPING';
  }

  public getConstants(): any {
    return FpfConstants;
  }

  public async runCompetition(competitionDefault: ICompetitionDefault) {
    let initial = 0;
    if (this.lastYear) initial = competitionDefault.years!.length - 1;

    for (let i = initial; i < competitionDefault.years!.length; i++) {
      const year = competitionDefault.years![i];
      const codeYear = year + (Number(year) + 1);
      const url = competitionDefault.aux.urls[i];

      this.loadingCli.push(`Year ${year}`);

      const competition = await Helpers.createCompetition(competitionDefault, `${year}`, FpfConstants);

      const $ = await this.getPageData(`jornada/${codeYear}/${url}`);
      const rounds = $('select[name="ddlMatchdays"]').children();

      for (let j = 0; j < rounds.length; j++) {
        if (rounds.eq(j).text().includes('Week')) {
          const roundResult = await this.runRound(rounds.eq(j), competition, url, codeYear);
          competition.rounds.push(roundResult!._id);
        }
      }

      await this.competitionRepository.save(competition);

      this.loadingCli.pop();
    }
  }

  public async runRound(roundHtml: any, competition: ICompetition, url: string, codeYear: string): Promise<IRound | null> {
    const number = Number(roundHtml.attr('value'));

    const round = new Round();
    round.goals = 0;
    round.goalsHome = 0;
    round.goalsGuest = 0;
    round.number = `${number}`;
    round.matchs = [];
    round.competition = competition._id;
    round.hash = md5(competition.code + competition.year + round.number);
    this.loadingCli.push(`Round ${round.number}`);

    const $ = await this.getPageData(`${FpfConstants.URL_DEFAULT}/jornada/${codeYear}/${url}/${number}`);
    const data = $('.container').eq(2).children('.tab-content').children().eq(0).children('div');
    const matches = data.children().eq(0).children();

    let date = '';
    for (let i = 1; i < matches.length - 1; i++) {
      if (matches.eq(i).hasClass('match-day')) {
        date = matches.eq(i).text().trim();
      } else {
        const matchResult = await this.runMatch(matches.eq(i), date);

        if (matchResult.teamGuest.goals && matchResult.teamHome.goals) {
          round.goals += matchResult.teamGuest.goals + matchResult.teamHome.goals;
          round.goalsGuest += matchResult.teamGuest.goals;
          round.goalsHome += matchResult.teamHome.goals;
        }

        round.matchs.push(matchResult);
      }
    }

    const result = await this.roundRepository.save(round);
    this.loadingCli.pop();
    return result;
  }

  public async runMatch(matchHtml: any, date: string): Promise<Match> {
    const match = new Match();
    match.teamHome = new TeamResult();
    match.teamGuest = new TeamResult();

    const data = matchHtml.children('div').children().eq(1).children();
    let result = null;

    if (matchHtml.children('div').children().eq(0).children().length === 2) {
      date = `${date.split(', ')[1]} ${data.eq(1).text().trim().replace('H', ':')}`;
    } else {
      result = data.eq(1).text().trim().split(' - ');
      date = `${date.split(', ')[1]} ${matchHtml.children('div').children().eq(0).children('.time').text().trim().replace('H', ':')}`;
    }

    match.date = moment.utc(date, 'DD MMMM YYYY HH:mm').format();
    match.stadium = '';
    match.location = '';

    match.teamHome.initials = '';
    match.teamHome.name = data.eq(0).children('.teams-name').text().trim();
    match.teamHome.flag = '';
    match.teamHome.goals = result === null ? undefined : Number(result[0]);

    match.teamGuest.initials = '';
    match.teamGuest.name = data.eq(2).children('.teams-name').text().trim();
    match.teamGuest.flag = '';
    match.teamGuest.goals = result === null ? undefined : Number(result[1]);

    return match;
  }
}

export default FpfLeagueScraping;
