import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import cartApi from '../../api/cartApi';
import './Checkout.css';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_your_stripe_publishable_key_here');

const Checkout = ({ userId }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      initializeCheckout();
    }
  }, [userId]);

  const initializeCheckout = async () => {
    try {
      setLoading(true);
      
      // First, get cart details
      const cartResponse = await cartApi.getUserCart(userId);
      setCartItems(cartResponse.data.cartItems || []);
      setTotal(cartResponse.data.total || 0);

      if (cartResponse.data.cartItems.length === 0) {
        navigate('/cart');
        return;
      }

      // Create payment intent
      const paymentResponse = await cartApi.createPaymentIntent({
        userId: userId,
        currency: 'usd'
      });

      setClientSecret(paymentResponse.data.clientSecret);
      setError(null);
    } catch (err) {
      setError('Failed to initialize checkout');
      console.error('Error initializing checkout:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      setProcessing(true);
      setError(null);

      const stripe = await stripePromise;

      if (!stripe || !clientSecret) {
        throw new Error('Stripe not initialized');
      }

      // Redirect to Stripe Checkout
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: {
            // In a real implementation, you would use Stripe Elements
            // For now, this is a simplified version
          },
        },
      });

      if (error) {
        setError(error.message);
        setProcessing(false);
      } else if (paymentIntent.status === 'succeeded') {
        // Confirm payment on backend
        await cartApi.confirmPayment({
          paymentIntentId: paymentIntent.id,
          userId: userId
        });

        // Redirect to success page
        navigate('/payment-success');
      }
    } catch (err) {
      setError('Payment failed');
      console.error('Payment error:', err);
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="checkout-loading">Initializing checkout...</div>;
  }

  if (error && !clientSecret) {
    return (
      <div className="checkout-error">
        <p>{error}</p>
        <button onClick={() => navigate('/cart')} className="btn-primary">
          Back to Cart
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      
      <div className="checkout-content">
        <div className="order-summary">
          <h2>Order Summary</h2>
          {cartItems.map((item) => (
            <div key={item.id} className="checkout-item">
              <div className="item-info">
                <h4>{item.inventory?.itemName}</h4>
                <p>Quantity: {item.quantity}</p>
              </div>
            </div>
          ))}
          
          <div className="checkout-total">
            <strong>Total: ${total.toFixed(2)}</strong>
          </div>
        </div>
        
        <div className="payment-section">
          <h2>Payment Details</h2>
          
          {error && (
            <div className="payment-error">
              {error}
            </div>
          )}
          
          <div className="payment-info">
            <p><strong>Payment Method:</strong> Credit/Debit Card</p>
            <p><strong>Currency:</strong> USD</p>
            <p><strong>Amount:</strong> ${total.toFixed(2)}</p>
          </div>
          
          <button
            onClick={handlePayment}
            disabled={processing}
            className="btn-pay"
          >
            {processing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
          </button>
          
          <button
            onClick={() => navigate('/cart')}
            disabled={processing}
            className="btn-back"
          >
            Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
