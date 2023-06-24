import Head from "next/head";
import { useEffect, useState } from "react";
import SyncIcon from "@mui/icons-material/Sync";
import { Box, Container, Grid, CircularProgress, Typography, Button, SvgIcon } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { OverviewBudget } from "src/sections/overview/overview-budget";
import { useGetDashboardDataQuery } from "src/store/services/balanceService";
import { getDateRange } from "src/utils/generic-functions";
import { FilterModal } from "src/sections/overview/filterModal";
import { useGetCurrenciesQuery } from "src/store/services/currencyService";
import { dateFormat, formatTwoDecimals } from "src/utils/generic-functions";

const Page = () => {
  const [selectedOption, setSelectedOption] = useState(getDateRange(1));
  const { data, isLoading, refetch } = useGetDashboardDataQuery(selectedOption);
  const { data: currenciesData, isLoading: isCurrenciesLoading } = useGetCurrenciesQuery({
    page: 0,
    rowsPerPage: 100,
  });

  useEffect(() => {
    refetch();
  }, [selectedOption]);
  const handleRefresh = () => refetch();
  const currencyAbbreviations = currenciesData?.currencies.map((currency) => currency.abbreviation);
  const credits = data?.credits || [];
  const debits = data?.debits || [];

  const filterDashboard = (data) => {
    setSelectedOption(data);
  };

  const calculateSum = (amounts) => {
    if (!amounts) {
      return 0;
    }
    const currencyAbbreviations = amounts.map((amount) => amount.currency);
    return currenciesData?.currencies?.reduce((sum, currency) => {
      if (
        currencyAbbreviations.includes(currency.abbreviation) &&
        amounts.find((amount) => amount.currency === currency.abbreviation)
      ) {
        return (
          sum +
          currency.rate * amounts.find((amount) => amount.currency === currency.abbreviation).amount
        );
      }
      return sum;
    }, 0);
  };

  const sumOfDebits = calculateSum(data?.debits);
  const sumOfCredits = calculateSum(data?.credits);
  const netProfit = sumOfDebits + sumOfCredits;

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
              <Button onClick={handleRefresh} startIcon={<SyncIcon />}>
                Refresh
              </Button>
              <FilterModal filterDashboard={filterDashboard} />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            {isLoading | isCurrenciesLoading ? (
              <Grid item xs={12}>
                <Box display="flex" justifyContent="center" my={4}>
                  <CircularProgress />
                </Box>
              </Grid>
            ) : (
              <>
                {currencyAbbreviations?.map((abbreviation) => {
                  const credit = credits.find((c) => c.currency === abbreviation);
                  const amount = credit ? credit.amount : 0;

                  return (
                    <Grid key={abbreviation} item xs={12} sm={6} md={4} lg={2.4}>
                      <OverviewBudget type="Credit" abbreviation={abbreviation} value={amount} />
                    </Grid>
                  );
                })}
                {currencyAbbreviations?.map((abbreviation) => {
                  const debit = debits.find((d) => d.currency === abbreviation);
                  const amount = debit ? debit.amount : 0;

                  return (
                    <Grid key={abbreviation} item xs={12} sm={6} md={4} lg={2.4}>
                      <OverviewBudget type="Debit" abbreviation={abbreviation} value={amount} />
                    </Grid>
                  );
                })}

                <Grid item xs={12} pb={3}>
                  <Box bgcolor="#f5f5f5" p={2} borderRadius={4}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="h6" align="center">
                          Total Debit in Dirham
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="h6" align="center">
                          Total Credit in Dirham
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
                          {formatTwoDecimals(sumOfDebits)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="h6" align="center">
                          {formatTwoDecimals(sumOfCredits)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="h6" align="center">
                          {formatTwoDecimals(netProfit)}
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
