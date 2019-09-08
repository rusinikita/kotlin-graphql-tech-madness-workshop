const { GraphQLServer } = require('graphql-yoga')
const { buildSchema } = require('graphql')
const { importSchema } = require('graphql-import')

const ACCESS_TOKEN_HEADER = "Access"

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

function getUserIdFromAccessToken(token) {
  if (!token) {
    throw 'Access token required'
  }
  return token.split('_', 1)[0]
}

function getUserStatus(id) {
  return STATUS_ACTIVE
}

function getSubscription(id) {
  return {
    type: SUBSCRIPTION_NONE
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
    status: () => getUserStatus(id),
    subscription: () => getSubscription(id),
    permissions: () => getPermissions(getUserStatus(id), getSubscription(id).type),
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

const resolvers = {
  Query: {
    user(parent, { id }, context) {
      return getUser(id)
    },
    self(parent, args, context) {
      let id = getUserIdFromAccessToken(context.request.get(ACCESS_TOKEN_HEADER))
      return getUser(id)
    }
  },
  Mutation: {
    updateFullname(parent, { firstName, surname }, context) {
      let id = getUserIdFromAccessToken(context.request.get(ACCESS_TOKEN_HEADER))
      return updateUser(id, firstName, surname)
    }
  }
}

const server = new GraphQLServer({
  typeDefs: `../schema.graphql`,
  resolvers,
  context: req => ({ ...req }) // context for request information
})
server.start(() => console.log('Server is running on http://localhost:4000'))
