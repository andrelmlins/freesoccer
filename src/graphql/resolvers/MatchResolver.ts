import MatchRepository from '../../repository/MatchRepository';

export default class MatchResolver {
  private matchRepository: MatchRepository;

  constructor() {
    this.matchRepository = new MatchRepository();
  }

  private async allPerRound(args: any) {
    return await this.matchRepository.allPerRound(args.roundCode);
  }

  private async allPerCompetition(args: any) {
    return await this.matchRepository.allPerCompetition(args.competitionCode, args.year);
  }

  public resolver() {
    return {
      Query: {
        roundMatches: (_: any, args: Object) => this.allPerRound(args),
        competitionMatches: (_: any, args: Object) => this.allPerCompetition(args)
      }
    };
  }
}
