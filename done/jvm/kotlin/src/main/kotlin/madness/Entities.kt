package madness

data class User(val id: String, val name: Name) {

    enum class Status {
        Active,
        Unactive,
        Blocked
    }
}

data class Name(val firstName: String, val surname: String)

data class Subscription(val type: Type) {

    enum class Type {
        None,
        Basic,
        Premium
    }
}

data class Permission(val type: Type) {

    enum class Type {
        WriteComments,
        ChangeName,
        CancelPremium,
        Cry,
        KickChildren
    }
}