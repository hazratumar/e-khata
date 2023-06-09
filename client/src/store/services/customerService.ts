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
    allCustomers: builder.query({
      query: () => ({
        url: "/customers",
        method: "GET",
      }),
      providesTags: ["customers"],
    }),
    customerDetail: builder.mutation({
      query: (id) => ({
        url: `/customers/detail/${id}`,
        method: "GET",
      }),
      invalidatesTags: ["customers"],
    }),
    customerHistory: builder.mutation({
      query: (id) => ({
        url: `/customers/history/${id}`,
        method: "GET",
      }),
      invalidatesTags: ["customers"],
    }),
    customerKhata: builder.mutation({
      query: (id) => ({
        url: `/customers/khata/${id}`,
        method: "GET",
      }),
      invalidatesTags: ["customers"],
    }),
    selfCustomers: builder.query({
      query: () => ({
        url: "/customers/self",
        method: "GET",
      }),
      providesTags: ["customers"],
    }),
    getCustomers: builder.query({
      query: ({ page, rowsPerPage, searchTerm }) => {
        let url = `/customers/${page}/${rowsPerPage}`;
        if (searchTerm) {
          url += `/${searchTerm}`;
        }
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["customers"],
    }),
    updateCustomer: builder.mutation({
      query: (payload) => ({
        url: `/customers`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["customers"],
    }),
  }),
});

export const {
  useAddCustomerMutation,
  useAllCustomersQuery,
  useSelfCustomersQuery,
  useGetCustomersQuery,
  useCustomerDetailMutation,
  useCustomerKhataMutation,
  useCustomerHistoryMutation,
  useUpdateCustomerMutation,
} = CustomerService;
