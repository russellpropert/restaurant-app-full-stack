import { useState, useRef, useEffect } from 'react';
import { context } from './context';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import Cookies from 'js-cookie';
import fetch from 'isomorphic-fetch';
import { Form, Button, Alert } from 'react-bootstrap';
import Cart from '../components/cart';
import styles from '../styles/Cart.module.css';

export default function CheckoutForm( { handleSuccess }) {
  const { cart } = context();
  const [error, setError] = useState(false);
  const [processing, setProcessing] = useState(false);
  const address = useRef();
  const city = useRef();
  const state = useRef();

  // cart total
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    const itemTotal = Number(cart[i].price) * Number(cart[i].quantity);
    total = total + itemTotal;
  }

  // set up stripe
  const stripe = useStripe();
  const elements = useElements();

  // options for CardElement.
  const CARD_OPTIONS = {
    iconStyle: 'solid',
    style: {
      base: {
        iconColor: '#67A',
        color: '#000',
        fontWeight: 500,
        fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
        fontSize: '16px',
        fontSmoothing: 'antialiased',
        ':-webkit-autofill': {
          color: '#fce883',
        },
        '::placeholder': {
          color: '#67A',
        },
      },
      invalid: {
        iconColor: '#d10a35',
        color: '#d10a35',
      },
    },
  };
  

  async function handleSubmit(e) {
    e.preventDefault();

    if (elements == null) {
      return;
    }

    setProcessing(true);
    if (error) setError('Processing');

    // Use elements.getElement to get a reference to the mounted Element.
    const token = await stripe.createToken(
      elements.getElement(CardElement)
    );
    console.log('Stripe createToken: ', token);

    if (token.hasOwnProperty('error')) {
      setError(token.error.message);
      setProcessing(false);
      return;
    }

    setError(false);

    // get Strapi API address
    const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
    // get session token from cookies
    const strapiToken = Cookies.get('strapiToken');
    console.log('Strapi token: ', strapiToken);
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: strapiToken && { Authorization: `Bearer ${strapiToken}` },
      body: JSON.stringify({
        amount: total,
        dishes: cart,
        address: address.current.value,
        city: city.current.value,
        state: state.current.value,
        token: token.token.id
      })
    })

    // output post data for testing
    // console.log(
    //   {
    //     method: 'POST',
    //     headers: strapiToken && { Authorization: `Bearer ${strapiToken}` },
    //     body: {
    //       amount: total,
    //       dishes: cart,
    //       address: address.current.value,
    //       city: city.current.value,
    //       state: state.current.value,
    //       token: token.token.id
    //     }
    //   }
    // );

    if (response.ok) {
      setProcessing(false);
      handleSuccess();
    } else {
      setProcessing(false);
      setError('Strapi API error: ', response.statusText);
    }
  };

    return (   
    <>
      <Cart type="checkout" />
      <div className={`${styles.cartCard} w-100`} style={{ maxWidth: "500px"}}>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4" id="username">
            <Form.Label>Address</Form.Label>
            <Form.Control type="text" ref={address} autoComplete="street-address" required></Form.Control>
          </Form.Group>
          <Form.Group className="mb-4" id="username">
            <Form.Label>City</Form.Label>
            <Form.Control type="text" ref={city} autoComplete="address-level2" required></Form.Control>
          </Form.Group>
          <Form.Group className="mb-4" id="username">
            <Form.Label>State</Form.Label>
            <Form.Control type="text" ref={state} autoComplete="address-level1" required></Form.Control>
          </Form.Group>
          <p style={{ fontSize: "1rem", textAlign: "center", marginBottom: "10px" }}>
            This project is in test mode. Do not use a real credit card number. 
            Enter a series of 424242… for the card, date, CVC, and zip. 
            The end result will look like this.
          </p>
          <p style={{ fontSize: "1.2rem", textAlign: "center", marginBottom: "10px" }}>
            4242 4242 4242 4242 04/24 242 42424
          </p>
          <div style={{
            border: "1px solid black", 
            borderRadius: "5px",
            padding: "10px"
          }}>
            <CardElement
              options={CARD_OPTIONS}
            />
          </div>
          <Button 
            className="w-100"
            style={{ marginTop: "20px"}}
            type="submit" 
            disabled={!stripe || !elements || processing}
          >
            Pay
          </Button>
          { error && <Alert variant="danger">{error}</Alert> }
        </Form>
      </div>
    </>
  );
}