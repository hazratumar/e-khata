import { createApi } from "@reduxjs/toolkit/query/react";
import { api } from "./api";

export const ExpenseItemService = createApi({
  reducerPath: "expenseItemService",
  tagTypes: ["expense-items"],
  baseQuery: api,
  endpoints: (builder) => ({
    addExpenseItem: builder.mutation({
      query: (payload) => ({
        url: `/expense-items`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["expense-items"],
    }),
    allExpenseItems: builder.query({
      query: () => ({
        url: "/expense-items",
        method: "GET",
      }),
      providesTags: ["expense-items"],
    }),
    getExpenseItems: builder.query({
      query: ({ page, rowsPerPage, searchTerm }) => {
        let url = `/expense-items/${page}/${rowsPerPage}`;
        if (searchTerm) {
          url += `/${searchTerm}`;
        }
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["expense-items"],
    }),
    updateExpenseItem: builder.mutation({
      query: (payload) => ({
        url: `/expense-items`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["expense-items"],
    }),
  }),
});

export const {
  useAddExpenseItemMutation,
  useAllExpenseItemsQuery,
  useGetExpenseItemsQuery,
  useUpdateExpenseItemMutation,
} = ExpenseItemService;
