import { useState, useEffect } from 'react';
import Router from 'next/router';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { context } from '../components/context';
import CheckoutForm from '../components/checkoutform';
import Loading from '../components/loading';
import Success from '../components/success';

export default function Checkout() {
  const { user, cart, successfulCheckout } = context();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user || cart.length === 0) Router.push('/');
  }, []);

  useEffect(() => {
    if (success) successfulCheckout();
  }, [success]);

  // load stripe
  const stripePromise = loadStripe(
    "pk_test_51K4xJIJo0q5k9952EujLBLNpMkUcixOQIPC4VuaambDfQphtsFrkTl6kVUpNi08JCEmwv9cKzJ7msEEq8NzgHfn700y7RWwl9z"
  );

  function handleSuccess() {
    setSuccess(true);
  }

  if (success) {
    return (
      <Success
        message="Your transaction was successful."
        button="Back to Restaurants"
      ></Success>
    );
  } else {
    return (
      !user || cart.length === 0 ?
      <main className='main'>
        <Loading></Loading>
      </main> :
      <main className='main'>
        <h1 className="title">Checkout</h1>
        <Elements stripe={stripePromise}>
          <CheckoutForm handleSuccess={handleSuccess} />
        </Elements>
      </main>
    );
  }
}