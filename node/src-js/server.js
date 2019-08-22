const express = require('express')
const graphqlHTTP = require('express-graphql')
const { buildSchema } = require('graphql')
const { importSchema } = require('graphql-import')

// Construct a schema, using GraphQL schema language
const schema = buildSchema(importSchema(`../schema.graphql`))

function getSubscription() {
  return {
    type: 'NONE',
    expirationDate: null,
  }
}

function getPermissions() {
  return [
    { type: 'WRITE_COMMENTS' },
    { type: 'CHANGE_NAME' },
    { type: 'CANCEL_PREMIUM' },
    { type: 'CRY' },
    { type: 'KICK_CHILDREN' },
  ]
}

function getUser(firstName, surname) {
  return {
    id: "asdf",
    status: 'ACTIVE',
    subscription: getSubscription,
    permissions: getPermissions,
    name: {
      firstName: firstName || "Name",
      surname: surname || "Surname",
    },
  }
}

// The root provides a resolver function for each API endpoint
const root = {
  user: () => getUser(),
  updateFullname: ({ firstName, surname }) => getUser(firstName, surname),
}

const app = express();
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}))
app.listen(4000)
// eslint-disable-next-line no-console
console.log('Running a GraphQL API server at localhost:4000/graphql')
