package madness;

import graphql.ExecutionInput;
import graphql.ExecutionResult;
import graphql.GraphQL;
import graphql.spring.web.servlet.GraphQLInvocation;
import graphql.spring.web.servlet.GraphQLInvocationData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.WebRequest;

import java.util.concurrent.CompletableFuture;

@Component
@Primary
public class GraphQLAttachContextInvocation implements GraphQLInvocation {
    @Autowired
    GraphQL graphQL;
    @Override
    public CompletableFuture<ExecutionResult> invoke(GraphQLInvocationData invocationData, WebRequest webRequest) {
        Context context = new Context(webRequest.getHeader("Access"));

        ExecutionInput executionInput = ExecutionInput.newExecutionInput()
                .query(invocationData.getQuery())
                .context(context)
                .operationName(invocationData.getOperationName())
                .variables(invocationData.getVariables())
                .build();
        return graphQL.executeAsync(executionInput);
    }
}
