const express = require('express')
const graphqlHTTP = require('express-graphql')
const { buildSchema } = require('graphql')
const { importSchema } = require('graphql-import')

const STATUS_ACTIVE = 'ACTIVE'
const STATUS_UNACTIVE = 'UNACTIVE'
const STATUS_BLOCKED = 'BLOCKED'

const SUBSCRIPTION_NONE = 'NONE'
const SUBSCRIPTION_BASIC = 'BASIC'
const SUBSCRIPTION_PREMIUM = 'PREMIUM'

const PERMISSION_WRITE_COMMENTS = 'WRITE_COMMENTS'
const PERMISSION_CHANGE_NAME = 'CHANGE_NAME'
const PERMISSION_CRY = 'CRY'
const PERMISSION_CANCEL_PREMIUM = 'CANCEL_PREMIUM'
const PERMISSION_KICK_CHILDREN = 'KICK_CHILDREN'

// Construct a schema, using GraphQL schema language
const schema = buildSchema(importSchema(`../schema.graphql`))

function getUserStatus(id) {
  return STATUS_ACTIVE
}

function getSubscription(id) {
  return {
    type: SUBSCRIPTION_NONE,
    expirationDate: null,
  }
}

function getPermissions(status, subscriptionType) {
  let permissions = []

  // default
  permissions.push({ type: PERMISSION_CRY })

  // active user permissions
  if (status == STATUS_ACTIVE) {
    permissions.push(
      { type: PERMISSION_CHANGE_NAME },
    )

    // subscription based
    if (subscriptionType != SUBSCRIPTION_NONE) {
      permissions.push(
        { type: PERMISSION_WRITE_COMMENTS },
      )
    }
    if (subscriptionType == SUBSCRIPTION_PREMIUM) {
      permissions.push(
        { type: PERMISSION_CANCEL_PREMIUM },
        { type: PERMISSION_KICK_CHILDREN },
      )
    }
  }

  return permissions
}

function getUser(id) {
  return {
    id: id,
    status: (id) => getUserStatus(id),
    subscription: (id) => getSubscription(id),
    permissions: (id) => getPermissions(getUserStatus(id), getSubscription(id).type),
    name: {
      firstName: 'Name',
      surname: 'Surname',
    },
  }
}

function updateUser(id, firstName, surname) {
  return {
    id: id,
    status: (id) => getUserStatus(id),
    subscription: (id) => getSubscription(id),
    permissions: (id) => getPermissions(getUserStatus(id), getSubscription(id).type),
    name: {
      firstName: firstName,
      surname: surname,
    },
  }
}

// The root provides a resolver function for each API endpoint
const root = {
  user: ({ id }) => getUser(id),
  updateFullname: ({ firstName, surname }) => updateUser(firstName, surname),
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
