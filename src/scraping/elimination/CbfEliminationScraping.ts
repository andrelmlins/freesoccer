import axios from 'axios';
import cheerio from 'cheerio';
import md5 from 'md5';
import moment from 'moment';

import CbfConstants from '@constants/CbfConstants';
import Helpers from '@utils/Helpers';
import ICompetitionDefault from '@interfaces/ICompetitionDefault';

import { ICompetition } from '@schemas/Competition';
import { IStage, Stage } from '@schemas/Stage';
import Match from '@schemas/Match';
import TeamResult from '@schemas/TeamResult';
import CompetitionRepository from '@repository/CompetitionRepository';
import StageRepository from '@repository/StageRepository';

class CbfEliminationScraping {
  public lastYear: boolean;
  private competitionRepository: CompetitionRepository;
  private stageRepository: StageRepository;

  constructor(lastYear: boolean) {
    this.lastYear = lastYear;
    this.competitionRepository = new CompetitionRepository();
    this.stageRepository = new StageRepository();
  }

  public async run(competition: ICompetitionDefault) {
    console.log('-> CBF ELIMATION SCRAPING');

    await this.runCompetition(competition);
  }

  public async runCompetition(competitionDefault: ICompetitionDefault) {
    console.log(`\t-> ${competitionDefault.name}`);

    let initial = 0;
    if (this.lastYear) initial = competitionDefault.years!.length - 1;

    for (let i = initial; i < competitionDefault.years!.length; i++) {
      console.log(`\t\t-> ${competitionDefault.years![i]}`);

      const competition = await Helpers.createCompetition(competitionDefault, competitionDefault.years![i], CbfConstants);

      const page = await axios.get(`${CbfConstants.URL_DEFAULT}/${competition.code}/${competition.year}`);

      const $ = cheerio.load(page.data);
      const stages = $('.campeonato .container div div section').find('.group-btns').children();

      for (let j = 0; j < stages.length; j++) {
        const stageResult = await this.runStage(stages.eq(j), competition);
        competition.stages.push(stageResult!._id);
      }

      await this.competitionRepository.save(competition);
    }
  }

  public async runStage(stageHtml: any, competition: ICompetition): Promise<IStage | null> {
    const url = stageHtml.children('a').attr('href');

    const stage = new Stage();
    stage.goals = 0;
    stage.name = stageHtml.children('a').text().trim();
    stage.matchs = [];
    stage.competition = competition._id;
    stage.hash = md5(competition.code + competition.year + stage.name);

    console.log(`\t\t\t-> Stage ${stage.name}`);

    const page = await axios.get(url);

    const $ = cheerio.load(page.data);
    const matches = $('.campeonato .container div div section section').children();

    for (let i = 0; i < matches.length; i++) {
      if (matches.eq(i).hasClass('box')) {
        const matchesResult = await this.runMatch(matches.eq(i));

        for (let j = 0; j < matchesResult.length; j++) {
          if (matchesResult[j].teamGuest.goals && matchesResult[j].teamHome.goals) {
            stage.goals += matchesResult[j].teamGuest.goals! + matchesResult[j].teamHome.goals!;
          }

          stage.matchs.push(matchesResult[j]);
        }
      }
    }

    return this.stageRepository.save(stage);
  }

  public async runMatch(matchHtml: any): Promise<Match[]> {
    const matchesReturn: Match[] = [];
    const matches = matchHtml.children('div').hasClass('row') ? matchHtml.children('div').children() : matchHtml.children();

    for (let i = 0; i < matches.length; i++) {
      const data = matches.eq(i);

      if (data.text().trim() !== 'Sem Jogo') {
        const match = new Match();
        match.teamHome = new TeamResult();
        match.teamGuest = new TeamResult();

        const aux = data.children().eq(1).children('div').children();
        const location = data.children().eq(0).text().includes('A definir') ? ['', '', ''] : data.children().eq(2).text().trim().replace(' Como foi o jogo', '').split(' - ');
        const date = data.children().eq(0).text().includes('A definir') ? null : data.children().eq(0).text().split('-')[0].trim().split(',')[1].trim();
        const result = aux.eq(1).text().trim().split('x');
        let penalty = false;

        if (result[0].includes(')')) penalty = true;

        if (penalty) {
          if ((result[0].match(/\)/g) || []).length > 1) {
            result[0] = result[0] === '' ? undefined : result[0].replace('(', '').split(')')[2];
            penalty = false;
          } else {
            result[0] = result[0] === '' ? undefined : result[0].replace('(', '').split(')');
          }

          if ((result[1].match(/\)/g) || []).length > 1) {
            result[1] = result[1] === '' ? undefined : result[1].replace(')', '').split('(')[0];
            penalty = false;
          } else {
            result[1] = result[1] === '' ? undefined : result[1].replace(')', '').split('(');
          }
        }

        match.date = date && moment.utc(date, 'DD/MM/YYYY HH:mm').toDate();
        match.stadium = location[0];
        match.location = location.length >= 2 ? `${location[1]}/${location[2]}` : '';

        match.teamHome.initials = aux.eq(0).children('b').text();
        match.teamHome.name = aux.eq(0).children('img').attr('title');
        match.teamHome.flag = aux.eq(0).children('img').attr('src');

        if (penalty) {
          match.teamHome.goalsPenalty = Number(result[0][0]);
          match.teamHome.goals = Number(result[0][1]);
        } else {
          match.teamHome.goals = result[0] === '' ? undefined : Number(result[0]);
        }

        match.teamGuest.initials = aux.eq(2).children('b').text();
        match.teamGuest.name = aux.eq(2).children('img').attr('title');
        match.teamGuest.flag = aux.eq(2).children('img').attr('title');

        if (penalty) {
          match.teamGuest.goalsPenalty = Number(result[1][1]);
          match.teamGuest.goals = Number(result[1][0]);
        } else {
          match.teamGuest.goals = result[1] === '' ? undefined : Number(result[1]);
        }

        matchesReturn.push(match);
      }
    }

    return matchesReturn;
  }
}

export default CbfEliminationScraping;
