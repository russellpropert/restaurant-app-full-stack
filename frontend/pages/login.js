import { useState, useRef } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { context } from '../components/context';
import Loading from '../components/loading';

export default function Login() {
  const { user, authenticationLoading, login, googleSignIn } = context();
  const [error, setError] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(false);

  if (user) Router.push('/');

  const emailRef            = useRef();
  const passwordRef         = useRef();

  async function handleFormSubmit(e) {
    e.preventDefault();
    setButtonDisable(true);

    const result = await login(emailRef.current.value, passwordRef.current.value);
    
    if (result.error) {
      setError(result.data);
    } else {
      setError();
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
      setError();
    }
    setButtonDisable(false);
  }

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
      {
        authenticationLoading || user ? (
          <Loading></Loading>
        ) : (
          <div className="w-100" style={{ maxWidth: "400px"}}>
            <Card>
              <Card.Body>
                <h2 className="text-center mb-4">Login</h2>
                <Form onSubmit={handleFormSubmit}>
                  <Form.Group className="mb-4" id="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" ref={emailRef} autoComplete="email" required></Form.Control>
                  </Form.Group>
                  <Form.Group className="mb-4" id="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" ref={passwordRef} autoComplete="new-password" required></Form.Control>
                  </Form.Group>
                  {error && <Alert variant="danger">{error}</Alert>}
                  <Button className="w-100" type="submit" disabled={buttonDisable}>Login</Button>
                </Form>
                <Button className="w-100" onClick={handleGoogleSubmit} disabled={buttonDisable}>Sign In With Google</Button>
              </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
              Need an account? <Link href="/createaccount"><a style={{color: "blue"}}>Sign Up</a></Link>
            </div>
          </div>
        )
      }
    </Container>
  );
}
