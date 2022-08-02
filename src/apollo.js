import CryptoJS from "crypto-js";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { ApolloLink } from "apollo-link";
import config from "@config";

const cache = new InMemoryCache();

const middlewareLink = new ApolloLink((operation, forward) => {
  const headers = {
    "x-api-key": CryptoJS.AES.encrypt(
      `${config.API_SECRET_VALUE}${new Date().toISOString()}`,
      config.API_SECRET_KEY
    ).toString()
  };

  // const token = getAuthToken();
  //
  // if(token){
  //   headers.Authorization = `Bearer ${token}`;
  // }

  operation.setContext({
    headers
  });

  return forward(operation);
});

const httpLink = new HttpLink({
  // uri: "https://www.backend.forbesmiddleeast.com/graphql"
  uri: process.env.APOLLO_LINK
    ? process.env.APOLLO_LINK
    : "https://forbes-server.1020dev.com/graphql"
});

const link = middlewareLink.concat(httpLink);
const defaultOptions = {
  // watchQuery: {
  //   fetchPolicy: 'no-cache',
  //   errorPolicy: 'ignore'
  // },
  query: {
    fetchPolicy: "no-cache",
    errorPolicy: "all"
  }
};
// const defaultOptions = {};
const client = new ApolloClient({
  cache,
  link,
  defaultOptions,
  ssrMode: true
});

export default client;
