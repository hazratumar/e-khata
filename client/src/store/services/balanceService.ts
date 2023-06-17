import { createApi } from "@reduxjs/toolkit/query/react";
import { api } from "./api";

export const BalanceService = createApi({
  reducerPath: "balanceService",
  tagTypes: ["balance"],
  baseQuery: api,
  endpoints: (builder) => ({
    addBalance: builder.mutation({
      query: (payload) => ({
        url: `/balance`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["balance"],
    }),
    getOneBalance: builder.query({
      query: ({ balanceId }) => ({
        url: `/balance/${balanceId}`,
        method: "GET",
      }),
      providesTags: ["balance"],
    }),
    getBalance: builder.query({
      query: ({ page, rowsPerPage, searchTerm }) => {
        let url = `/balance/${page}/${rowsPerPage}`;
        if (searchTerm) {
          url += `/${searchTerm}`;
        }
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["balance"],
    }),
    getBalanceByCurrency: builder.query({
      query: () => ({
        url: "balance/by_currency",
        method: "GET",
      }),
      providesTags: ["balance"],
    }),
    getDashboardData: builder.query({
      query: ({ startDate, endDate }) => ({
        url: `balance/dashboard/${startDate}/${endDate}`,
        method: "GET",
      }),
      providesTags: ["balance"],
    }),
    updateBalance: builder.mutation({
      query: (payload) => ({
        url: `/balance`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["balance"],
    }),
  }),
});

export const {
  useAddBalanceMutation,
  useGetBalanceQuery,
  useGetBalanceByCurrencyQuery,
  useGetDashboardDataQuery,
  useGetOneBalanceQuery,
  useUpdateBalanceMutation,
} = BalanceService;
