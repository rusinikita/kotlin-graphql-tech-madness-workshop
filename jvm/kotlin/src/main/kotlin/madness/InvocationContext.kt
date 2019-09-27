package madness

import graphql.ExecutionInput
import graphql.ExecutionResult
import graphql.GraphQL
import graphql.spring.web.servlet.GraphQLInvocation
import graphql.spring.web.servlet.GraphQLInvocationData
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Primary
import org.springframework.stereotype.Component
import org.springframework.web.context.request.WebRequest
import java.util.concurrent.CompletableFuture

data class Context(val accessToken: String?)

@Component
@Primary
class GraphQLAttachContextInvocation : GraphQLInvocation {
    @Autowired
    internal var graphQL: GraphQL? = null

    override fun invoke(invocationData: GraphQLInvocationData, webRequest: WebRequest): CompletableFuture<ExecutionResult> {
        val context = Context(webRequest.getHeader("Access"))

        val executionInput = ExecutionInput.newExecutionInput()
                .query(invocationData.query)
                .context(context)
                .operationName(invocationData.operationName)
                .variables(invocationData.variables)
                .build()
        return graphQL!!.executeAsync(executionInput)
    }
}