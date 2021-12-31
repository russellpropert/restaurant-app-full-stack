import { useState, useRef } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { context } from '../components/context';

export default function CreateAccount() {
  const { user, loading, createAccount } = context();
  const [error, setError] = useState(false);

  if (user) Router.push('/');

  const emailRef            = useRef();
  const passwordRef         = useRef();
  const confirmPasswordRef  = useRef();

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      return setError('Passwords do not match');
    }

    const result = await createAccount(emailRef.current.value, passwordRef.current.value);
    
    if (result.error) {
      setError(result.data);
    } else {
      setError();
    }
  }

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
      {
        loading || user ? (
          <div className="w-100" style={{ maxWidth: "400px"}}>
            <h1 className="text-center">Loading</h1>
          </div>
        ) : (
          <div className="w-100" style={{ maxWidth: "400px"}}>
            <Card>
              <Card.Body>
                <h2 className="text-center mb-4">Create An Account</h2>
                <Form onSubmit={handleSubmit}>
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
                  {error ? <Alert variant="danger">{error}</Alert> : null}
                  <Button className="w-100" type="submit">Sign Up</Button>
                </Form>
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
};
