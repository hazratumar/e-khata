import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = process.env.SERVER_URL;

interface TokenState {
  auth: {
    AT_Token: string;
  };
}
export const api = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as TokenState).auth.AT_Token;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});
