import { createApi } from "@reduxjs/toolkit/query/react";
import { api } from "./api";

export const TransactionItemsService = createApi({
  reducerPath: "transactionItemService",
  tagTypes: ["transactionItems"],
  baseQuery: api,
  endpoints: (builder) => ({
    addTransactionItem: builder.mutation({
      query: (payload) => ({
        url: `/transaction-items`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["transactionItems"],
    }),
    getTransactionItems: builder.query({
      query: ({ transactionId }) => ({
        url: `/transaction-items/${transactionId}`,
        method: "GET",
      }),
      providesTags: ["transactionItems"],
    }),
  }),
});

export const { useGetTransactionItemsQuery, useAddTransactionItemMutation } =
  TransactionItemsService;
