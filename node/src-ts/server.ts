import { GraphQLServer } from 'graphql-yoga'
import { Resolvers, User } from './generated/schema';
import { Request, Response } from 'express';

const ACCESS_TOKEN_HEADER = "Access"


function getUserIdFromAccessToken(token: String): String {
    if (!token) {
      throw 'Access token required'
    }
    return token.split('_', 1)[0]
}

function getUser(id: String): User {
    throw 'TODO'
}

interface Context {
    request: Request
}

const resolvers: Resolvers<Context> = {
    Query: {
        user: (parent, { id }) => getUser(id),
        self: (parent, _, context) => {
            let id = getUserIdFromAccessToken(context.request.header(ACCESS_TOKEN_HEADER) || '')
            return getUser(id)
        }
    },
    Mutation: {
        updateFullname: (parent, { firstName, surname }, context) => {
            let id = getUserIdFromAccessToken(context.request.header(ACCESS_TOKEN_HEADER) || '')
            return getUser(id)
        }
    }
}

const server = new GraphQLServer({
    typeDefs: `../schema.graphql`,
    resolvers,
    context: req => ({ ...req }) // context for request information
})
server.start(() => console.log('Server is running on http://localhost:4000'))