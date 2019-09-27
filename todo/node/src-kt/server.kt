package madness

import yoga.*

fun main(args: Array<String>) {
    val resolvers = object {
        val Query = object {}
    }

    val props = object {
        val typeDefs = "../schema.graphql"
        val resolvers = resolvers
    }

    GraphQLServer(props).start({ println("Server is running on http://localhost:4000") })
}

