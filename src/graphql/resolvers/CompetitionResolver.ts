import CompetitionRepository from '../../repository/CompetitionRepository';

export default class CompetitionResolver {
  private competitionRepository: CompetitionRepository;

  constructor() {
    this.competitionRepository = new CompetitionRepository();
  }

  private async get() {
    return await this.competitionRepository.all({});
  }

  public resolver = () => ({
    Query: {
      competitions: this.get
    }
  });
}
