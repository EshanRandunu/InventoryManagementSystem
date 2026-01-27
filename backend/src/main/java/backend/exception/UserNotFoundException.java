package backend.exception;

public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException(Long id) {
        super("User item not found"+id);
    }

    public UserNotFoundException(String message) {
        super(message);
    }
}
