import { createApi } from "@reduxjs/toolkit/query/react";
import { api } from "./api";

export const TransactionsService = createApi({
  reducerPath: "transactionService",
  tagTypes: ["transactions"],
  baseQuery: api,
  endpoints: (builder) => ({
    addTransaction: builder.mutation({
      query: (payload) => ({
        url: `/transactions`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["transactions"],
    }),
    getTransactions: builder.query({
      query: ({ page, rowsPerPage, searchTerm }) => {
        let url = `/transactions/${page}/${rowsPerPage}`;
        if (searchTerm) {
          url += `/${searchTerm}`;
        }
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["transactions"],
    }),
    updateTransaction: builder.mutation({
      query: (payload) => ({
        url: `/transactions`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["transactions"],
    }),
  }),
});

export const { useAddTransactionMutation, useGetTransactionsQuery, useUpdateTransactionMutation } =
  TransactionsService;