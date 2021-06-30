import TeamResult from './TeamResult';

class Match {
  public date: Date;
  public stadium = '';
  public location = '';
  public teamHome: TeamResult = new TeamResult();
  public teamGuest: TeamResult = new TeamResult();

  constructor() {
    this.date = new Date();
  }
}

export default Match;
