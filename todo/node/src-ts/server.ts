import { GraphQLServer } from 'graphql-yoga'
import { IResolvers } from 'graphql-tools';

const resolvers: IResolvers = {
    Query: {}
}

const server = new GraphQLServer({
    typeDefs: '../schema.graphql',
    resolvers,
})
server.start(() => console.log('Server is running on http://localhost:4000'))