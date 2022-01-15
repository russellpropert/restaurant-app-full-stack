import { createContext, useContext, useState, useEffect } from 'react';
import Router from 'next/router';
import './firebase';
import { 
  getAuth, 
  signOut,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import axios from 'axios';
import Cookies from 'js-cookie';
const AppContext = createContext();

export function context() {
  return useContext(AppContext);
}

export function ContextProvider({ children }) {
  const [user, setUser] = useState(false);
  const [authenticationLoading, setAuthenticationLoading] = useState(true);
  const [restaurantID, setRestaurantID] = useState(false);
  const [cart, setCart] = useState([]);

  // remove cookies for testing.
  // Cookies.remove('cart');

  //// Authentication Section ////
  // set up Firebase Goggle authentication
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  // set Strapi URL
  const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

  // create an account
  async function createAccount(username, email, password) {
    // prevent this function from being run on a server
    if (typeof window === "undefined") {
      return;
    }

    let errorResult = {};

    await axios
      .post(`${API_URL}/auth/local/register`, { username, email, password })
      .then(result => {
        errorResult = { error: false };
        // Set user cookies
        Cookies.set('strapiToken', result.data.jwt);
        const userData = JSON.stringify(result.data.user);
        Cookies.set('strapiUser', userData);
        // console.log('Context Strapi JWT: ', result.data.jwt);
        console.log('Context Strapi Data: ', result.data);
        setUser(result.data.user);
      })
      .catch(error => {
        console.warn(error);
        errorResult = { error: true, data: 'The username or email you chose is already in use. Please try something else.' };
      })

    return errorResult;
  }

  // login
  async function login(identifier, password) {
    // prevent this function from being run on a server
    if (typeof window === "undefined") {
      return;
    }

    let errorResult;

    await axios
      .post(`${API_URL}/auth/local`, { identifier, password })
      .then(result => {
        errorResult = { error: false };
        // Set user cookies
        Cookies.set('strapiToken', result.data.jwt);
        const userData = JSON.stringify(result.data.user);
        Cookies.set('strapiUser', userData);
        // console.log('Context Strapi JWT: ', result.data.jwt);
        console.log('Context Result Data', result.data);
        setUser(result.data.user);
        Router.push('/');
      })
      .catch(error => {
        console.warn(error);
        errorResult = { error: true, data: 'Incorrect email or password' };
      })

    return errorResult;
  }

  // Strapi authentication after Google sign in
  async function strapiGoogleAuth(accessToken) {
    // prevent this function from being run on a server
    if (typeof window === "undefined") {
      return;
    }

    await axios
      .get(`${API_URL}/auth/google/callback?access_token=${accessToken}`)
      .then((result) => {
        // console.log('Context Strapi JWT: ', result.data.jwt)
        // Set user cookies
        Cookies.set('strapiToken', result.data.jwt);
        const userData = JSON.stringify(result.data.user);
        Cookies.set('strapiUser', userData);
        setUser(result.data.user);
        console.log('Context Strapi Data: ', result.data);
      })
      .catch(error => {
        console.warn(error);
      })
  }

  // sign in with Google
  async function googleSignIn() {
    // prevent this function from being run on a server
    if (typeof window === "undefined") {
      return;
    }

    let errorResult;

    await signInWithPopup(auth, provider)
      .then(result => {
        errorResult = { error: false }
        const userCredential = GoogleAuthProvider.credentialFromResult(result);
        // console.log('Context User Credential: ', userCredential);
        // const token = credential.accessToken;
        // console.log('Context Token: ', token);
        console.log('Context Google Data: ', result);
        strapiGoogleAuth(userCredential.accessToken)
        Router.push('/');
      })
      .catch(error => {
        const credential = GoogleAuthProvider.credentialFromError(error);
        errorResult = { error: true, data: error.code };
        console.warn('Credential From error: ', credential)
        console.warn('Email: ', error.email)
        console.warn(error.message);
      })

    return errorResult;
  }

  //logout
  async function logOut() {
    await signOut(auth)
      .then(() => {
        Cookies.remove('strapiToken');
        Cookies.remove('strapiUser');
        setUser(false);
        setCart([]);
        Router.push('/');
      })
      .catch((error) => {
        console.warn('Logout error: ', error);
      });
  }


  //// Cart Section ////
  // add item
  function addOneToCart(item) {
    let newCart = cart;
    const itemInCart = newCart.find(cartItem => cartItem.id === item.id);
    if (itemInCart !== undefined) {
      const index = newCart.indexOf(itemInCart);
      newCart[index].quantity ++;
      console.log('Context newCart add: ', newCart);
    } else {
      let newItem = {...item};
      newItem.quantity = 1;
      newCart.push(newItem);
      console.log('Context newCart add: ', newCart);
    }
    const cartData = JSON.stringify(newCart);
    Cookies.set(`${user.id}cart`, cartData)
    setCart([...newCart]);
  }

  // test for state change
  // setTimeout(() => setCart([{id: 1234}, {id: 2345}, {id: 3456}]), 2000)

  // remove item
  function removeOneFromCart(item) {
    let newCart = cart;
    const itemInCart = newCart.find(cartItem => cartItem.id === item.id);
    if (itemInCart.quantity > 1) {
      const index = newCart.indexOf(itemInCart);
      newCart[index].quantity --;
      console.log('Context newCart remove: ', newCart);
    } else {
      const index = newCart.indexOf(item);
      newCart.splice(index, 1);
      console.log('Context newCart remove: ', newCart);
    }
    setCart([...newCart]);

    // update/remove cart cookie
    const cartData = JSON.stringify(newCart);
    if (newCart.length === 0) {
      Cookies.remove(`${user.id}cart`);
    } else {
      Cookies.set(`${user.id}cart`, cartData);
    }
  }

  // delete item
  function deleteAllOfOneItemFromCart(item) {
    let newCart = cart;
    const index = newCart.indexOf(item);
    newCart.splice(index, 1);
    console.log('Context newCart delete: ', newCart)
    setCart([...newCart]);

    // update/remove cart cookie
    const cartData = JSON.stringify(newCart);
    if (newCart.length === 0) {
      Cookies.remove(`${user.id}cart`);
    } else {
      Cookies.set(`${user.id}cart`, cartData);
    }
  }

  //// Successful Checkout ////
  function successfulCheckout() {
    Cookies.remove(`${user.id}cart`);
    setCart([]);
  }

  //// Initial Setup ////
  // check to see if the variable contains valid JSON data
  function jsonDataTrue(string) {
    let jsonData;
    try {
      jsonData = JSON.parse(string);
    } catch (error) {
      return false;
    }
    return jsonData;
  }

  // change restaurant id for dishes page.
  function changeRestaurantID(id) {
    setRestaurantID(id);
  }

  // check cookies for existing session data
  useEffect(() => {
    // get authentication and authorization data from session cookies
    const strapiUserData = Cookies.get('strapiUser');
    const strapiUserDataObject = jsonDataTrue(strapiUserData);
    if (strapiUserDataObject) {
      console.log('Context Strapi User: ', strapiUserDataObject);
      setUser({...strapiUserDataObject});
    }

    setAuthenticationLoading(false);
  }, []);

  useEffect(() => {
    // get cart data from session cookie
    const cartData = Cookies.get(`${user.id}cart`);
    const cartDataObject = jsonDataTrue(cartData);
    if (cartDataObject) {
      setCart([...cartDataObject]);
    }
  }, [user]);

  //// Context Values ////
  const contextValues = {
    user,
    authenticationLoading,
    createAccount,
    login,
    googleSignIn,
    logOut,
    restaurantID,
    changeRestaurantID,
    cart,
    addOneToCart,
    removeOneFromCart,
    deleteAllOfOneItemFromCart,
    successfulCheckout
  }

  //// Context Provider ////
  return (
    <AppContext.Provider value={ contextValues }>
      {children}
    </AppContext.Provider>
  );
}