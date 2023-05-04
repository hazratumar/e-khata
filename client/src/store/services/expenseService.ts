import { createApi } from "@reduxjs/toolkit/query/react";
import { api } from "./api";

export const ExpenseService = createApi({
  reducerPath: "ExpenseService",
  tagTypes: ["expenses"],
  baseQuery: api,
  endpoints: (builder) => ({
    addExpense: builder.mutation({
      query: (payload) => ({
        url: `/expenses`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["expenses"],
    }),
    allExpenses: builder.query({
      query: () => ({
        url: "/expenses",
        method: "GET",
      }),
      providesTags: ["expenses"],
    }),
    getExpenses: builder.query({
      query: ({ page, rowsPerPage, searchTerm }) => {
        let url = `/expenses/${page}/${rowsPerPage}`;
        if (searchTerm) {
          url += `/${searchTerm}`;
        }
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["expenses"],
    }),
    updateExpense: builder.mutation({
      query: (payload) => ({
        url: `/expenses`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["expenses"],
    }),
  }),
});

export const {
  useAddExpenseMutation,
  useAllExpensesQuery,
  useGetExpensesQuery,
  useUpdateExpenseMutation,
} = ExpenseService;
