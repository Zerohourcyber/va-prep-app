import { loadStripe } from '@stripe/stripe-js';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePriceId = import.meta.env.VITE_STRIPE_PRICE_ID;

let stripePromise = null;

export const getStripe = () => {
  if (!stripePromise && stripePublishableKey) {
    stripePromise = loadStripe(stripePublishableKey);
  }
  return stripePromise;
};

export const isStripeConfigured = !!(stripePublishableKey && stripePriceId);

// Redirect to Stripe Checkout
export const redirectToCheckout = async (userEmail, userId) => {
  if (!isStripeConfigured) {
    alert('Stripe is not configured. Please add your Stripe keys to .env file.');
    return;
  }

  const stripe = await getStripe();
  if (!stripe) {
    alert('Failed to load Stripe');
    return;
  }

  // For a full implementation, you'd create a checkout session via a backend/edge function
  // This is a simplified client-side redirect
  try {
    const { error } = await stripe.redirectToCheckout({
      lineItems: [{ price: stripePriceId, quantity: 1 }],
      mode: 'subscription',
      successUrl: `${window.location.origin}/dashboard?success=true`,
      cancelUrl: `${window.location.origin}/dashboard?canceled=true`,
      customerEmail: userEmail,
      clientReferenceId: userId,
    });

    if (error) {
      console.error('Stripe error:', error);
      alert(error.message);
    }
  } catch (err) {
    console.error('Checkout error:', err);
    alert('Failed to start checkout. Please try again.');
  }
};

// Open Stripe Customer Portal (for managing subscriptions)
export const openCustomerPortal = async () => {
  // This requires a backend endpoint to create a portal session
  // For now, redirect to a placeholder
  alert('Customer portal requires backend setup. Contact support to manage your subscription.');
};

