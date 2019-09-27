@file:JsModule("graphql-yoga")
@file:Suppress("INTERFACE_WITH_SUPERCLASS", "OVERRIDING_FINAL_MEMBER", "RETURN_TYPE_MISMATCH_ON_OVERRIDE", "CONFLICTING_OVERLOADS", "EXTERNAL_DELEGATION", "NESTED_CLASS_IN_EXTERNAL_INTERFACE")
package yoga

external class GraphQLServer(props: dynamic) {
    fun start(callback: (options: dynamic) -> Unit): dynamic
}