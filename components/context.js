import { createContext, useContext, useState, useEffect } from 'react';
import Router from 'next/router';
import './firebase';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged  
} from 'firebase/auth';
const AppContext = createContext();

export function context() {
  return useContext(AppContext);
}

export function ContextProvider({ children }) {
  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();

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
    let result;
    await signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        result = { error: false };
        setUser(userCredential.user);
        Router.push('/');
      })
      .catch(error => {
        result = { error: true, data: error.code };
        console.warn(error.message);
      })
    return result;
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
      setLoading(false);
    })
  }, []);

  const contextValues = {
    user,
    loading,
    createAccount,
    login,
    logOut
  }

  return (
    <AppContext.Provider value={ contextValues }>
      {children}
    </AppContext.Provider>
  );
}