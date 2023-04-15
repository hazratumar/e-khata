import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import { ArrowDownOnSquareIcon, ArrowUpOnSquareIcon } from "@heroicons/react/24/solid";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
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

  const { isSuccess, data, refetch } = useGetCurrenciesQuery(state);

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
    refetch();
    if (isSuccess) {
      setState((prevState) => ({ ...prevState, count: data.total, currencies: data.currencies }));
    }
  }, [data, refetch]);

  return (
    <>
      <Head>
        <title>Currencies | e-khata</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, pt: 2, pb: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Currencies</Typography>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowUpOnSquareIcon />
                      </SvgIcon>
                    }
                  >
                    Import
                  </Button>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowDownOnSquareIcon />
                      </SvgIcon>
                    }
                  >
                    Export
                  </Button>
                </Stack>
              </Stack>
              <div>
                <AddCurrency />
              </div>
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
