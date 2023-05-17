import Head from "next/head";
import {
  Box,
  Button,
  Container,
  FormControl,
  Unstable_Grid2 as Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { OverviewBudget } from "src/sections/overview/overview-budget";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { format, subDays } from "date-fns";
import { useEffect, useState } from "react";
import { useGetCreditByDateRangeQuery } from "src/store/services/balanceService";

const Credit = "Credit";
const Debit = "Debit";
const Page = () => {
  const [selectedOption, setSelectedOption] = useState(1);

  const { data } = useGetCreditByDateRangeQuery({
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
  });

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    const dateRange = getSelectedDateRange(event.target.value);
    refetch();
    console.log("Selected Date Range:", dateRange);
  };

  useEffect(() => {
    if (data) {
      console.log(data);
    }
  }, [data]);

  const getSelectedDateRange = (option) => {
    const today = new Date();
    const startDate = today;
    let endDate = today;

    switch (option) {
      case 7:
        endDate = subDays(today, 7);
        break;
      case 30:
        endDate = subDays(today, 30);
        break;
      case 365:
        endDate = subDays(today, 365);
        break;
      default:
        break;
    }

    return {
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate:
        option === 1 ? format(endDate, "yyyy-MM-dd HH:mm:ss") : format(startDate, "yyyy-MM-dd"),
    };
  };
  return (
    <>
      <Head>
        <title>Overview | e-khata</title>
      </Head>
      <Box component="main">
        <Container maxWidth="xl">
          <Grid container spacing={2}>
            <Grid item xs={6} sm={6} md={6} lg={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateRangePicker startText="Check-in" endText="Check-out" />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={3} sm={3} md={3} lg={3}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Age</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedOption}
                  label="Age"
                  onChange={handleOptionChange}
                >
                  <MenuItem value={1}>Today</MenuItem>
                  <MenuItem value={7}>Last 7 Days</MenuItem>
                  <MenuItem value={30}>Last 30 Days</MenuItem>
                  {/* <MenuItem value={365}>Last Year</MenuItem> */}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            {data?.credit.map((item) => {
              return (
                <Grid xs={12} sm={6} md={4} lg={2.4}>
                  <OverviewBudget
                    type={"Credit"}
                    name={item?.name}
                    abbreviation={item?.abbreviation}
                    value={item?.amount}
                  />
                </Grid>
              );
            })}
            {data?.debit.map((item) => {
              return (
                <Grid xs={12} sm={6} md={4} lg={2.4}>
                  <OverviewBudget
                    type={"Debit"}
                    name={item?.name}
                    abbreviation={item?.abbreviation}
                    value={item?.amount}
                  />
                </Grid>
              );
            })}
            {/* <Grid xs={12} sm={6} lg={3}>
              <OverviewTotalCustomers
                difference={16}
                positive={false}
                sx={{ height: "100%" }}
                value="1.6k"
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewTasksProgress sx={{ height: "100%" }} value={75.5} />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewTotalProfit sx={{ height: "100%" }} value="$15k" />
            </Grid> 
            <Grid xs={12} lg={8}>
              <OverviewSales
                chartSeries={[
                  {
                    name: "This year",
                    data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20],
                  },
                  {
                    name: "Last year",
                    data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13],
                  },
                ]}
                sx={{ height: "100%" }}
              />
            </Grid>
            <Grid xs={12} md={6} lg={4}>
              <OverviewTraffic
                chartSeries={[63, 15, 22]}
                labels={["USD", "PKR", "DRH"]}
                sx={{ height: "100%" }}
              />
            </Grid> 
            <Grid xs={12} md={6} lg={4}>
              <OverviewCurrentBalances
                products={data?.map((balance) => ({
                  id: balance.abbreviation,
                  name: `${balance.name} (${balance.abbreviation})`,
                  amount: ` ${numeral(balance.amount).format("0,0.00")} ${`(${numeral(
                    balance.amount
                  ).format("0,0.0a")})`}`,
                }))}
                sx={{ height: "100%" }}
              />
            </Grid>
            <Grid xs={12} md={12} lg={8}>
              <OverviewLatestOrders
                orders={[
                  {
                    id: "f69f88012978187a6c12897f",
                    ref: "AM1049",
                    amount: 30.5,
                    customer: {
                      name: "Ali Muhammad",
                    },
                    createdAt: 1555016400000,
                    status: "pending",
                  },
                  {
                    id: "9eaa1c7dd4433f413c308ce2",
                    ref: "DEV1048",
                    amount: 25.1,
                    customer: {
                      name: "Jahan Zaib",
                    },
                    createdAt: 1555016400000,
                    status: "delivered",
                  },
                  {
                    id: "01a5230c811bd04996ce7c13",
                    ref: "DEV1047",
                    amount: 10.99,
                    customer: {
                      name: "Abdullah",
                    },
                    createdAt: 1554930000000,
                    status: "refunded",
                  },
                  {
                    id: "1f4e1bd0a87cea23cdb83d18",
                    ref: "DEV1046",
                    amount: 96.43,
                    customer: {
                      name: "Haroon Rashid",
                    },
                    createdAt: 1554757200000,
                    status: "pending",
                  },
                  {
                    id: "9f974f239d29ede969367103",
                    ref: "DEV1045",
                    amount: 32.54,
                    customer: {
                      name: "Jan Bahdar",
                    },
                    createdAt: 1554670800000,
                    status: "delivered",
                  },
                  {
                    id: "ffc83c1560ec2f66a1c05596",
                    ref: "DEV1044",
                    amount: 16.76,
                    customer: {
                      name: "Mukhtar Khan",
                    },
                    createdAt: 1554670800000,
                    status: "delivered",
                  },
                ]}
                sx={{ height: "100%" }}
              />
            </Grid> */}
          </Grid>
        </Container>
      </Box>
    </>
  );
};
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
