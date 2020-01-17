import CompetitionRepository from '../../repository/CompetitionRepository';

export default class CompetitionResolver {
  private competitionRepository: CompetitionRepository;

  constructor() {
    console.log(new CompetitionRepository());
    this.competitionRepository = new CompetitionRepository();
  }

  private async get() {
    console.log(this.competitionRepository);
    return await this.competitionRepository.all({});
  }

  public resolver = () => ({
    Query: {
      competitions: this.get
    }
  });
}
