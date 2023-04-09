import { createApi } from "@reduxjs/toolkit/query/react";
import { api } from "./api";

export const AuthService = createApi({
    reducerPath: "authService",
    tagTypes: ["auth"],
    baseQuery: api,
    endpoints: (builder) => ({
        signUp: builder.mutation({
            query: (payload) => ({
                url: "/auth/signup",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["auth"],
        }),
        logIn: builder.mutation({
            query: (payload) => ({
                url: "/auth/login",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["auth"],
        }),
        logOut: builder.mutation({
            query: (payload) => ({
                url: "/auth/logout",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["auth"],
        }),
        refreshAccessToken: builder.mutation({
            query: (refresh_token) => ({
                url: "/auth/refresh_token",
                method: "POST",
                body: { refresh_token },
            }),
            invalidatesTags: ["auth"],
        }),
    }),
});

export const {
    useSignUpMutation,
    useLogInMutation,
    useLogOutMutation,
    useRefreshAccessTokenMutation,
} = AuthService;
