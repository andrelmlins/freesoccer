const { gql } = require('apollo-server');

const types = gql`
  type Competition {
    name: String
  }

  type Query {
    competitions: [Competition]
  }
`;

export default types;
