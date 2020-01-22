import CompetitionRepository from '../../repository/CompetitionRepository';

export default class CompetitionResolver {
  private competitionRepository: CompetitionRepository;

  constructor() {
    this.competitionRepository = new CompetitionRepository();
  }

  private async all() {
    return await this.competitionRepository.all({});
  }

  private async get(args: any) {
    return await this.competitionRepository.get(args.competitionCode);
  }

  public resolver() {
    return {
      Query: {
        competitions: () => this.all(),
        competition: (_: any, args: Object) => this.get(args)
      }
    };
  }
}
