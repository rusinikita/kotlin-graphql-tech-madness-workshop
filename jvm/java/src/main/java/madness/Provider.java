package madness;

import com.google.common.base.Charsets;
import com.google.common.io.Resources;
import graphql.GraphQL;
import graphql.schema.GraphQLSchema;
import graphql.schema.idl.RuntimeWiring;
import graphql.schema.idl.SchemaGenerator;
import graphql.schema.idl.SchemaParser;
import graphql.schema.idl.TypeDefinitionRegistry;
import madness.entities.Name;
import madness.entities.Subscription;
import madness.entities.User;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.net.URL;

import static graphql.schema.idl.TypeRuntimeWiring.newTypeWiring;
import static madness.DummyLogic.*;

@Component
public class Provider {

    final GraphQL graphQL;

    @Bean
    public GraphQL graphQL() {
        return graphQL;
    }

    public Provider() throws IOException {
        URL url = Resources.getResource("schema.graphql");
        String sdl = Resources.toString(url, Charsets.UTF_8);
        GraphQLSchema graphQLSchema = buildSchema(sdl);
        this.graphQL = GraphQL.newGraphQL(graphQLSchema).build();
    }

    private GraphQLSchema buildSchema(String sdl) {
        TypeDefinitionRegistry typeRegistry = new SchemaParser().parse(sdl);
        RuntimeWiring runtimeWiring = buildWiring();
        SchemaGenerator schemaGenerator = new SchemaGenerator();
        return schemaGenerator.makeExecutableSchema(typeRegistry, runtimeWiring);
    }

    private RuntimeWiring buildWiring() {
        return RuntimeWiring.newRuntimeWiring()
                .type(
                        newTypeWiring("Query")
                                .dataFetcher("self", (environment) -> {
                                    Context context = environment.getContext();
                                    String id = getUserIdFromToken(context.accessToken);

                                    return createUser(id, null);
                                })
                                .dataFetcher("user", (environment) -> {
                                    String id = environment.getArgument("id");

                                    return createUser(id, null);
                                })
                )
                .type(
                        newTypeWiring("Mutation")
                                .dataFetcher("updateFullname", (environment) -> {
                                    Context context = environment.getContext();
                                    String id = getUserIdFromToken(context.accessToken);

                                    Name newName = new Name(
                                            environment.getArgument("firstName"),
                                            environment.getArgument("surname")
                                    );

                                    return createUser(id, newName);
                                })
                )
                .type(
                        newTypeWiring("User")
                                .dataFetcher("status", (environment) -> {
                                    User user = environment.getSource();

                                    return getUserStatus(user.id);
                                })
                                .dataFetcher("subscription", (environment) -> {
                                    User user = environment.getSource();

                                    return getUserSubscription(user.id);
                                })
                                .dataFetcher("permissions", (environment) -> {
                                    User user = environment.getSource();
                                    User.Status status = getUserStatus(user.id);
                                    // You can fix duplicated logic it using cache data in context,
                                    // cache in repository or one data fetcher for all user with fields introspection
                                    Subscription subscription = getUserSubscription(user.id);

                                    return getPermissions(status, subscription.type);
                                })
                )
                .build();
    }
}
