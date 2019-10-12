const rounds = [{ name: 'Round One' }, { name: 'Round Two' }];

const resolvers = {
  Query: {
    rounds: () => rounds
  }
};

export default resolvers;
