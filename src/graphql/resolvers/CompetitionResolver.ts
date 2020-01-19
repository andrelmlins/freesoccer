import CompetitionRepository from '../../repository/CompetitionRepository';

export default class CompetitionResolver {
  private competitionRepository: CompetitionRepository;

  constructor() {
    this.competitionRepository = new CompetitionRepository();
  }

  private async all() {
    return await this.competitionRepository.all({});
  }

  public resolver() {
    return {
      Query: {
        competitions: () => this.all()
      }
    };
  }
}
