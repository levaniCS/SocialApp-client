import React from 'react'

import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'
import { ApolloProvider, split } from '@apollo/react-hooks'
import { setContext } from 'apollo-link-context'

import { getMainDefinition } from 'apollo-utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import App from './App'

const httpUri = process.env.NODE_ENV === 'production' ? 'https://warm-bastion-27092.herokuapp.com/' : 'http://localhost:4000/'
const wsUri = process.env.NODE_ENV === 'production' ? 'wss://warm-bastion-27092.herokuapp.com/graphql' : 'ws://localhost:4000/graphql'


const wsLink  = new WebSocketLink({
  uri: wsUri, options: { reconnect: true }
})

const httpLink = createHttpLink({ uri: httpUri })

const currentLink = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);

    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink
)

const authLink = setContext(() => {
  const token = localStorage.getItem('jwtToken')
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(currentLink),
  cache: new InMemoryCache(),
})


export default () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)