const { GraphQLServer } = require('graphql-yoga')

const ACCESS_TOKEN_HEADER = "Access"

const resolvers = {
  Query: {}
}

const server = new GraphQLServer({
  typeDefs: '../schema.graphql',
  resolvers,
})
server.start(() => console.log('Server is running on http://localhost:4000'))
