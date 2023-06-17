import Head from "next/head";
import { useState } from "react";
import { Box, Container, Grid, CircularProgress, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { OverviewBudget } from "src/sections/overview/overview-budget";
import { useGetDashboardDataQuery } from "src/store/services/balanceService";
import { getDateRange } from "src/utils/generic-functions";
import { FilterModal } from "src/sections/overview/filterModal";
import { useGetCurrenciesQuery } from "src/store/services/currencyService";
import { dateFormat } from "../utils/generic-functions";

const Page = () => {
  const [selectedOption, setSelectedOption] = useState(getDateRange(1));
  const { data, isLoading } = useGetDashboardDataQuery(selectedOption);
  const { data: currenciesData } = useGetCurrenciesQuery({ page: 0, rowsPerPage: 100 });

  const currencyAbbreviations = currenciesData?.currencies.map((currency) => currency.abbreviation);

  const sumOfDebits = calculateSum(data?.sumOfDebits);
  const sumOfCredits = calculateSum(data?.sumOfCredits);

  const filterDashboard = (data) => {
    setSelectedOption(data);
  };

  function calculateSum(amounts) {
    if (!amounts) {
      return 0;
    }
    return currenciesData?.currencies.reduce((sum, currency) => {
      if (currencyAbbreviations.includes(currency.abbreviation) && amounts[currency.abbreviation]) {
        return sum + currency.rate * amounts[currency.abbreviation];
      }
      return sum;
    }, 0);
  }

  return (
    <>
      <Head>
        <title>Overview | Rahat Shinwari Enterprises</title>
      </Head>
      <Box component="main">
        <Container maxWidth="xl">
          <Grid container spacing={3} my={1} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h6" component="h1">
                Debit and Credit from: {dateFormat(selectedOption.startDate)} to{" "}
                {dateFormat(selectedOption.endDate)}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} display="flex" justifyContent="flex-end">
              <FilterModal filterDashboard={filterDashboard} />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            {isLoading ? (
              <Grid item xs={12}>
                <Box display="flex" justifyContent="center" my={4}>
                  <CircularProgress />
                </Box>
              </Grid>
            ) : (
              <>
                {data?.credit.map(({ abbreviation, amount }) => (
                  <Grid key={abbreviation} item xs={12} sm={6} md={4} lg={2.4}>
                    <OverviewBudget type="Credit" abbreviation={abbreviation} value={amount} />
                  </Grid>
                ))}
                {data?.debit.map(({ abbreviation, amount }) => (
                  <Grid key={abbreviation} item xs={12} sm={6} md={4} lg={2.4}>
                    <OverviewBudget type="Debit" abbreviation={abbreviation} value={amount} />
                  </Grid>
                ))}
                <Grid key={1} item xs={12} sm={12} md={12} lg={12} pb={3}>
                  <Box bgcolor="#f5f5f5" p={2} borderRadius={4}>
                    <Typography variant="h5" component="h2" align="center">
                      Net Profit in Dirham: {sumOfDebits - sumOfCredits}
                    </Typography>
                  </Box>
                </Grid>
              </>
            )}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
