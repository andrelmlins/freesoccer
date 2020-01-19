import CompetitionResolver from './resolvers/CompetitionResolver';
// import RoundResolver from './resolvers/RoundResolver';

export default class Resolvers {
  private competitionResolver: CompetitionResolver;

  constructor() {
    this.competitionResolver = new CompetitionResolver();
  }

  public resolvers = () => {
    return {
      ...this.competitionResolver.resolver()
    };
  };
}
