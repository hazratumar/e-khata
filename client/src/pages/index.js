import Head from "next/head";
import { useEffect, useState } from "react";
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
  const { data, isLoading, refetch } = useGetDashboardDataQuery(selectedOption);
  const { data: currenciesData } = useGetCurrenciesQuery({ page: 0, rowsPerPage: 100 });

  useEffect(() => {
    refetch();
  }, [selectedOption]);

  const currencyAbbreviations = currenciesData?.currencies.map((currency) => currency.abbreviation);

  const filterDashboard = (data) => {
    setSelectedOption(data);
  };

  const calculateSum = (amounts) => {
    if (!amounts) {
      return 0;
    }
    return currenciesData?.currencies.reduce((sum, currency) => {
      if (currencyAbbreviations.includes(currency.abbreviation) && amounts[currency.abbreviation]) {
        return sum + currency.rate * amounts[currency.abbreviation];
      }
      return sum;
    }, 0);
  };

  const sumOfDebits = calculateSum(data?.sumOfDebits);
  const sumOfCredits = calculateSum(data?.sumOfCredits);
  const netProfit = sumOfDebits - sumOfCredits;

  return (
    <>
      <Head>
        <title>Overview | Rahat Shinwari Enterprises</title>
      </Head>
      <Box component="main">
        <Container maxWidth="xl">
          <Grid container spacing={3} py={1} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h6" component="h1">
                From {dateFormat(selectedOption.startDate)} to {dateFormat(selectedOption.endDate)}
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
                <Grid item xs={12} pb={3}>
                  <Box bgcolor="#f5f5f5" p={2} borderRadius={4}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="h6" align="center">
                          Total Credit in Dirham
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="h6" align="center">
                          Total Debit in Dirham
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="h6" align="center">
                          Net Profit in Dirham
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="h6" align="center">
                          {sumOfCredits}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="h6" align="center">
                          {sumOfDebits}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="h6" align="center">
                          {netProfit}
                        </Typography>
                      </Grid>
                    </Grid>
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
