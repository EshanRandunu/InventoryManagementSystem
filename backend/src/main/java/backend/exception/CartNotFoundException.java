package backend.exception;

public class CartNotFoundException extends RuntimeException {
    public CartNotFoundException(Long id) {
        super("Could not find cart item with id: " + id);
    }

    public CartNotFoundException(String message) {
        super(message);
    }
}
