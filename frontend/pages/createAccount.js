import { useState, useRef, useEffect } from 'react';
import Cookies from 'js-cookie';
import Router from 'next/router';
import Link from 'next/link';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { context } from '../components/context';
import Loading from '../components/loading';
import Success from '../components/success';

export default function CreateAccount() {
  const { user, authenticationLoading, createAccount, googleSignIn } = context();
  const [error, setError] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const strapiUser = Cookies.get('strapiUser');
    if (strapiUser) Router.push('/');
  },[]);

  const usernameRef         = useRef()
  const emailRef            = useRef();
  const passwordRef         = useRef();
  const confirmPasswordRef  = useRef();

  async function handleSubmit(e) {
    e.preventDefault();
    setButtonDisable(true);

    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      setButtonDisable(false);
      return setError('Passwords do not match');
    }

    const result = await createAccount(
      usernameRef.current.value, 
      emailRef.current.value, 
      passwordRef.current.value
    );
    
    if (result.error) {
      setError(result.data);
    } else {
      setError(false);
      setSuccess(true);
    }
    setButtonDisable(false);
  }

  async function handleGoogleSubmit(e) {
    e.preventDefault();
    setButtonDisable(true);

    const result = await googleSignIn();
    
    if (result.error) {
      setError(result.data);
    } else {
      setError(false);
    }
    setButtonDisable(false);
  }

  if (success) {
    return (
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <Success
          message="Your account was successfully created."
          button="Go To Restaurants"
        ></Success>   
      </Container>
    );
  } else {
    return (
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>      
        {
          authenticationLoading || user ? (
            <Loading></Loading>
          ) : (
            <div className="w-100" style={{ maxWidth: "400px"}}>
              <Card>
                <Card.Body>
                  <h2 className="text-center mb-4">Create An Account</h2>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-4" id="username">
                      <Form.Label>Username</Form.Label>
                      <Form.Control type="username" ref={usernameRef} autoComplete="username" required></Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-4" id="email">
                      <Form.Label>Email</Form.Label>
                      <Form.Control type="email" ref={emailRef} autoComplete="email" required></Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-4" id="password">
                      <Form.Label>Password</Form.Label>
                      <Form.Control type="password" ref={passwordRef} autoComplete="new-password" required></Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-4" id="confirmPassword">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control type="password" ref={confirmPasswordRef} autoComplete="new-password" required></Form.Control>
                    </Form.Group>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Button className="w-100" type="submit" disabled={buttonDisable}>Sign Up</Button>
                  </Form>
                  <Button className="w-100" onClick={handleGoogleSubmit} disabled={buttonDisable}>Sign In With Google</Button>
                </Card.Body>
              </Card>
              <div className="w-100 text-center mt-2">
                Already have an account? <Link href="/login"><a style={{color: "blue"}}>Log In</a></Link>
              </div>
            </div>
          )
        }
      </Container>
    );
  }
};
