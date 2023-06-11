import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { BalanceTable } from "src/sections/balance/table";
import { Search } from "src/components/search";
import { useGetBalanceQuery } from "src/store/services/balanceService";
import { BalanceModal } from "src/sections/balance/modal";
import { useSelfCustomersQuery } from "src/store/services/customerService";
import { useAllCurrenciesQuery } from "src/store/services/currencyService";
import { setCustomerOptions, setCurrencyOptions } from "src/store/reducers/optionsSlice";
import { useDispatch } from "react-redux";

const Page = () => {
  const dispatch = useDispatch();

  const [state, setState] = useState({
    page: 0,
    rowsPerPage: 10,
    count: 0,
    wallets: [],
    searchTerm: "",
  });

  const { data: customerOptions } = useSelfCustomersQuery();
  const { data: currencyOptions } = useAllCurrenciesQuery();

  const { data } = useGetBalanceQuery(state);

  const onRowsPerPageChange = useCallback((event) => {
    setState((prevState) => ({ ...prevState, rowsPerPage: event.target.value }));
  }, []);

  const onPageChange = useCallback((event, value) => {
    setState((prevState) => ({ ...prevState, page: value }));
  }, []);

  const onSearch = useCallback((search) => {
    setState((prevState) => ({ ...prevState, searchTerm: search }));
  }, []);

  useEffect(() => {
    if (data) {
      setState((prevState) => ({
        ...prevState,
        count: data.total,
        wallets: data.wallets,
      }));
    }
  }, [data]);

  useEffect(() => {
    if (customerOptions) {
      dispatch(setCustomerOptions(customerOptions));
    }
  }, [customerOptions]);

  useEffect(() => {
    if (currencyOptions) {
      dispatch(setCurrencyOptions(currencyOptions));
    }
  }, [currencyOptions]);
  return (
    <>
      <Head>
        <title>Balance | Rahat Shinwari Enterprises</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, pt: 2, pb: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Typography variant="h4">Wallet</Typography>
              <BalanceModal />
            </Stack>
            <Search onSearch={onSearch} item="wallet" />
            <BalanceTable
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
