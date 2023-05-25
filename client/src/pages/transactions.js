import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { TransactionsTable } from "src/sections/transactions/table";
import { Search } from "src/components/search";
import { useGetTransactionsQuery } from "src/store/services/transactionService";
import { TransactionModal } from "src/sections/transactions/modal";
import { useAllCustomersQuery } from "src/store/services/customerService";
import { useAllCurrenciesQuery } from "src/store/services/currencyService";
import { setCustomerOptions, setCurrencyOptions } from "src/store/reducers/optionsSlice";
import { useDispatch } from "react-redux";

const Page = () => {
  // Get dispatch method from Redux
  const dispatch = useDispatch();

  // Define initial state
  const [state, setState] = useState({
    page: 0,
    rowsPerPage: 10,
    count: 0,
    wallets: [],
    searchTerm: "",
  });

  // Get customer and currency options data
  const { data: customerOptions } = useAllCustomersQuery();
  const { data: currencyOptions } = useAllCurrenciesQuery();

  // Get transaction data
  const { data } = useGetTransactionsQuery(state);

  // Define functions to handle changes in rows per page, page number, and search term respectively
  const onRowsPerPageChange = useCallback((event) => {
    setState((prevState) => ({ ...prevState, rowsPerPage: event.target.value }));
  }, []);

  const onPageChange = useCallback((event, value) => {
    setState((prevState) => ({ ...prevState, page: value }));
  }, []);

  const onSearch = useCallback((search) => {
    setState((prevState) => ({ ...prevState, searchTerm: search }));
  }, []);

  // Update state with transaction data when the data is available
  useEffect(() => {
    if (data) {
      setState((prevState) => ({
        ...prevState,
        count: data.total,
        wallets: data.wallets,
      }));
    }
  }, [data]);

  // Update state with customer options when the options are available and dispatch an action to set customer options in Redux store
  useEffect(() => {
    if (customerOptions) {
      dispatch(setCustomerOptions(customerOptions));
    }
  }, [customerOptions]);

  // Update state with currency options when the options are available and dispatch an action to set currency options in Redux store
  useEffect(() => {
    if (currencyOptions) {
      dispatch(setCurrencyOptions(currencyOptions));
    }
  }, [currencyOptions]);
  return (
    <>
      <Head>
        <title>Transactions | e-khata</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, pt: 2, pb: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Transactions</Typography>
              </Stack>
              <TransactionModal />
            </Stack>
            <Search onSearch={onSearch} item="transactions" />
            <TransactionsTable
              page={state.page}
              rowsPerPage={state.rowsPerPage}
              onRowsPerPageChange={onRowsPerPageChange}
              count={state.count}
              onPageChange={onPageChange}
              items={state.wallets}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
