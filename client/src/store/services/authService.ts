import { createApi } from "@reduxjs/toolkit/query/react";
import { api } from "./api";

export const AuthService = createApi({
  reducerPath: "authService",
  tagTypes: ["authentication"],
  baseQuery: api,
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: (payload) => ({
        url: "/auth/signup",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["authentication"],
    }),
    logIn: builder.mutation({
      query: (payload) => ({
        url: "/auth/login",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["authentication"],
    }),
    resetPassword: builder.mutation({
      query: (payload) => ({
        url: "/auth/reset-password",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["authentication"],
    }),
    logOut: builder.mutation({
      query: (payload) => ({
        url: "/auth/logout",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["authentication"],
    }),
    refreshAccessToken: builder.mutation({
      query: (refresh_token) => ({
        url: "/auth/refresh_token",
        method: "POST",
        body: { refresh_token },
      }),
      invalidatesTags: ["authentication"],
    }),
  }),
});

export const {
  useSignUpMutation,
  useLogInMutation,
  useResetPasswordMutation,
  useLogOutMutation,
  useRefreshAccessTokenMutation,
} = AuthService;
