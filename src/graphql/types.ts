const { gql } = require('apollo-server');

const types = gql`
  type Competition {
    name: String
  }

  type Round {
    name: String
  }

  type Query {
    competitions: [Competition]
    rounds: [Round]
  }
`;

export default types;
