package madness

import yoga.*

const val ACCESS_TOKEN_HEADER = "Access"

data class Context(val token: String)

fun main(args: Array<String>) {
    val resolvers = object {
        val Query = object {
            val user = { _: dynamic, args: dynamic, _: Context ->
                createUser(args.id)
            }
            val self = { _: dynamic, _: dynamic, context: Context ->
                val id = getUserIdFromToken(context.token)
                createUser(id)
            }
          }
        val Mutation = object {
            val updateFullname = { _: dynamic, args: dynamic, context: Context -> // { firstName, surname } 
                val id = getUserIdFromToken(context.token)
                createUser(id, Name(args.firstName, args.surname))
            }
        }
        val User = object {
            val status = { parent: User, _: dynamic, _: Context ->
                getUserStatus(parent.id).name
            }
            val subscription = { parent: User, _: dynamic, _: Context ->
                // kotlin transpile enums to { value, ordinal } javascript objects
                // hack to fix serialization
                getUserSubscription(parent.id).let { object { val type = it.type.name } }
            }
            val permissions = { parent: User, _: dynamic, _: Context ->
                val status = getUserStatus(parent.id)
                // You can fix duplicated logic it using cache data in context,
                // cache in repository or one data fetcher for all user with fields introspection
                val (type) = getUserSubscription(parent.id)

                getPermissions(status, type).map { object { val type = it.type.name } }.toTypedArray()
            }
        }
    }

    val props = object {
        val typeDefs = "../schema.graphql"
        val resolvers = resolvers
        val context = { params: dynamic -> Context(token = params.request.get(ACCESS_TOKEN_HEADER)) }
    }

    GraphQLServer(props).start({ println("Server is running on http://localhost:4000") })
}

