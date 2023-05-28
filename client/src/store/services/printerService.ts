import { createApi } from "@reduxjs/toolkit/query/react";
import { api } from "./api";

export const PrinterService = createApi({
  reducerPath: "printerService",
  tagTypes: ["report"],
  baseQuery: api,
  endpoints: (builder) => ({
    downloadReport: builder.mutation({
      query: ({ customer, currency, startDate, endDate }) => ({
        url: `/printer/${customer}/${currency}/${startDate}/${endDate}`,
        method: "GET",
      }),
      invalidatesTags: ["report"],
    }),
    customerReport: builder.query({
      query: ({ customer, currency, startDate, endDate }) => ({
        url: `/report/${customer}/${currency}/${startDate}/${endDate}`,
        method: "GET",
      }),
      providesTags: ["report"],
    }),
  }),
});

export const { useDownloadReportMutation, useCustomerReportQuery } = PrinterService;
