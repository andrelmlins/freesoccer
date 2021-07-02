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
import TextClear from '@utils/TextClear';

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
    const $ = await this.getPageData(competitionDefault.code);
    const years = $('#years').children();

    let end = years.length;
    if (this.lastYear) end = 1;

    for (let i = 0; i < end; i++) {
      const year = years.eq(i).text();
      this.loadingCli.push(`Year ${year}`);

      const competition = await this.createCompetition(competitionDefault, year);
      const $page = await this.getPageData(`${competition.code}/${competition.year}`);

      const section = $page('.aside-rodadas .swiper-wrapper');
      const rounds = section.children();

      for (let j = 0; j < rounds.length; j++) {
        const roundResult = await this.runRound(rounds.eq(j), competition);
        competition.rounds.push(roundResult!._id);
      }

      await this.competitionRepository.save(competition);

      this.loadingCli.pop();
    }
  }

  public async runRound(roundHtml: any, competition: ICompetition): Promise<IRound | null> {
    const round = new Round();
    round.goals = 0;
    round.goalsHome = 0;
    round.goalsGuest = 0;
    round.number = TextClear.full(roundHtml.children('.aside-header').text().replace('Rodada ', ''));
    round.matchs = [];
    round.competition = competition._id;
    round.hash = md5(`${competition.code}${competition.year}${round.number}`);
    this.loadingCli.push(`Round ${round.number}`);

    const matchsHtml = roundHtml.find('.list-unstyled').children();

    for (let i = 0; i < matchsHtml.length; i++) {
      const matchResult = await this.runMatch(matchsHtml.eq(i));

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

    matchHtml.find('.partida-desc').eq(0).find('.partida-desc').remove();

    const result = matchHtml.find('.partida-horario').children('span').text().split(' x ');
    const location = matchHtml.find('.partida-desc').eq(1).text().trim().replace(' Como foi o jogo', '').split(' - ');
    const dateDescription = matchHtml.find('.partida-desc').eq(0).text().trim().split(' - ')[0];

    if (!dateDescription.toLowerCase().includes('definir')) {
      match.date = moment.utc(dateDescription.split(',')[1].trim(), 'DD/MM/YYYY HH:mm').toDate();
    }

    match.stadium = TextClear.full(location[0]);
    match.location = TextClear.full(`${location[1]}/${location[2]}`);

    match.teamHome.initials = matchHtml.find('.time.pull-left').find('.time-sigla').text();
    match.teamHome.name = matchHtml.find('.time.pull-left').find('img').attr('alt');
    match.teamHome.flag = matchHtml.find('.time.pull-left').find('img').attr('src');
    match.teamHome.goals = result[0] === '' ? undefined : Number(result[0]);

    match.teamGuest.initials = matchHtml.find('.time.pull-right').find('.time-sigla').text();
    match.teamGuest.name = matchHtml.find('.time.pull-right').find('img').attr('alt');
    match.teamGuest.flag = matchHtml.find('.time.pull-right').find('img').attr('src');
    match.teamGuest.goals = result[1] === '' ? undefined : Number(result[1]);

    return match;
  }
}

export default CbfLeagueScraping;
