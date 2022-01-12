import { ContextProvider } from '../components/context';
import Layout from '../components/layout';
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/globals.css'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider
} from '@apollo/client';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {

  // set up Apollo
  const apolloClient = new ApolloClient({
    uri: `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/graphql`,
    cache: new InMemoryCache()
  });

  return (
    <ContextProvider>
      <ApolloProvider client={apolloClient}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ApolloProvider>
    </ContextProvider>
  );
}

export default MyApp
