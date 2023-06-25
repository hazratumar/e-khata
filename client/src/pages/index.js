import Head from "next/head";
import { useState } from "react";
import SyncIcon from "@mui/icons-material/Sync";
import { Box, Container, Grid, CircularProgress, Typography, Button } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { OverviewBudget } from "src/sections/overview/overview-budget";
import { useGetDashboardDataQuery } from "src/store/services/balanceService";
import { getDateRange } from "src/utils/generic-functions";
import { FilterModal } from "src/sections/overview/filterModal";
import { useGetCurrenciesQuery } from "src/store/services/currencyService";
import { dateFormat, formatTwoDecimals } from "src/utils/generic-functions";

const headingLabel = "Total Amount/Value in Dirham (DHR)";
const stockLabel = "Stock Value";
const debitLabel = "Debit Amount";
const creditLabel = "Credit Amount";
const netProfitLabel = "Net Profit/Loss";

const Page = () => {
  const [selectedOption, setSelectedOption] = useState(getDateRange(1));

  const {
    data,
    isLoading: isDashboardDataLoading,
    refetch: refreshDashboardData,
  } = useGetDashboardDataQuery(selectedOption);

  const {
    data: currenciesData,
    isLoading: isCurrenciesLoading,
    refetch: refreshCurrenciesData,
  } = useGetCurrenciesQuery({
    page: 0,
    rowsPerPage: 100,
  });

  const handleRefresh = () => refreshDashboardData();

  const currencyAbbreviations = currenciesData?.currencies?.map(
    (currency) => currency.abbreviation
  );
  const credits = data?.credits || [];
  const debits = data?.debits || [];
  const stocks = data?.stocks || [];

  const filterDashboard = async (data) => {
    await setSelectedOption(data);
    await refreshDashboardData();
    await refreshCurrenciesData();
  };

  const calculateSum = (amounts, property) => {
    if (!amounts) {
      return 0;
    }
    return currenciesData?.currencies?.reduce((sum, currency) => {
      const matchingAmount = amounts.find((amount) => amount.currency === currency.abbreviation);
      const value = matchingAmount ? currency.rate * matchingAmount[property] : 0;
      return sum + value;
    }, 0);
  };

  const sumOfDebits = calculateSum(debits, "amount");
  const sumOfCredits = calculateSum(credits, "amount");
  const sumOfStocks = calculateSum(stocks, "stock");
  const netProfit = sumOfDebits + sumOfCredits;

  if (isDashboardDataLoading || isCurrenciesLoading) {
    return (
      <Grid item xs={12}>
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      </Grid>
    );
  }

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
              {currencyAbbreviations?.map((abbreviation) => {
                const stock = stocks.find((d) => d.currency === abbreviation);
                const amount = stock ? stock.stock : 0;
                return (
                  <Grid key={abbreviation} item xs={12} sm={6} md={4} lg={2.4}>
                    <OverviewBudget type="Stock" abbreviation={abbreviation} value={amount} />
                  </Grid>
                );
              })}

              <Grid item xs={12} pb={3}>
                <Typography variant="h6" align="center" pb={2}>
                  {headingLabel}
                </Typography>
                <Box bgcolor="#f5f5f5" p={2} borderRadius={4}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="h6" align="center">
                        {stockLabel}
                      </Typography>
                      <Typography variant="h6" align="center">
                        {formatTwoDecimals(sumOfStocks)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="h6" align="center">
                        {debitLabel}
                      </Typography>
                      <Typography variant="h6" align="center">
                        {formatTwoDecimals(sumOfDebits)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="h6" align="center">
                        {creditLabel}
                      </Typography>
                      <Typography variant="h6" align="center">
                        {formatTwoDecimals(sumOfCredits)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="h6" align="center">
                        {netProfitLabel}
                      </Typography>
                      <Typography variant="h6" align="center">
                        {formatTwoDecimals(netProfit)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
