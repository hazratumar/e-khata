import { createApi } from "@reduxjs/toolkit/query/react";
import { api } from "./api";

export const BalanceService = createApi({
  reducerPath: "balanceService",
  tagTypes: ["balances"],
  baseQuery: api,
  endpoints: (builder) => ({
    addBalance: builder.mutation({
      query: (payload) => ({
        url: `/balances`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["balances"],
    }),
    getOneBalance: builder.query({
      query: ({ balanceId }) => ({
        url: `/balances/${balanceId}`,
        method: "GET",
      }),
      providesTags: ["balances"],
    }),
    getBalance: builder.query({
      query: ({ page, rowsPerPage, searchTerm }) => {
        let url = `/balances/${page}/${rowsPerPage}`;
        if (searchTerm) {
          url += `/${searchTerm}`;
        }
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["balances"],
    }),
    getBalanceByCurrency: builder.query({
      query: () => ({
        url: "balances/by_currency",
        method: "GET",
      }),
      providesTags: ["balances"],
    }),
    getCreditByDateRange: builder.query({
      query: ({ startDate, endDate }) => ({
        url: `balances/credit_by_date/${startDate}/${endDate}`,
        method: "GET",
      }),
      providesTags: ["balances"],
    }),
    updateBalance: builder.mutation({
      query: (payload) => ({
        url: `/balances`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["balances"],
    }),
  }),
});

export const {
  useAddBalanceMutation,
  useGetBalanceQuery,
  useGetBalanceByCurrencyQuery,
  useGetCreditByDateRangeQuery,
  useGetOneBalanceQuery,
  useUpdateBalanceMutation,
} = BalanceService;
