package madness

import com.google.common.base.Charsets
import com.google.common.io.Resources
import graphql.GraphQL
import graphql.schema.GraphQLSchema
import graphql.schema.idl.RuntimeWiring
import graphql.schema.idl.SchemaGenerator
import graphql.schema.idl.SchemaParser
import graphql.schema.idl.TypeRuntimeWiring
import graphql.schema.idl.TypeRuntimeWiring.newTypeWiring
import org.springframework.context.annotation.Bean
import org.springframework.stereotype.Component

@Component
class Provider {

    internal val graphQL: GraphQL

    @Bean
    fun graphQL(): GraphQL {
        return graphQL
    }

    init {
        val url = Resources.getResource("schema.graphql")
        val sdl = Resources.toString(url, Charsets.UTF_8)
        val graphQLSchema = buildSchema(sdl)
        this.graphQL = GraphQL.newGraphQL(graphQLSchema).build()
    }

    private fun buildSchema(sdl: String): GraphQLSchema {
        val typeRegistry = SchemaParser().parse(sdl)
        val runtimeWiring = buildWiring()
        val schemaGenerator = SchemaGenerator()
        return schemaGenerator.makeExecutableSchema(typeRegistry, runtimeWiring)
    }

    private fun buildWiring(): RuntimeWiring {
        return createWiring {
            newType("Query") {

                dataFetcher("self") { environment ->
                    val context = environment.getContext<Context>()
                    val id = getUserIdFromToken(context.accessToken)

                    createUser(id, null)
                }

                dataFetcher("user") { environment ->
                    val id = environment.getArgument<String>("id")

                    createUser(id, null)
                }
            }

            newType("Mutation") {

                dataFetcher("updateFullname") { environment ->
                    val context = environment.getContext<Context>()
                    val id = getUserIdFromToken(context.accessToken)

                    val newName = Name(
                            environment.getArgument("firstName"),
                            environment.getArgument("surname")
                    )

                    createUser(id, newName)
                }
            }

            newType("User") {

                dataFetcher("status") { environment ->
                    val user = environment.getSource<User>()

                    getUserStatus(user.id)
                }

                dataFetcher("subscription") { environment ->
                    val user = environment.getSource<User>()

                    getUserSubscription(user.id)
                }

                dataFetcher("permissions") { environment ->
                    val user = environment.getSource<User>()
                    val status = getUserStatus(user.id)
                    // You can fix duplicated logic it using cache data in context,
                    // cache in repository or one data fetcher for all user with fields introspection
                    val (type) = getUserSubscription(user.id)

                    getPermissions(status, type)
                }
            }
        }
    }
}

inline fun createWiring(body: RuntimeWiring.Builder.() -> RuntimeWiring.Builder): RuntimeWiring {
    return RuntimeWiring.newRuntimeWiring().body().build()
}

inline fun RuntimeWiring.Builder.newType(
        name: String,
        body: TypeRuntimeWiring.Builder.() -> TypeRuntimeWiring.Builder
): RuntimeWiring.Builder {
    return type(newTypeWiring(name).body())
}