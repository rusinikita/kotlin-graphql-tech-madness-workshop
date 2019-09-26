package madness

// Just imagine that we have different servises for users, statuses (antifrod) and subscriptions (billing)

fun getUserIdFromToken(tocken: String): String {
    return tocken.substringAfter("_")
}

fun createUser(id: String, newName: Name? = null): User {
    val name = Name("FirstName", "Surname")
    return User(id, newName ?: name)
}

fun getUserStatus(userId: String): User.Status {
    return User.Status.Active
}

fun getUserSubscription(userId: String): Subscription {
    return Subscription(Subscription.Type.Basic)
}

fun getPermissions(status: User.Status, subscription: Subscription.Type): List<Permission> {
    val permissions = mutableListOf(Permission(Permission.Type.Cry))

    // active user permissions
    if (status == User.Status.Active) {
        permissions.add(Permission(Permission.Type.ChangeName))

        // subscription based
        if (subscription != Subscription.Type.None) {
            permissions.add(Permission(Permission.Type.WriteComments))
        }

        if (subscription == Subscription.Type.Premium) {
            permissions.add(Permission(Permission.Type.CancelPremium))
            permissions.add(Permission(Permission.Type.KickChildren))
        }
    }

    return permissions
}