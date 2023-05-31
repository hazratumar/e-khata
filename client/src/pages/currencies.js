import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { CurrenciesTable } from "../sections/currencies/table";
import { Search } from "src/components/search";
import { AddCurrency } from "src/sections/currencies/add";
import { useGetCurrenciesQuery } from "src/store/services/currencyService";

const Page = () => {
  const [state, setState] = useState({
    page: 0,
    rowsPerPage: 10,
    count: 0,
    currencies: [],
    searchTerm: "",
  });

  const { data } = useGetCurrenciesQuery(state);

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
      setState((prevState) => ({ ...prevState, count: data.total, currencies: data.currencies }));
    }
  }, [data]);

  return (
    <>
      <Head>
        <title>Currencies | e-khata</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, pt: 2, pb: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Typography variant="h4">Currencies</Typography>
              <AddCurrency />
            </Stack>
            <Search onSearch={onSearch} item="currencies" />
            <CurrenciesTable
              page={state.page}
              rowsPerPage={state.rowsPerPage}
              onRowsPerPageChange={onRowsPerPageChange}
              count={state.count}
              onPageChange={onPageChange}
              items={state.currencies}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
