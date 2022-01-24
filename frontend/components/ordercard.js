import Loading from '../components/loading';
import { gql, useQuery } from '@apollo/client';
import Error from '../components/error';
import NoData from '../components/nodata';



export default function OrdersCard({ user }) {

  // get user data using GraphQL
  const GET_ORDERS = gql`
    query($user: String!) {
      orders(where: { user: $user}){
        user
        id
        dishes
        amount
        datetime
      }
    }
  `;

  // query Strapi database with Apollo
  const { loading, error, data } = useQuery(GET_ORDERS, { variables: { user: user.id } });
  if (loading) return <Loading></Loading>;
  if (error) return <Error></Error>;
  if (data.orders.length < 1) return <NoData data='orders'></NoData>;

  const userOrderData = [...data.orders].reverse();
  console.log(userOrderData);

  return (
    <>
      {
        userOrderData.map(order => (
          <div key={order.id} className="plain-card" style={{ width: "100%", maxWidth: "500px"}}>
            <div style={{ textAlign: "center", marginBottom: "25px"}}>
              <h2 className="me-auto" style={{ marginBottom: "12px"}}>Order ID:</h2>
              <h2 style={{ fontWeight: "400"}}>{order.id}</h2>
              <p style={{ fontWeight: "400"}}>{new Date(order.datetime).toLocaleString()}</p>
            </div>
            {
              order.dishes.map(dish => (
                <div key={dish.id}>
                  <div className="d-flex">
                    <p className="me-auto">{dish.name}</p>
                    <p>${Number(dish.price) * Number(dish.quantity)}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: ".9rem" }}>From {dish.restaurant}</p>
                  </div>
                  <div className="d-flex" style={{ marginBottom: "10px"}}>
                    <p style={{ fontSize: "1rem" }}>Qty {dish.quantity}</p>
                  </div>
                </div>
              ))
            }
            <h2 style={{ textAlign: "center" }}>Total ${parseFloat(order.amount / 100)}</h2>
          </div>
        ))
      }
    </>
  );
}