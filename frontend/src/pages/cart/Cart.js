import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cartApi from '../../api/cartApi';
import './Cart.css';

const Cart = ({ userId }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [userId]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartApi.getUserCart(userId);
      setCartItems(response.data.cartItems || []);
      setTotal(response.data.total || 0);
      setError(null);
    } catch (err) {
      setError('Failed to load cart items');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await cartApi.updateCartItemQuantity(cartItemId, newQuantity);
      fetchCart(); // Refresh cart to update totals
    } catch (err) {
      setError('Failed to update quantity');
      console.error('Error updating quantity:', err);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      await cartApi.removeFromCart(cartItemId);
      fetchCart(); // Refresh cart
    } catch (err) {
      setError('Failed to remove item');
      console.error('Error removing item:', err);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await cartApi.clearUserCart(userId);
        fetchCart(); // Refresh cart
      } catch (err) {
        setError('Failed to clear cart');
        console.error('Error clearing cart:', err);
      }
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return <div className="cart-loading">Loading cart...</div>;
  }

  if (error) {
    return <div className="cart-error">{error}</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate('/shop')} className="btn-primary">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Shopping Cart</h1>
      
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image">
                {item.inventory?.itemImage && (
                  <img 
                    src={`http://localhost:8080/uploads/${item.inventory.itemImage}`}
                    alt={item.inventory.itemName}
                  />
                )}
              </div>
              
              <div className="cart-item-details">
                <h3>{item.inventory?.itemName}</h3>
                <p className="item-category">{item.inventory?.itemCategory}</p>
                <p className="item-details">{item.inventory?.itemDetails}</p>
              </div>
              
              <div className="cart-item-quantity">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button 
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="cart-item-actions">
                <button 
                  className="btn-remove"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-item">
            <span>Total Items:</span>
            <span>{cartItems.length}</span>
          </div>
          <div className="summary-item total">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          
          <div className="cart-actions">
            <button onClick={handleClearCart} className="btn-secondary">
              Clear Cart
            </button>
            <button onClick={handleCheckout} className="btn-primary">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
