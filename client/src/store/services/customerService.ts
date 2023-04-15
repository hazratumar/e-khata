import { createApi } from "@reduxjs/toolkit/query/react";
import { api } from "./api";

export const CustomerService = createApi({
  reducerPath: "customerService",
  tagTypes: ["customers"],
  baseQuery: api,
  endpoints: (builder) => ({
    addCustomer: builder.mutation({
      query: (payload) => ({
        url: `/customers`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["customers"],
    }),
    getCustomers: builder.query({
      query: ({ page, rowsPerPage }) => ({
        url: `/customers/${page + 1}/${rowsPerPage}`,
        method: "GET",
      }),
      providesTags: ["customers"],
    }),
  }),
});

export const { useAddCustomerMutation, useGetCustomersQuery } = CustomerService;
