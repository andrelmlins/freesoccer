const { gql } = require('apollo-server');

const types = gql`
  type Competition {
    name: String
    code: String
    type: String
    country: String
    federation: String
  }

  type Round {
    number: String
    goals: Int
    goalsHome: Int
    goalsGuest: Int
    hash: String
    url: String
  }

  type Match {
    date: String
    stadium: String
    location: String
  }

  type Query {
    competitions: [Competition]
    rounds: [Round]
  }
`;

export default types;
