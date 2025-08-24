import client from "@/lib/apollo-client";
import { SIGNUP_MUTATION, LOGIN_MUTATION } from "@/graphql/mutations";

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface SignupVariables {
  name: string;
  email: string;
  password: string;
}

export interface LoginVariables {
  email: string;
  password: string;
}

export const authService = {
  signup: async (variables: SignupVariables): Promise<AuthResponse> => {
    const { data } = (await client.mutate({
      mutation: SIGNUP_MUTATION,
      variables,
    })) as { data: { signup: AuthResponse } };

    if (!data?.signup) {
      throw new Error("Signup failed");
    }

    // Store token and user data
    localStorage.setItem("token", data.signup.token);
    localStorage.setItem("user", JSON.stringify(data.signup.user));

    return data.signup;
  },

  login: async (variables: LoginVariables): Promise<AuthResponse> => {
    const { data } = (await client.mutate({
      mutation: LOGIN_MUTATION,
      variables,
    })) as { data: { login: AuthResponse } };

    if (!data?.login) {
      throw new Error("Login failed");
    }

    // Store token and user data
    localStorage.setItem("token", data.login.token);
    localStorage.setItem("user", JSON.stringify(data.login.user));

    return data.login;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Reset Apollo Client cache
    client.resetStore();
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getToken: () => {
    return localStorage.getItem("token");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};
