import { useEffect } from "react";
import { context } from '../components/context';
import Router from 'next/router'
import Loading from '../components/loading';
import OrdersCard from "../components/ordercard";

export default function Orders() {
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
      <h1 className="title">Orders</h1>
      <OrdersCard user={user} />
    </main>
  );
}