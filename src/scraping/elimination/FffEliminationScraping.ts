import axios from 'axios';
import https from 'https';
import cheerio from 'cheerio';
import md5 from 'md5';
import moment from 'moment';

import FffConstants from '@constants/FffConstants';
import Helpers from '@utils/Helpers';
import ICompetitionDefault from '@interfaces/ICompetitionDefault';

import { ICompetition } from '@schemas/Competition';
import { IStage, Stage } from '@schemas/Stage';
import Match from '@schemas/Match';
import TeamResult from '@schemas/TeamResult';
import CompetitionRepository from '@repository/CompetitionRepository';
import StageRepository from '@repository/StageRepository';

class FffEliminationScraping {
  public lastYear: boolean;
  private axios: any;
  private competitionRepository: CompetitionRepository;
  private stageRepository: StageRepository;

  constructor(lastYear: boolean) {
    this.lastYear = lastYear;
    this.competitionRepository = new CompetitionRepository();
    this.stageRepository = new StageRepository();

    this.axios = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });
  }

  public async run(competition: ICompetitionDefault) {
    console.log('-> FFF ELIMATION SCRAPING');

    await this.runCompetition(competition);
  }

  public async runCompetition(competitionDefault: ICompetitionDefault) {
    console.log(`\t-> ${competitionDefault.name}`);

    const pageSeason = await this.axios.get(`${FffConstants.URL_DEFAULT}/${competitionDefault.aux.url}/calendrier_resultat`);

    const $page = cheerio.load(pageSeason.data);
    const seasons = $page('select[name="saison"]').children();

    let end = seasons.length;
    if (this.lastYear) end = 1;

    for (let i = 0; i < end; i++) {
      const numberSeason = Number(seasons.eq(i).attr('value'));

      if (numberSeason >= FffConstants.START_SEASON) {
        const year = Number(seasons.eq(i).text().split('/')[0]);

        console.log(`\t\t-> ${year}`);

        const competition = await Helpers.createCompetition(competitionDefault, `${year}`, FffConstants);

        const page = await this.axios.get(`${FffConstants.URL_DEFAULT}/${competitionDefault.aux.url}/calendrier_resultat?sai=${numberSeason}`);

        const $ = cheerio.load(page.data);
        const stages = $('select[name="journee"]').children();

        for (let j = 0; j < stages.length; j++) {
          const roundResult = await this.runStage(stages.eq(j), competition, competitionDefault, numberSeason);
          competition.rounds.push(roundResult!._id);
        }

        await this.competitionRepository.save(competition);
      }
    }
  }

  public async runStage(stageHtml: any, competition: ICompetition, competitionDefault: any, codeyear: number): Promise<IStage | null> {
    const number = Number(stageHtml.attr('value'));

    const stage = new Stage();
    stage.goals = 0;
    stage.name = stageHtml.text();
    stage.matchs = [];
    stage.competition = competition._id;
    stage.hash = md5(competition.code + competition.year + stage.name);
    console.log(`\t\t\t-> Stage ${stage.name}`);

    const page = await this.axios.get(`${FffConstants.URL_DEFAULT}/${competitionDefault.aux.url}/calendrier_resultat?sai=${codeyear}&jour=${number}`);

    const $ = cheerio.load(page.data);
    const data = $('#tableaux_rencontres').children('div').find('table');

    for (let i = 0; i < data.length; i++) {
      const date = data.eq(i).children('caption').text().replace('Fixtures of ', '').trim();
      const matchs = data.eq(i).children('tbody').children();

      for (let j = 0; j < matchs.length; j++) {
        const matchResult = await this.runMatch(matchs.eq(j), date);

        if (matchResult.teamGuest.goals && matchResult.teamHome.goals) {
          stage.goals += matchResult.teamGuest.goals + matchResult.teamHome.goals;
        }

        stage.matchs.push(matchResult);
      }
    }

    return this.stageRepository.save(stage);
  }

  public async runMatch(matchHtml: any, date: string): Promise<Match> {
    const match = new Match();
    match.teamHome = new TeamResult();
    match.teamGuest = new TeamResult();

    const data = matchHtml.children();
    let penalty = null;

    const childrenResult = data.eq(3).children('a').children();

    if (childrenResult.length >= 1) {
      if (childrenResult.text().includes('pens')) {
        penalty = childrenResult.eq(0).text().replace('on pens').trim().split(' - ');
      }
      data.eq(3).children('a').children().eq(0).remove();
    }

    if (childrenResult.length >= 2) {
      penalty = childrenResult.eq(1).text().replace('on pens').trim().split(' - ');
      data.eq(3).children('a').children().eq(0).remove();
    }

    const result = data.eq(3).children('a').text().trim().split(' - ');

    date = `${date} ${data.eq(0).children('a').text().trim()}`;

    match.date = moment.utc(date, 'DD MMMM YYYY HH:mm').toDate();
    match.stadium = '';
    match.location = '';

    match.teamHome.initials = '';
    match.teamHome.name = data.eq(1).text().trim();
    match.teamHome.flag = FffConstants.URL_DEFAULT + data.eq(2).find('img').attr('src');
    match.teamHome.goals = result.length === 1 ? undefined : Number(result[0]);
    match.teamHome.goalsPenalty = !penalty ? undefined : Number(penalty[0]);

    match.teamGuest.initials = '';
    match.teamGuest.name = data.eq(5).text().trim();
    match.teamGuest.flag = FffConstants.URL_DEFAULT + data.eq(4).find('img').attr('src');
    match.teamGuest.goals = result.length === 1 ? undefined : Number(result[1]);
    match.teamGuest.goalsPenalty = !penalty ? undefined : Number(penalty[1]);

    return match;
  }
}

export default FffEliminationScraping;
