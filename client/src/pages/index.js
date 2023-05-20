import Head from "next/head";
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SvgIcon,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { OverviewBudget } from "src/sections/overview/overview-budget";
import { useEffect, useState } from "react";
import { useGetCreditByDateRangeQuery } from "src/store/services/balanceService";
import { getDateRange } from "../utils/generic-functions";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { FilterModal } from "../sections/overview/filterModal";

const Page = () => {
  const [selectedOption, setSelectedOption] = useState(1);
  const { data, refetch } = useGetCreditByDateRangeQuery(getDateRange(selectedOption));

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
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
            <FilterModal />
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
