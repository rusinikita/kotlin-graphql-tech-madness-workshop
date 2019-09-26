import { GraphQLServer } from 'graphql-yoga'
import { Status, Subscription, SubscriptionType, PermissionType, UserResolvers } from './generated/schema';
import { Request } from 'express';
import { IResolvers } from 'graphql-tools';

const ACCESS_TOKEN_HEADER = "Access"


function getUserIdFromAccessToken(token: String): String {
    if (!token) {
        throw 'Access token required'
    }
    return token.split('_', 1)[0]
}

function getUserStatus(id: String): Status {
    return Status.Active
}

function getSubscription(id: String): Subscription {
    return {
        type: SubscriptionType.None
    }
}

function getPermissions(status: Status, subscriptionType: SubscriptionType) {
    let permissions = []

    // default
    permissions.push({ type: PermissionType.Cry })

    // active user permissions
    if (status == Status.Active) {
        permissions.push(
            { type: PermissionType.ChangeName },
        )

        // subscription based
        if (subscriptionType != SubscriptionType.None) {
            permissions.push(
                { type: PermissionType.WriteComments },
            )
        }
        if (subscriptionType == SubscriptionType.Premium) {
            permissions.push(
                { type: PermissionType.CancelPremium },
                { type: PermissionType.KickChildren },
            )
        }
    }

    return permissions
}

interface Context {
    request: Request
}

// TODO wtf, i don't know how to declare generated resolver types
const resolvers: IResolvers<Context> = {
    Query: {
        user: (parent, { id }) => {
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
        },
        self: (parent, _, context) => {
            let id = getUserIdFromAccessToken(context.request.header(ACCESS_TOKEN_HEADER) || '')
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
    },
    Mutation: {
        updateFullname: (parent, { firstName, surname }, context) => {
            let id = getUserIdFromAccessToken(context.request.header(ACCESS_TOKEN_HEADER) || '')
            return {
                id: id,
                status: () => getUserStatus(id),
                subscription: () => getSubscription(id),
                permissions: () => getPermissions(getUserStatus(id), getSubscription(id).type),
                name: {
                    firstName: firstName,
                    surname: surname,
                },
            }
        }
    }
}

const server = new GraphQLServer({
    typeDefs: '../schema.graphql',
    resolvers,
    context: req => ({ ...req }) // context for request information
})
server.start(() => console.log('Server is running on http://localhost:4000'))