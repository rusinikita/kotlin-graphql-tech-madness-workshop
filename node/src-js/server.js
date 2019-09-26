const { GraphQLServer } = require('graphql-yoga')
const { buildSchema } = require('graphql')
const { importSchema } = require('graphql-import')

const ACCESS_TOKEN_HEADER = "Access"

const STATUS_ACTIVE = 'Active'
const STATUS_UNACTIVE = 'Unactive'
const STATUS_BLOCKED = 'Blocked'

const SUBSCRIPTION_NONE = 'None'
const SUBSCRIPTION_BASIC = 'Basic'
const SUBSCRIPTION_PREMIUM = 'Premium'

const PERMISSION_WRITE_COMMENTS = 'WriteComments'
const PERMISSION_CHANGE_NAME = 'ChangeName'
const PERMISSION_CRY = 'Cry'
const PERMISSION_CANCEL_PREMIUM = 'CancelPremium'
const PERMISSION_KICK_CHILDREN = 'KickChildren'

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
  const permissions = []

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
    id,
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
    id,
    status: (id) => getUserStatus(id),
    subscription: (id) => getSubscription(id),
    permissions: (id) => getPermissions(getUserStatus(id), getSubscription(id).type),
    name: {
      firstName: firstName,
      surname: surname,
    }
  }
}

const resolvers = {
  Query: {
    user(parent, { id }, context) {
      return getUser(id)
    },
    self(parent, args, context) {
      const id = getUserIdFromAccessToken(context.request.get(ACCESS_TOKEN_HEADER))
      return getUser(id)
    }
  },
  Mutation: {
    updateFullname(parent, { firstName, surname }, context) {
      const id = getUserIdFromAccessToken(context.request.get(ACCESS_TOKEN_HEADER))
      return updateUser(id, firstName, surname)
    }
  }
}

const server = new GraphQLServer({
  typeDefs: '../schema.graphql',
  resolvers,
  context: req => ({ ...req }) // context for request information
})
server.start(() => console.log('Server is running on http://localhost:4000'))
