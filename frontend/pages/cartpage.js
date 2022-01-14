import { useEffect } from "react";
import { context } from '../components/context';
import Router from 'next/router'
import Loading from '../components/loading';
import Cart from '../components/cart';

export default function CartPage() {
  const { user } = context();

  useEffect(() => {
    if (!user) Router.push('/');
  }, []);

  if (!user) {
    return (
      <main className='main'>
        <Loading></Loading>
      </main>
    );
  }
  
  return (
    <main className='main'>
      <h1 className="title">Cart</h1>
      <Cart type='order' />
    </main>
  );
}