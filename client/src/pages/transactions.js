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
import { KhataModal } from "src/sections/transactions/khataModal";
import { HistoryModal } from "../sections/transactions/historyModal";

const Page = () => {
  const dispatch = useDispatch();
  const SERVER_URL = process.env.SECRET_KEY;

  console.log("====================================");
  console.log(SERVER_URL);
  console.log("====================================");
  const [state, setState] = useState({
    page: 0,
    rowsPerPage: 10,
    count: 0,
    wallets: [],
    searchTerm: "",
  });

  const { data: customerOptions } = useAllCustomersQuery();
  const { data: currencyOptions } = useAllCurrenciesQuery();

  const { data } = useGetTransactionsQuery(state);

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
        <title>Transactions | Rahat Shinwari Enterprises</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, pt: 2, pb: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Typography variant="h4">Transactions</Typography>
              <TransactionModal />
            </Stack>
            <Search
              onSearch={onSearch}
              item="transactions"
              historyModal={<HistoryModal />}
              khataModal={<KhataModal />}
            />
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
