import { createContext, useContext, useState, useEffect } from 'react';
import Router from 'next/router';
import './firebase';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider
} from 'firebase/auth';
import axios from 'axios';
const AppContext = createContext();

export function context() {
  return useContext(AppContext);
}

export function ContextProvider({ children }) {
  const [user, setUser] = useState(false);
  const [authenticationLoading, setAuthenticationLoading] = useState(true);

  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  async function createAccount(email, password) {
    let result = {};
    await createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        result = { error: false };
        setUser(userCredential.user);
      })
      .catch(error => {
        result = { error: true, data: error.code };
        console.warn(error.message);
      });
  
    return result;
  }

  async function login(email, password) {
    let errorResult;
    await signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        errorResult = { error: false };
        setUser(userCredential.user);
        Router.push('/');
      })
      .catch(error => {
        errorResult = { error: true, data: error.code };
        console.warn(error.message);
      })
    return errorResult;
  }

  async function strapiGoogleAuth(accessToken) {
    await axios
      .get(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/auth/google/callback?access_token=${accessToken}`)
      .then((res) => {
        console.log('Strapi JWT: ', res.data.jwt)
      })
      .catch(error => {
        console.warn(error);
      })
  }

  async function googleSignIn() {
    let errorResult;
    await signInWithPopup(auth, provider)
      .then(result => {
        errorResult = { error: false }
        const userCredential = GoogleAuthProvider.credentialFromResult(result);
        console.log('User Credential: ', userCredential);
        // const token = credential.accessToken;
        // console.log('Token: ', token);
        setUser(result.user);
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

  async function logOut() {
    await signOut(auth)
      .then(() => {
        setUser(false);
        Router.push('/');
      })
      .catch((error) => {
        console.warn('Logout error: ', error);
      });
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      }
      setAuthenticationLoading(false);
    })
  }, []);

  const contextValues = {
    user,
    authenticationLoading,
    createAccount,
    login,
    googleSignIn,
    logOut
  }

  return (
    <AppContext.Provider value={ contextValues }>
      {children}
    </AppContext.Provider>
  );
}