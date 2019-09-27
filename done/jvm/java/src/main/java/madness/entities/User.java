package madness.entities;

public final class User {
    public final String id;
    public final Name name;

    public User(String id, Name name) {
        this.id = id;
        this.name = name;
    }

    public enum Status {
        Active,
        Unactive,
        Blocked
    }
}
