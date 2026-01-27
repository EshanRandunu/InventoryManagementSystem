package backend.exception;

public class InventoryNotFoundException extends RuntimeException {

    public InventoryNotFoundException(Long id) {
        super("Inventory item not found"+id);
    }

    public InventoryNotFoundException(String message) {
        super(message);
    }
}
