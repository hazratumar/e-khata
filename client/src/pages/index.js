import Head from "next/head";
import { Box, Container, FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { OverviewBudget } from "src/sections/overview/overview-budget";
import { LocalizationProvider, DateRangePicker } from "@mui/lab";
import { AdapterDateFns } from "@mui/lab/AdapterDateFns";
import { useEffect, useState } from "react";
import { useGetCreditByDateRangeQuery } from "src/store/services/balanceService";
import { getDateRange } from "../utils/generic-functions";

const Page = () => {
  const [selectedOption, setSelectedOption] = useState(1);
  const { data, refetch } = useGetCreditByDateRangeQuery(getDateRange(selectedOption));

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    refetch();
  }, [selectedOption]);

  useEffect(() => {
    if (data) {
      console.log(data);
    }
  }, [data]);

  return (
    <>
      <Head>
        <title>Overview | e-khata</title>
      </Head>
      <Box component="main">
        <Container maxWidth="xl">
          <Grid container spacing={2}>
            <Grid item xs={6} sm={6} md={6} lg={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateRangePicker startText="Check-in" endText="Check-out" />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={3} sm={3} md={3} lg={3}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Date Range</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedOption}
                  label="Date Range"
                  onChange={handleOptionChange}
                >
                  <MenuItem value={1}>Today</MenuItem>
                  <MenuItem value={7}>Last 7 Days</MenuItem>
                  <MenuItem value={30}>Last 30 Days</MenuItem>
                  <MenuItem value={365}>Last Year</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            {data?.credit.map((item, index) => (
              <Grid key={index} item xs={12} sm={6} md={4} lg={2.4}>
                <OverviewBudget
                  type="Credit"
                  abbreviation={item?.abbreviation}
                  value={item?.amount}
                />
              </Grid>
            ))}
            {data?.debit.map((item, index) => (
              <Grid key={index} item xs={12} sm={6} md={4} lg={2.4}>
                <OverviewBudget
                  type="Debit"
                  abbreviation={item?.abbreviation}
                  value={item?.amount}
                />
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
