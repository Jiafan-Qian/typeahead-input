//read package
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors');

//read class
const State = require('../model/state.js');

//read US states data
const statesData = require('../states.json');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    allStates: [State]
  }

  type State {
      name: String,
      abbreviation: String
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  allStates: () => {
      let output = [];
      for (let state of statesData){
          output.push(new State(state));
      }
      return output;
  }
};

//express graphql server setup
var app = express();
app.use(cors());
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`listening on http://localhost:${port}/graphql`);
});