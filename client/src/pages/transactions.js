import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { TransactionsTable } from "src/sections/transactions/table";
import { Search } from "src/components/search";
import { useGetWalletsQuery } from "src/store/services/walletsService";
import { TransactionModal } from "src/sections/transactions/modal";

const Page = () => {
  const [state, setState] = useState({
    page: 0,
    rowsPerPage: 10,
    count: 0,
    wallets: [],
    searchTerm: "",
  });

  const { isSuccess, data } = useGetWalletsQuery(state);

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
    if (isSuccess) {
      setState((prevState) => ({
        ...prevState,
        count: data.total,
        wallets: data.wallets,
      }));
    }
  }, [data]);
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
