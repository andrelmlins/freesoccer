import md5 from 'md5';
import moment from 'moment';

import FffConstants from '@constants/FffConstants';
import ICompetitionDefault from '@interfaces/ICompetitionDefault';

import { ICompetition } from '@schemas/Competition';
import { Round, IRound } from '@schemas/Round';
import Match from '@schemas/Match';
import TeamResult from '@schemas/TeamResult';
import CompetitionRepository from '@repository/CompetitionRepository';
import RoundRepository from '@repository/RoundRepository';

import ScrapingBasic from '../ScrapingBasic';

class FffLeagueScraping extends ScrapingBasic {
  private competitionRepository: CompetitionRepository;
  private roundRepository: RoundRepository;

  constructor(lastYear: boolean) {
    super(lastYear);

    this.competitionRepository = new CompetitionRepository();
    this.roundRepository = new RoundRepository();
  }

  public getTitle(): string {
    return 'FFF LEAGUE SCRAPING';
  }

  public getConstants(): any {
    return FffConstants;
  }

  public async runCompetition(competitionDefault: ICompetitionDefault) {
    let $ = await this.getPageData(`${competitionDefault.code}/calendrier_resultat`);
    let seasons = $('select[name="saison"]').children();

    let end = seasons.length;
    if (this.lastYear) end = 1;

    for (let i = 0; i < end; i++) {
      let numberSeason = parseInt(seasons.eq(i).attr('value'));

      if (numberSeason >= FffConstants.START_SEASON) {
        let year = parseInt(seasons.eq(i).text().split('/')[0]);

        this.loadingCli.push(`Year ${competitionDefault.years![i]}`);

        let competition = await this.createCompetition(competitionDefault, year + '');

        let $ = await this.getPageData(`${competitionDefault.code}/calendrier_resultat?sai=${numberSeason}`);
        let rounds = $('select[name="journee"]').children();

        for (let j = 0; j < rounds.length; j++) {
          if (rounds.eq(j).text().includes('Week')) {
            let roundResult = await this.runRound(rounds.eq(j), competition, competitionDefault, numberSeason);
            competition.rounds.push(roundResult!._id);
          }
        }

        await this.competitionRepository.save(competition);

        this.loadingCli.pop();
      }
    }
  }

  public async runRound(roundHtml: any, competition: ICompetition, competitionDefault: any, codeyear: number): Promise<IRound | null> {
    let number = parseInt(roundHtml.attr('value'));

    let round = new Round();
    round.goals = 0;
    round.goalsHome = 0;
    round.goalsGuest = 0;
    round.number = number + '';
    round.matchs = [];
    round.competition = competition._id;
    round.hash = md5(competition.code + competition.year + round.number);

    this.loadingCli.push(`Round ${round.number}`);

    let $ = await this.getPageData(`${competitionDefault.code}/calendrier_resultat?sai=${codeyear}&jour=${number}`);
    let data = $('#tableaux_rencontres').children('div').find('table');

    for (let i = 0; i < data.length; i++) {
      let date = data.eq(i).children('caption').text().replace('Fixtures of ', '').trim();
      let matchs = data.eq(i).children('tbody').children();

      for (let i = 0; i < matchs.length; i++) {
        let matchResult = await this.runMatch(matchs.eq(i), date);

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
    let match = new Match();
    match.teamHome = new TeamResult();
    match.teamGuest = new TeamResult();

    let data = matchHtml.children();
    let result = data.eq(3).children('a').text().trim().split(' - ');
    date = date + ' ' + data.eq(0).children('a').text().trim();

    match.date = moment.utc(date, 'DD MMMM YYYY HH:mm').format();
    match.stadium = '';
    match.location = '';

    match.teamHome.initials = '';
    match.teamHome.name = data.eq(1).children('a').text().trim();
    match.teamHome.flag = FffConstants.URL_DEFAULT + data.eq(2).children('a').children('img').attr('src');
    match.teamHome.goals = result.length == 1 ? undefined : parseInt(result[0]);

    match.teamGuest.initials = '';
    match.teamGuest.name = data.eq(5).children('a').text().trim();
    match.teamGuest.flag = FffConstants.URL_DEFAULT + data.eq(4).children('a').children('img').attr('src');
    match.teamGuest.goals = result.length == 1 ? undefined : parseInt(result[1]);

    return match;
  }
}

export default FffLeagueScraping;
