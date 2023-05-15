import { createApi } from "@reduxjs/toolkit/query/react";
import { api } from "./api";

export const WalletService = createApi({
  reducerPath: "walletService",
  tagTypes: ["wallets"],
  baseQuery: api,
  endpoints: (builder) => ({
    addWallet: builder.mutation({
      query: (payload) => ({
        url: `/wallets`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["wallets"],
    }),
    getWallets: builder.query({
      query: ({ page, rowsPerPage, searchTerm }) => {
        let url = `/wallets/${page}/${rowsPerPage}`;
        if (searchTerm) {
          url += `/${searchTerm}`;
        }
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["wallets"],
    }),
    getBalance: builder.query({
      query: ({ page, rowsPerPage, searchTerm }) => {
        let url = `/wallets/balance/${page}/${rowsPerPage}`;
        if (searchTerm) {
          url += `/${searchTerm}`;
        }
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["wallets"],
    }),
    updateWallet: builder.mutation({
      query: (payload) => ({
        url: `/wallets`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["wallets"],
    }),
  }),
});

export const {
  useAddWalletMutation,
  useGetWalletsQuery,
  useGetBalanceQuery,
  useUpdateWalletMutation,
} = WalletService;
