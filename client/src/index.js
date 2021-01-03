import React from 'react';
import ReactDOM from 'react-dom';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  split,
  HttpLink
} from '@apollo/client';

import './style/index.scss';
import './style/react-vis.css';

import App from './components/App';

const { REACT_APP_BACKEND_DOMAIN } = process.env;

const domain = `${REACT_APP_BACKEND_DOMAIN}/graphql`;

const httpLink = new HttpLink({
  uri: `http://${domain}`,
});

const wsLink = new WebSocketLink({
  uri: `ws://${domain}`,
  options: {
    reconnect: true,
  },
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
