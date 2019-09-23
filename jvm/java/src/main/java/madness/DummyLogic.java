package madness;

import madness.entities.Name;
import madness.entities.Permission;
import madness.entities.Subscription;
import madness.entities.User;

import java.util.ArrayList;
import java.util.List;

public class DummyLogic {
    public static String getUserIdFromToken(String tocken) {
        return tocken.split("_")[1];
    }

    public static User createUser(String id, Name newName) {
        Name name = new Name("FirstName", "Surname");
        return new User(id, newName != null ? newName : name);
    }

    public static User.Status getUserStatus(String userId) {
        return User.Status.Active;
    }

    public static Subscription getUserSubscription(String userId) {
        return new Subscription(Subscription.Type.Basic);
    }

    public static List<Permission> getPermissions(User.Status status, Subscription.Type subscription) {
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
