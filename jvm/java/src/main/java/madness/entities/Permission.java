package madness.entities;

public class Permission {
    public final Type type;

    public Permission(Type type) {
        this.type = type;
    }

    public enum Type {
        WriteComments,
        ChangeName,
        CancelPremium,
        Cry,
        KickChildren
    }
}
