import { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import Loading from '../components/loading';
import Error from '../components/error';
import NoData from '../components/nodata';
import Search from '../components/search'
import AppCards from '../components/appcards'
import { context } from '../components/context';
import Router from 'next/router';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import Cart from '../components/cart';

export default function Dishes() {
  const { restaurantID, user, cart, addOneToCart } = context();
  const [searchQuery, setSearchQuery] = useState();

  // Route would throw an error unless wrapped in useEffect
  useEffect(() => {
    if (!restaurantID || !user) Router.push('/');
  }, []);

  if (!restaurantID || !user) {
    return (
      <main className='main'>
        <Loading></Loading>
      </main>
    );
  }

  // get restaurant data using GraphQL
  const GET_RESTAURANT_DISHES = gql`
    query($id: ID!) {
      restaurant(id: $id) {
        id
        name
        dishes {
          id
          name
          description
          price
          image {
            url
          }
        }
      }
    }
  `;

  // query Strapi database with Apollo
  const { loading, error, data } = useQuery(GET_RESTAURANT_DISHES, { variables: { id: restaurantID }});
  if (loading) return <Loading></Loading>;
  if (error) return <Error></Error>;
  if (data.restaurant.dishes.length < 1) return <NoData data='restaurants'></NoData>;

  let dishesPlusRestaurant = []
  for (let i = 0; i < data.restaurant.dishes.length; i++) {
    dishesPlusRestaurant.push({...data.restaurant.dishes[i], restaurant: data.restaurant.name});
  }

  // filter data with searchQuery
  let dishesData;
  if (searchQuery) {
    dishesData = dishesPlusRestaurant.filter(dish => dish.name.toLowerCase().includes(searchQuery));
  } else {
    dishesData = dishesPlusRestaurant;
  }
  
  // handle button click on card
  function handleClick(item) {
    addOneToCart(item);
  }

  return(
    <main className='main'>
      <h1 className="title">Dishes for {data.restaurant.name}</h1>
      <Link href="/">
        <a>
          <Button style={{ marginTop: "40px" }}>Back To Restauants</Button>
        </a>
      </Link>
      <p className='description'>Please choose a dish from the menu.</p>
      <Search setSearchQuery={setSearchQuery}></Search>
      {
        dishesData.length > 0 ?
        <AppCards type="dishes" data={dishesData} handleClick={handleClick}></AppCards> :
        <p className='description'>No dishes were found with that search criteria.</p>
      }
      {
        cart.length > 0 ?
        <Cart type="order" /> :
        null
      }
    </main>
  );
}