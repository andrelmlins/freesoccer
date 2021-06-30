import CompetitionController from '@controllers/CompetitionController';
import RoundController from '@controllers/RoundController';
import TableController from '@controllers/TableController';
import MatchController from '@controllers/MatchController';
import Controller from '@controllers/Controller';

export class Routes {
  public competitionController: CompetitionController;
  public roundController: RoundController;
  public tableController: TableController;
  public matchController: MatchController;
  public controller: Controller;

  constructor() {
    this.competitionController = new CompetitionController();
    this.roundController = new RoundController();
    this.tableController = new TableController();
    this.matchController = new MatchController();
    this.controller = new Controller();
  }

  public routes(app: any): void {
    app.route('/api/documentation').get(this.controller.getSwagger);

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
