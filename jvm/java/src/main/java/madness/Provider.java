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
import madness.entities.Permission;
import madness.entities.Subscription;
import madness.entities.User;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import static graphql.schema.idl.TypeRuntimeWiring.newTypeWiring;

@Component
public class Provider {

    private GraphQL graphQL;

    @Bean
    public GraphQL graphQL() {
        return graphQL;
    }

    @PostConstruct
    public void init() throws IOException {
        URL url = Resources.getResource("schema.graphql");
        String sdl = Resources.toString(url, Charsets.UTF_8);
        GraphQLSchema graphQLSchema = buildSchema(sdl);
        this.graphQL = GraphQL.newGraphQL(graphQLSchema)
                .build();
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
                                    return createUser(environment.getArgument("id"), null);
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
                                    Subscription subscription = getUserSubscription(user.id);
                                    return getPermissions(status, subscription.type);
                                })
                )
                .build();
    }

    private String getUserIdFromToken(String tocken) {
        return tocken.split("_")[1];
    }

    private User createUser(String id, Name newName) {
        Name name = new Name("FirstName", "Surname");
        return new User(id, newName != null ? newName : name);
    }

    private User.Status getUserStatus(String userId) {
        return User.Status.Active;
    }

    private Subscription getUserSubscription(String userId) {
        return new Subscription(Subscription.Type.Basic);
    }

    private List<Permission> getPermissions(User.Status status, Subscription.Type subscription) {
        List<Permission> permissions = new ArrayList<>(5);

        // default
        permissions.add(new Permission(Permission.Type.Cry));

        // active user permissions
        if (status == User.Status.Active) {
            permissions.add(new Permission(Permission.Type.ChangeName));

            // subscription based
            if (subscription != Subscription.Type.None) {
                permissions.add(new Permission(Permission.Type.WriteComments));
            }

            if (subscription == Subscription.Type.Premium) {
                permissions.add(new Permission(Permission.Type.CancelPremium));
                permissions.add(new Permission(Permission.Type.KickChildren));
            }
        }

        return permissions;
    }
}
