import md5 from 'md5';
import moment from 'moment';

import CbfConstants from '@constants/CbfConstants';
import ICompetitionDefault from '@interfaces/ICompetitionDefault';

import { ICompetition } from '@schemas/Competition';
import { Round, IRound } from '@schemas/Round';
import Match from '@schemas/Match';
import TeamResult from '@schemas/TeamResult';

import CompetitionRepository from '@repository/CompetitionRepository';
import RoundRepository from '@repository/RoundRepository';

import ScrapingBasic from '../ScrapingBasic';

class CbfLeagueScraping extends ScrapingBasic {
  private competitionRepository: CompetitionRepository;
  private roundRepository: RoundRepository;

  constructor(lastYear: boolean) {
    super(lastYear);

    this.competitionRepository = new CompetitionRepository();
    this.roundRepository = new RoundRepository();
  }

  public getTitle(): string {
    return 'CBF LEAGUE SCRAPING';
  }

  public getConstants(): any {
    return CbfConstants;
  }

  public async runCompetition(competitionDefault: ICompetitionDefault) {
    let initial = 0;
    if (this.lastYear) initial = competitionDefault.years!.length - 1;

    for (let i = initial; i < competitionDefault.years!.length; i++) {
      this.loadingCli.push(`Year ${competitionDefault.years![i]}`);

      let competition = await this.createCompetition(competitionDefault, competitionDefault.years![i]);
      let $ = await this.getPageData(`${competition.code}/${competition.year}`);

      let section = $('.container section');
      let rounds = section.children().eq(1).children('aside').children('div').children();

      for (let j = 0; j < rounds.length; j++) {
        let roundResult = await this.runRound(rounds.eq(j), competition);
        competition.rounds.push(roundResult!._id);
      }

      await this.competitionRepository.save(competition);

      this.loadingCli.pop();
    }
  }

  public async runRound(roundHtml: any, competition: ICompetition): Promise<IRound | null> {
    let round = new Round();
    round.goals = 0;
    round.goalsHome = 0;
    round.goalsGuest = 0;
    round.number = roundHtml.children('header').children('h3').text().replace('Rodada ', '');
    round.matchs = [];
    round.competition = competition._id;
    round.hash = md5(competition.code + competition.year + round.number);

    this.loadingCli.push(`Round ${round.number}`);

    let matchsHtml = roundHtml.find('.list-unstyled').children();

    for (let i = 0; i < matchsHtml.length; i++) {
      let matchResult = await this.runMatch(matchsHtml.eq(i));

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
    let match = new Match();
    match.teamHome = new TeamResult();
    match.teamGuest = new TeamResult();

    matchHtml.find('.partida-desc').eq(0).find('.partida-desc').remove();

    let result = matchHtml.find('.partida-horario').children('span').text().split(' x ');
    let location = matchHtml.find('.partida-desc').eq(1).text().trim().replace(' Como foi o jogo', '').split(' - ');
    let date = matchHtml.find('.partida-desc').eq(0).text().trim().split(' - ')[0].split(',')[1].trim();

    match.date = moment.utc(date, 'DD/MM/YYYY HH:mm').format();
    match.stadium = location[0];
    match.location = location[1] + '/' + location[2];

    match.teamHome.initials = matchHtml.find('.time.pull-left').find('.time-sigla').text();
    match.teamHome.name = matchHtml.find('.time.pull-left').find('img').attr('alt');
    match.teamHome.flag = matchHtml.find('.time.pull-left').find('img').attr('src');
    match.teamHome.goals = result[0] == '' ? undefined : parseInt(result[0]);

    match.teamGuest.initials = matchHtml.find('.time.pull-right').find('.time-sigla').text();
    match.teamGuest.name = matchHtml.find('.time.pull-right').find('img').attr('alt');
    match.teamGuest.flag = matchHtml.find('.time.pull-right').find('img').attr('src');
    match.teamGuest.goals = result[1] == '' ? undefined : parseInt(result[1]);

    return match;
  }
}

export default CbfLeagueScraping;
