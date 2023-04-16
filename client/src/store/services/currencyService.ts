import { createApi } from "@reduxjs/toolkit/query/react";
import { api } from "./api";

export const CurrencyService = createApi({
  reducerPath: "currencyService",
  tagTypes: ["currencies"],
  baseQuery: api,
  endpoints: (builder) => ({
    addCurrency: builder.mutation({
      query: (payload) => ({
        url: `/currencies`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["currencies"],
    }),
    allCurrencies: builder.query({
      query: () => ({
        url: "/currencies",
        method: "GET",
      }),
      providesTags: ["currencies"],
    }),
    getCurrencies: builder.query({
      query: ({ page, rowsPerPage, searchTerm }) => {
        let url = `/currencies/${page}/${rowsPerPage}`;
        if (searchTerm) {
          url += `/${searchTerm}`;
        }
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["currencies"],
    }),
    updateCurrency: builder.mutation({
      query: (payload) => ({
        url: `/currencies`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["currencies"],
    }),
  }),
});

export const {
  useAddCurrencyMutation,
  useAllCurrenciesQuery,
  useGetCurrenciesQuery,
  useUpdateCurrencyMutation,
} = CurrencyService;
