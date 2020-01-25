import RoundRepository from '../../repository/RoundRepository';

export default class RoundResolver {
  private roundRepository: RoundRepository;

  constructor() {
    this.roundRepository = new RoundRepository();
  }

  private async all(args: any) {
    return await this.roundRepository.all(args.competitionCode, args.year);
  }

  private async get(args: any) {
    return await this.roundRepository.get(args.roundCode);
  }

  public resolver() {
    return {
      Query: {
        rounds: (_: any, args: Object) => this.all(args),
        round: (_: any, args: Object) => this.get(args)
      }
    };
  }
}
