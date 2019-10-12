const competitions = [{ name: "Competition One" }, { name: "Competition Two" }];

const resolvers = {
  Query: {
    competitions: () => competitions
  }
};

export default resolvers;
