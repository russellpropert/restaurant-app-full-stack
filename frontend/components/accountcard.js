import Loading from '../components/loading';
import { gql, useQuery } from '@apollo/client';
import Error from '../components/error';
import NoData from '../components/nodata';



export default function AccountCard({ user }) {

  // get user data using GraphQL
  const GET_USER = gql`
    query($id: ID!) {
      user(id: $id) {
        id
        username
        email
      }
    }
  `;

  // query Strapi database with Apollo
  const { loading, error, data } = useQuery(GET_USER, { variables: { id: user.id } });
  if (loading) return <Loading></Loading>;
  if (error) return <Error></Error>;
  if (data.user.length < 1) return <NoData data='users'></NoData>;

  console.log(data);

  return (
    <div className="plain-card" style={{ width: "100%", maxWidth: "500px", textAlign: "center"}}>
      <h2 style={{ textAlign: "center" }}>Your Info</h2>
      <p><b>User Account ID:</b></p>
      <p style={{ marginBottom: "20px"}}>{data.user.id}</p>
      <p><b>Username:</b></p>
      <p style={{ marginBottom: "20px"}}>{data.user.username}</p>
      <p><b>Email:</b></p>
      <p style={{ marginBottom: "20px"}}>{data.user.email}</p>
    </div>
  );
}