import md5 from 'md5';
import moment from 'moment';

import FaConstants from '@constants/FaConstants';
import ICompetitionDefault from '@interfaces/ICompetitionDefault';

import { ICompetition } from '@schemas/Competition';
import { Round, IRound } from '@schemas/Round';
import Match from '@schemas/Match';
import TeamResult from '@schemas/TeamResult';
import CompetitionRepository from '@repository/CompetitionRepository';
import RoundRepository from '@repository/RoundRepository';

import ScrapingBasicClient from '../ScrapingBasicClient';

class FaLeagueScraping extends ScrapingBasicClient {
  private competitionRepository: CompetitionRepository;
  private roundRepository: RoundRepository;

  constructor(lastYear: boolean) {
    super(lastYear);

    this.competitionRepository = new CompetitionRepository();
    this.roundRepository = new RoundRepository();
  }

  public getTitle(): string {
    return 'FA LEAGUE SCRAPING';
  }

  public getConstants(): any {
    return FaConstants;
  }

  public async runCompetition(competitionDefault: ICompetitionDefault) {
    const $ = await this.getPageDinamically('results', 'div[data-dropdown-block="compSeasons"] ul li');
    const seasons = $('div[data-dropdown-block="compSeasons"] ul').children();

    let end = seasons.length;
    if (this.lastYear) end = 1;

    for (let i = 0; i < end; i++) {
      const numberSeason = seasons.eq(i).attr('data-option-id');
      const year = Number(seasons.eq(i).text().split('/')[0]);

      if (year >= 2000) {
        this.loadingCli.push(`Year ${year}`);

        const competition = await this.createCompetition(competitionDefault, `${year}`);

        const $page = await this.getPageDinamicallyScroll(`results?co=${competitionDefault.aux.code}&se=${numberSeason}`);

        if (i === 0) {
          const $fixtures = await this.getPageDinamicallyScroll('fixtures');
          const roundsFixtures = $fixtures('.fixtures').children();
          for (let j = 0; j < roundsFixtures.length; j++) {
            $('.fixtures').prepend(roundsFixtures.eq(i).html());
          }
        }

        const rounds = $page('.fixtures').children();

        const roundsResult = await this.runRound(rounds, competition);
        competition.rounds = roundsResult!;

        await this.competitionRepository.save(competition);

        this.loadingCli.pop();
      }
    }
  }

  public async runRound(roundsHtml: any, competition: ICompetition): Promise<IRound[] | null> {
    const rounds: IRound[] = [];
    let countMatches = 0;

    for (let i = 0; i < roundsHtml.length; i++) {
      if (!roundsHtml.eq(i).attr('datetime')) {
        countMatches += roundsHtml.eq(i).children().eq(1).children().length;
      }
    }

    const countRounds = Math.round(countMatches / 10);
    let j = 0;

    for (let i = 0; i < countRounds; i++) {
      const round: IRound = new Round();
      round.goals = 0;
      round.goalsHome = 0;
      round.goalsGuest = 0;
      round.number = `${countRounds - i}`;
      round.matchs = [];
      round.competition = competition._id;
      round.hash = md5(competition.code + competition.year + round.number);
      this.loadingCli.push(`Round ${round.number}`);

      let matchesCount = 0;
      let date = '';

      for (j; j < roundsHtml.length; j++) {
        if (roundsHtml.eq(j).attr('datetime')) {
          if (date === '') date = roundsHtml.eq(j).text().trim().split(' ').slice(1).join(' ');
        } else {
          const matches = roundsHtml.eq(j).children().eq(1).children();
          matchesCount += matches.length;

          for (let k = 0; k < matches.length; k++) {
            const matchResult = await this.runMatch(matches.eq(k), date);

            if (matchResult.teamGuest.goals && matchResult.teamHome.goals) {
              round.goals += matchResult.teamGuest.goals + matchResult.teamHome.goals;
              round.goalsGuest += matchResult.teamGuest.goals;
              round.goalsHome += matchResult.teamHome.goals;
            }
            round.matchs.push(matchResult);
          }

          if (matchesCount >= 10) break;
        }
      }

      rounds.push((await this.roundRepository.save(round))!);

      this.loadingCli.pop();
    }

    return rounds;
  }

  public async runMatch(matchHtml: any, date: string): Promise<Match> {
    const match = new Match();
    match.teamHome = new TeamResult();
    match.teamGuest = new TeamResult();

    const data = matchHtml.find('.overview').children();
    const location = matchHtml.eq(1).text().split(', ');

    match.date = moment.utc(`${date} 00:00`, 'DD MMMM YYYY HH:mm').toDate();
    match.stadium = location[0];
    match.location = location[1];

    const dataResult = data.eq(0).children();
    const result = dataResult.eq(1).text().trim().split('-');

    match.teamHome.initials = '';
    match.teamHome.name = dataResult.eq(0).text().trim();
    match.teamHome.flag = '';
    match.teamHome.goals = result.length < 2 ? undefined : Number(result[0]);

    match.teamGuest.initials = '';
    match.teamGuest.name = dataResult.eq(2).text().trim();
    match.teamGuest.flag = '';
    match.teamGuest.goals = result.length < 2 ? undefined : Number(result[1]);

    return match;
  }
}

export default FaLeagueScraping;
