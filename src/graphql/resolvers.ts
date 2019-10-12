import CompetitionResolver from './resolvers/CompetitionResolver';
import RoundResolver from './resolvers/RoundResolver';

const resolvers = { ...CompetitionResolver, ...RoundResolver };

export default resolvers;
