import httpClient from './httpClient';

const CART_API_BASE = '/cart';

// Add item to cart
export const addToCart = (cartItem) => {
  return httpClient.post(`${CART_API_BASE}/add`, cartItem);
};

// Get user cart
export const getUserCart = (userId) => {
  return httpClient.get(`${CART_API_BASE}/user/${userId}`);
};

// Update cart item quantity
export const updateCartItemQuantity = (cartItemId, quantity) => {
  return httpClient.put(`${CART_API_BASE}/update/${cartItemId}`, { quantity });
};

// Remove item from cart
export const removeFromCart = (cartItemId) => {
  return httpClient.delete(`${CART_API_BASE}/remove/${cartItemId}`);
};

// Clear user cart
export const clearUserCart = (userId) => {
  return httpClient.delete(`${CART_API_BASE}/clear/${userId}`);
};

// Get cart item count
export const getCartItemCount = (userId) => {
  return httpClient.get(`${CART_API_BASE}/count/${userId}`);
};

// Create payment intent
export const createPaymentIntent = (paymentRequest) => {
  return httpClient.post(`${CART_API_BASE}/create-payment-intent`, paymentRequest);
};

// Confirm payment
export const confirmPayment = (paymentConfirmation) => {
  return httpClient.post(`${CART_API_BASE}/confirm-payment`, paymentConfirmation);
};

export default {
  addToCart,
  getUserCart,
  updateCartItemQuantity,
  removeFromCart,
  clearUserCart,
  getCartItemCount,
  createPaymentIntent,
  confirmPayment,
};
