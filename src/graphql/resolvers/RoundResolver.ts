import RoundRepository from '../../repository/RoundRepository';

export default class RoundResolver {
  private roundRepository: RoundRepository;

  constructor() {
    this.roundRepository = new RoundRepository();
  }

  private async all(args: any) {
    return await this.roundRepository.all(args.competitionCode, args.year);
  }

  public resolver() {
    return {
      Query: {
        rounds: (_: any, args: Object) => this.all(args)
      }
    };
  }
}
