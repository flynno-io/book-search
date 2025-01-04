import './App.css';
import { ApolloProvider, InMemoryCache, ApolloClient, HttpLink } from '@apollo/client';
import Auth from './utils/auth';
import { Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';

const token = Auth.getToken();

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:3001/graphql',
    credentials: 'include',
  headers: {
    authorization: token ? `Bearer ${token}` : ''
  }
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all', // Allows partial data to be returned with errors
    },
  },
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div>
        <Navbar />
        <Outlet />
      </div>
    </ApolloProvider>
  );
}

export default App;