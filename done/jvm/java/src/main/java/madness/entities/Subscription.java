package madness.entities;

public class Subscription {
    public final Type type;

    public Subscription(Type type) {
        this.type = type;
    }

    public enum Type {
        None,
        Basic,
        Premium
    }
}
