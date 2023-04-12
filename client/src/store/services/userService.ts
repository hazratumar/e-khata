import { createApi } from "@reduxjs/toolkit/query/react";
import { api } from "./api";

export const UserService = createApi({
    reducerPath: "authService",
    tagTypes: ["users"],
    baseQuery: api,
    endpoints: (builder) => ({
        updateUser: builder.mutation({
            query: (payload) => ({
                url: `/users`,
                method: "PUT",
                body: payload,
            }),
            invalidatesTags: ["users"],
        }),
    }),
});

export const {
    useUpdateUserMutation,
} = UserService;
