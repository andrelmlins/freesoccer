import { Request, Response } from 'express';

import CbfController from '../controllers/scraping/CbfController';
import RfefController from '../controllers/scraping/RfefController';
import FffController from '../controllers/scraping/FffController';
import FigcController from '../controllers/scraping/FigcController';
import DfbController from '../controllers/scraping/DfbController';
import FpfController from '../controllers/scraping/FpfController';
import FaController from '../controllers/scraping/FaController';

import CompetitionController from '../controllers/CompetitionController';
import RoundController from '../controllers/RoundController';
import TableController from '../controllers/TableController';
import MatchController from '../controllers/MatchController';
import UserController from '../controllers/UserController';
import Controller from '../controllers/Controller';

export class Routes {
  public cbfController: CbfController;
  public rfefController: RfefController;
  public fffController: FffController;
  public figcController: FigcController;
  public dfbController: DfbController;
  public fpfController: FpfController;
  public faController: FaController;

  public competitionController: CompetitionController;
  public roundController: RoundController;
  public tableController: TableController;
  public matchController: MatchController;
  public userController: UserController;
  public controller: Controller;

  constructor() {
    this.cbfController = new CbfController();
    this.rfefController = new RfefController();
    this.fffController = new FffController();
    this.figcController = new FigcController();
    this.dfbController = new DfbController();
    this.fpfController = new FpfController();
    this.faController = new FaController();

    this.competitionController = new CompetitionController();
    this.roundController = new RoundController();
    this.tableController = new TableController();
    this.matchController = new MatchController();
    this.userController = new UserController();
    this.controller = new Controller();
  }

  public routes(app: any): void {
    app.route('/scraping/cbf/:competition/results').get(this.cbfController.loadResults);
    app.route('/scraping/cbf/:competition/table').get(this.cbfController.loadTable);

    app.route('/scraping/fff/:competition/results').get(this.fffController.loadResults);
    app.route('/scraping/fff/:competition/table').get(this.fffController.loadTable);

    app.route('/scraping/rfef/:competition/results').get(this.rfefController.loadResults);
    app.route('/scraping/rfef/:competition/table').get(this.rfefController.loadTable);

    app.route('/scraping/dfb/:competition/results').get(this.dfbController.loadResults);
    app.route('/scraping/dfb/:competition/table').get(this.dfbController.loadTable);

    app.route('/scraping/figc/:competition/results').get(this.figcController.loadResults);
    app.route('/scraping/figc/:competition/table').get(this.figcController.loadTable);

    app.route('/scraping/fpf/:competition/results').get(this.fpfController.loadResults);
    app.route('/scraping/fpf/:competition/table').get(this.fpfController.loadTable);

    app.route('/scraping/fa/:competition/results').get(this.faController.loadResults);
    app.route('/scraping/fa/:competition/table').get(this.faController.loadTable);

    app.route('/api/register').post(this.userController.register);
    app.route('/api/login').post(this.userController.login);
    app.route('/api/documentation').get(this.controller.getSwagger);
    app.use(this.controller.validateToken);

    app.route('/api/competitions').get(this.competitionController.all);
    app.route('/api/competitions/:competition').get(this.competitionController.get);
    app.route('/api/competitions/:competition/:year').get(this.competitionController.getYear);

    app.route('/api/competitions/:competition/:year/rounds').get(this.roundController.all);
    app.route('/api/rounds/:round').get(this.roundController.get);

    app.route('/api/competitions/:competition/:year/table').get(this.tableController.get);
    app.route('/api/competitions/:competition/:year/table/:position').get(this.tableController.getPosition);

    app.route('/api/rounds/:round/matches').get(this.matchController.getRound);
    app.route('/api/competitions/:competition/:year/matches').get(this.matchController.getCompetition);
  }
}
