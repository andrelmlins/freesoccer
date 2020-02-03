import lodash from 'lodash';
import CompetitionResolver from './resolvers/CompetitionResolver';
import RoundResolver from './resolvers/RoundResolver';
import MatchResolver from './resolvers/MatchResolver';

export default class Resolvers {
  private competitionResolver: CompetitionResolver;
  private roundResolver: RoundResolver;
  private matchResolver: MatchResolver;

  constructor() {
    this.competitionResolver = new CompetitionResolver();
    this.roundResolver = new RoundResolver();
    this.matchResolver = new MatchResolver();
  }

  public resolvers() {
    return lodash.merge(this.competitionResolver.resolver(), this.roundResolver.resolver(), this.matchResolver.resolver());
  }
}
