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
