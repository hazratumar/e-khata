import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { CustomersTable } from "src/sections/customers/table";
import { Search } from "src/components/search";
import { AddCustomer } from "src/sections/customers/add";
import { useGetCustomersQuery } from "src/store/services/customerService";

const Page = () => {
  const [state, setState] = useState({
    page: 0,
    rowsPerPage: 10,
    count: 0,
    customers: [],
    searchTerm: "",
  });

  const { data } = useGetCustomersQuery(state);

  const handleRowsPerPageChange = useCallback((event) => {
    setState((prevState) => ({ ...prevState, rowsPerPage: event.target.value }));
  }, []);

  const handlePageChange = useCallback((event, value) => {
    setState((prevState) => ({ ...prevState, page: value }));
  }, []);

  const handleSearch = useCallback((search) => {
    setState((prevState) => ({ ...prevState, searchTerm: search }));
  }, []);

  useEffect(() => {
    if (data) {
      setState((prevState) => ({ ...prevState, count: data.total, customers: data.customers }));
    }
  }, [data]);

  return (
    <>
      <Head>
        <title>Customers | Rahat Shinwari Enterprises</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, pt: 2, pb: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Typography variant="h4">Customers</Typography>
              <AddCustomer />
            </Stack>
            <Search onSearch={handleSearch} item="customers" />
            <CustomersTable
              page={state.page}
              rowsPerPage={state.rowsPerPage}
              onRowsPerPageChange={handleRowsPerPageChange}
              count={state.count}
              onPageChange={handlePageChange}
              items={state.customers}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
