import { createApi } from "@reduxjs/toolkit/query/react";
import { api } from "./api";

export const ReportService = createApi({
  reducerPath: "reportService",
  tagTypes: ["report"],
  baseQuery: api,
  endpoints: (builder) => ({
    downloadHistory: builder.mutation({
      query: ({ customer, currency, startDate, endDate }) => ({
        url: `/download/history/${customer}/${currency}/${startDate}/${endDate}`,
        method: "GET",
      }),
      invalidatesTags: ["report"],
    }),
    downloadKhata: builder.mutation({
      query: ({ customer, currency, startDate, endDate }) => ({
        url: `/download/khata/${customer}/${currency}/${startDate}/${endDate}`,
        method: "GET",
      }),
      invalidatesTags: ["report"],
    }),
    customerHistory: builder.query({
      query: ({ customer, currency, startDate, endDate }) => ({
        url: `/report/history/${customer}/${currency}/${startDate}/${endDate}`,
        method: "GET",
      }),
      providesTags: ["report"],
    }),
    customerKhata: builder.query({
      query: ({ customer, currency, startDate, endDate }) => ({
        url: `/report/khata/${customer}/${currency}/${startDate}/${endDate}`,
        method: "GET",
      }),
      providesTags: ["report"],
    }),
  }),
});

export const {
  useDownloadHistoryMutation,
  useDownloadKhataMutation,
  useCustomerHistoryQuery,
  useCustomerKhataQuery,
} = ReportService;
