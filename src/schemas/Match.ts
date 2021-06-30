import TeamResult from './TeamResult';

class Match {
  public date: string = '';
  public stadium: string = '';
  public location: string = '';
  public teamHome: TeamResult = new TeamResult();
  public teamGuest: TeamResult = new TeamResult();
}

export default Match;
