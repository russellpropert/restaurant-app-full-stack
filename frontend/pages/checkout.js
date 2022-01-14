import { useEffect } from 'react';
import Router from 'next/router';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { context } from '../components/context';
import Loading from '../components/loading';
import CheckoutForm from '../components/checkoutform';

export default function Checkout() {
  const { user, cart } = context();

  useEffect(() => {
    if (!user) Router.push('/');
    if (cart.length === 0) Router.push('/');
  }, []);

  if (!user || cart.length === 0) {
    return (
      <main className='main'>
        <Loading></Loading>
      </main>
    );
  }

  // load stripe
  const stripePromise = loadStripe(
    "pk_test_51K4xJIJo0q5k9952EujLBLNpMkUcixOQIPC4VuaambDfQphtsFrkTl6kVUpNi08JCEmwv9cKzJ7msEEq8NzgHfn700y7RWwl9z"
  );

  return (
    <main className='main'>
      <h1 className="title">Checkout</h1>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </main>
  );
}