import Link from 'next/link';
import { Button } from 'react-bootstrap';

export default function Success({ message, button }) {

  return (
    <main className='main'>
      <h1 className="title">Success</h1>
      <p className="description">{message}</p>
      <Link href="/">
        <a>
          <Button>{button}</Button>
        </a>
      </Link>
    </main>
  );
}