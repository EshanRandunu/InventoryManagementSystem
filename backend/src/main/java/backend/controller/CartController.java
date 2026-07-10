package backend.controller;

import backend.exception.CartNotFoundException;
import backend.exception.InventoryNotFoundException;
import backend.exception.UserNotFoundException;
import backend.model.CartModel;
import backend.model.InventoryModel;
import backend.model.UserModel;
import backend.repository.CartRepository;
import backend.repository.InventoryRepository;
import backend.repository.UserRepository;
import backend.service.StripeService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping("/cart")
public class CartController {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private StripeService stripeService;

    // ================= ADD ITEM TO CART =================

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@Valid @RequestBody CartItemRequest request) {
        UserModel user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new UserNotFoundException(request.getUserId()));

        InventoryModel inventory = inventoryRepository.findById(request.getInventoryId())
                .orElseThrow(() -> new InventoryNotFoundException(request.getInventoryId()));

        // Validate requested quantity against available stock
        int requestedQty = request.getQuantity();
        int availableQty = Integer.parseInt(inventory.getItemQty());

        if (requestedQty > availableQty) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Requested quantity exceeds available stock");
            error.put("requested", String.valueOf(requestedQty));
            error.put("available", String.valueOf(availableQty));
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        // Check if item already exists in cart
        if (cartRepository.existsByUserAndInventory(user, inventory)) {
            CartModel existingItem = cartRepository.findByUserAndInventory(user, inventory)
                    .orElseThrow(() -> new CartNotFoundException("Item not found in cart"));

            int newQuantity = existingItem.getQuantity() + requestedQty;

            if (newQuantity > availableQty) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Total quantity would exceed available stock");
                error.put("current", String.valueOf(existingItem.getQuantity()));
                error.put("requested", String.valueOf(requestedQty));
                error.put("available", String.valueOf(availableQty));
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            existingItem.setQuantity(newQuantity);
            cartRepository.save(existingItem);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Cart item quantity updated");
            response.put("cartItem", existingItem);
            return ResponseEntity.ok(response);
        }

        // Create new cart item
        CartModel cartItem = new CartModel(user, inventory, requestedQty);
        CartModel savedItem = cartRepository.save(cartItem);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Item added to cart successfully");
        response.put("cartItem", savedItem);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ================= GET USER CART =================

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserCart(@PathVariable Long userId) {
        UserModel user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        List<CartModel> cartItems = cartRepository.findByUser(user);

        // Calculate total
        double total = cartItems.stream()
                .mapToDouble(item -> {
                    // Assuming price calculation based on item details or add price field to InventoryModel
                    // For now, returning cart items without price calculation
                    return 0;
                })
                .sum();

        Map<String, Object> response = new HashMap<>();
        response.put("cartItems", cartItems);
        response.put("totalItems", cartItems.size());
        response.put("total", total);

        return ResponseEntity.ok(response);
    }

    // ================= UPDATE CART ITEM QUANTITY =================

    @PutMapping("/update/{cartItemId}")
    public ResponseEntity<?> updateCartItemQuantity(
            @PathVariable Long cartItemId,
            @RequestBody Map<String, Integer> request) {

        CartModel cartItem = cartRepository.findById(cartItemId)
                .orElseThrow(() -> new CartNotFoundException(cartItemId));

        Integer newQuantity = request.get("quantity");

        if (newQuantity == null || newQuantity < 1) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Quantity must be at least 1");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        // Validate against available stock
        int availableQty = Integer.parseInt(cartItem.getInventory().getItemQty());

        if (newQuantity > availableQty) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Requested quantity exceeds available stock");
            error.put("requested", String.valueOf(newQuantity));
            error.put("available", String.valueOf(availableQty));
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        cartItem.setQuantity(newQuantity);
        CartModel updatedItem = cartRepository.save(cartItem);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Cart item quantity updated");
        response.put("cartItem", updatedItem);
        return ResponseEntity.ok(response);
    }

    // ================= REMOVE ITEM FROM CART =================

    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long cartItemId) {
        CartModel cartItem = cartRepository.findById(cartItemId)
                .orElseThrow(() -> new CartNotFoundException(cartItemId));

        cartRepository.delete(cartItem);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Item removed from cart successfully");
        return ResponseEntity.ok(response);
    }

    // ================= CLEAR USER CART =================

    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<?> clearUserCart(@PathVariable Long userId) {
        UserModel user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        cartRepository.deleteByUser(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Cart cleared successfully");
        return ResponseEntity.ok(response);
    }

    // ================= GET CART ITEM COUNT =================

    @GetMapping("/count/{userId}")
    public ResponseEntity<?> getCartItemCount(@PathVariable Long userId) {
        UserModel user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        List<CartModel> cartItems = cartRepository.findByUser(user);
        int totalItems = cartItems.stream().mapToInt(CartModel::getQuantity).sum();

        Map<String, Integer> response = new HashMap<>();
        response.put("count", totalItems);
        return ResponseEntity.ok(response);
    }

    // ================= CREATE PAYMENT INTENT =================

    @PostMapping("/create-payment-intent")
    public ResponseEntity<?> createPaymentIntent(@RequestBody PaymentRequest request) {
        try {
            UserModel user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new UserNotFoundException(request.getUserId()));

            List<CartModel> cartItems = cartRepository.findByUser(user);

            if (cartItems.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Cart is empty");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            // Calculate total amount (assuming price calculation - you may need to add price field to InventoryModel)
            // For now, using a placeholder calculation
            long totalAmount = cartItems.stream()
                    .mapToLong(item -> {
                        // TODO: Add price field to InventoryModel and use it here
                        // For now, returning 0 as placeholder
                        return 0;
                    })
                    .sum();

            if (totalAmount == 0) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Cannot process payment with zero amount");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            PaymentIntent paymentIntent = stripeService.createPaymentIntent(totalAmount, request.getCurrency());

            Map<String, Object> response = new HashMap<>();
            response.put("clientSecret", paymentIntent.getClientSecret());
            response.put("paymentIntentId", paymentIntent.getId());
            response.put("amount", totalAmount);
            response.put("currency", request.getCurrency());

            return ResponseEntity.ok(response);

        } catch (StripeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Payment processing failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // ================= CONFIRM PAYMENT =================

    @PostMapping("/confirm-payment")
    public ResponseEntity<?> confirmPayment(@RequestBody PaymentConfirmationRequest request) {
        try {
            PaymentIntent paymentIntent = stripeService.confirmPayment(request.getPaymentIntentId());

            if ("succeeded".equals(paymentIntent.getStatus())) {
                // Payment successful - clear cart and create order
                UserModel user = userRepository.findById(request.getUserId())
                        .orElseThrow(() -> new UserNotFoundException(request.getUserId()));

                // TODO: Create Order entity and save order details
                // For now, just clear the cart
                cartRepository.deleteByUser(user);

                Map<String, Object> response = new HashMap<>();
                response.put("message", "Payment successful");
                response.put("paymentIntentId", paymentIntent.getId());
                response.put("status", paymentIntent.getStatus());

                return ResponseEntity.ok(response);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Payment not successful");
                error.put("status", paymentIntent.getStatus());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

        } catch (StripeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Payment confirmation failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // Inner class for request body
    public static class CartItemRequest {
        private Long userId;
        private Long inventoryId;
        private Integer quantity;

        public CartItemRequest() {
        }

        public CartItemRequest(Long userId, Long inventoryId, Integer quantity) {
            this.userId = userId;
            this.inventoryId = inventoryId;
            this.quantity = quantity;
        }

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public Long getInventoryId() {
            return inventoryId;
        }

        public void setInventoryId(Long inventoryId) {
            this.inventoryId = inventoryId;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }

    public static class PaymentRequest {
        private Long userId;
        private String currency;

        public PaymentRequest() {
        }

        public PaymentRequest(Long userId, String currency) {
            this.userId = userId;
            this.currency = currency;
        }

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public String getCurrency() {
            return currency;
        }

        public void setCurrency(String currency) {
            this.currency = currency;
        }
    }

    public static class PaymentConfirmationRequest {
        private String paymentIntentId;
        private Long userId;

        public PaymentConfirmationRequest() {
        }

        public PaymentConfirmationRequest(String paymentIntentId, Long userId) {
            this.paymentIntentId = paymentIntentId;
            this.userId = userId;
        }

        public String getPaymentIntentId() {
            return paymentIntentId;
        }

        public void setPaymentIntentId(String paymentIntentId) {
            this.paymentIntentId = paymentIntentId;
        }

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }
    }
}
