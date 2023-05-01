import { createApi } from "@reduxjs/toolkit/query/react";
import { api } from "./api";

export const TransactionItemsService = createApi({
  reducerPath: "transactionItemService",
  tagTypes: ["transactionItems"],
  baseQuery: api,
  endpoints: (builder) => ({
    getTransactionItems: builder.query({
      query: ({ transactionId }) => ({
        url: `/transaction-items/${transactionId}`,
        method: "GET",
      }),
      providesTags: ["transactionItems"],
    }),
  }),
});

export const { useGetTransactionItemsQuery } = TransactionItemsService;
