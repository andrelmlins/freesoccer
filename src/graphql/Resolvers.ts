import lodash from 'lodash';
import CompetitionResolver from './resolvers/CompetitionResolver';
import RoundResolver from './resolvers/RoundResolver';

export default class Resolvers {
  private competitionResolver: CompetitionResolver;
  private roundResolver: RoundResolver;

  constructor() {
    this.competitionResolver = new CompetitionResolver();
    this.roundResolver = new RoundResolver();
  }

  public resolvers() {
    return lodash.merge(this.competitionResolver.resolver(), this.roundResolver.resolver());
  }
}
