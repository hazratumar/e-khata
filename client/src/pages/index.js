import Head from "next/head";
import { useState, useEffect } from "react";
import { Box, Container, Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { OverviewBudget } from "src/sections/overview/overview-budget";
import { useGetCreditByDateRangeQuery } from "src/store/services/balanceService";
import { getDateRange } from "src/utils/generic-functions";
import { FilterModal } from "src/sections/overview/filterModal";

const Page = () => {
  const [selectedOption, setSelectedOption] = useState(getDateRange(1));
  const { data, refetch } = useGetCreditByDateRangeQuery(selectedOption);

  const filterDashboard = (data) => {
    setSelectedOption(data);
  };

  useEffect(() => {
    refetch();
  }, [selectedOption]);

  return (
    <>
      <Head>
        <title>Overview | e-khata</title>
      </Head>
      <Box component="main">
        <Container maxWidth="xl">
          <Grid container spacing={3} my={2} justifyContent="flex-end">
            <FilterModal filterDashboard={filterDashboard} />
          </Grid>
          <Grid container spacing={3}>
            {data?.credit.map(({ abbreviation, amount, id }) => (
              <Grid key={id} item xs={12} sm={6} md={4} lg={2.4}>
                <OverviewBudget type="Credit" abbreviation={abbreviation} value={amount} />
              </Grid>
            ))}
            {data?.debit.map(({ abbreviation, amount, id }) => (
              <Grid key={id} item xs={12} sm={6} md={4} lg={2.4}>
                <OverviewBudget type="Debit" abbreviation={abbreviation} value={amount} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
