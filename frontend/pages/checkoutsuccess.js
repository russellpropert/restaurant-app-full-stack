import { context } from '../components/context';
import Link from 'next/link';
import { Button } from 'react-bootstrap';

export default function Success() {
  const { user } = context();

  return (
    <main className='main'>
      <h1 className="title">Success</h1>
      <p className="description">Your transaction was successful.</p>
      <Link href="/">
        <a>
          <Button>Back to Restaurants</Button>
        </a>
      </Link>
    </main>
  );
}