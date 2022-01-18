import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import Loading from './loading';
import Error from './error';
import NoData from './nodata';
import Search from './search'
import AppCards from './appcards'
import Router from 'next/router';
import { context } from './context';
import Cart from '../components/cart';

export default function Restaurants() {
  const { changeRestaurantID, cart } = context();
  const [searchQuery, setSearchQuery] = useState();

  // get restaurant data using GraphQL
  const GET_RESTAURANTS = gql`
    query {
      restaurants {
        id
        name
        description
        image {
          url
        }
      }
    }
  `;

  // query Strapi database with Apollo
  const { loading, error, data } = useQuery(GET_RESTAURANTS);
  if (loading) return <Loading></Loading>;
  if (error) return <Error></Error>;
  if (data.restaurants.length < 1) return <NoData data='restaurants'></NoData>;

  // filter data with searchQuery
  let restaurantData;
  if (searchQuery) {
    restaurantData = data.restaurants.filter(restaurant => restaurant.name.toLowerCase().includes(searchQuery));
  } else {
    restaurantData = data.restaurants;
  }

  // handle button click on card
  function handleClick(item) {
    changeRestaurantID(item.id);
    Router.push('/dishes');
  }

  return(
    <main className='main'>
      <h1 className="title">Restaurants</h1>
      <p className='description'>Please choose a restaurant you would like to order from.</p>
      <Search setSearchQuery={setSearchQuery}></Search>
      {
        restaurantData.length > 0 ?
        <AppCards type="restarants" data={restaurantData} handleClick={handleClick}></AppCards> :
        <p className='description'>No restaurants were found with that search criteria.</p>
      }
      {
        cart.length > 0 ?
        <Cart type="order" /> :
        null
      }
    </main>
  );
}