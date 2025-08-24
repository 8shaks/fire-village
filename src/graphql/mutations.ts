import { gql } from "@apollo/client";

export const SIGNUP_MUTATION = gql`
  mutation SignUp($input: SignupInput!) {
    signup(input: $input) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;

// Plaid mutations
export const CREATE_LINK_TOKEN_MUTATION = gql`
  mutation CreateLinkToken($input: CreateLinkTokenInput!) {
    createLinkToken(input: $input) {
      linkToken
      expiration
    }
  }
`;

export const EXCHANGE_PUBLIC_TOKEN_MUTATION = gql`
  mutation ExchangePublicToken($input: ExchangePublicTokenInput!) {
    exchangePublicToken(input: $input) {
      item {
        id
        institutionId
        institutionName
        status
      }
      accountsCreated
    }
  }
`;
