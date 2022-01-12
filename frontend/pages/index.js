import Head from 'next/head';
import Image from 'next/image';
import Welcome from '../components/welcome';
import Restaurants from '../components/restaurants';
import { context } from '../components/context';

export default function Home() {
  const { user } = context();

  return (
    <div>
      <Head>
        <title>Restaurant App</title>
        <meta name="description" content="Restaurant app capstone project for the MIT full stack engineering with MERN program." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {
        user ?
        <Restaurants></Restaurants> :
        <Welcome></Welcome>
      }
    </div>
  )
}
