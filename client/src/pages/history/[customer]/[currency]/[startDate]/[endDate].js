import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import HistoryPage from "src/sections/report/historyPage";
import { useCustomerHistoryQuery } from "src/store/services/reportService";
import { isNotTruthy } from "../../../../../utils/generic-functions";

const HistoryList = ({ customer, currency, startDate, endDate }) => {
  const { data, isLoading, error } = useCustomerHistoryQuery({
    customer,
    currency,
    startDate,
    endDate,
  });

  if (isLoading) {
    return (
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <CircularProgress size={"10vh"} thickness={4} />
          <Box sx={{ marginTop: "20px" }}>
            <Typography variant="h6" align="center">
              Loading...
            </Typography>
          </Box>
        </Box>
      </Grid>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" align="center">
        Error fetching invoices: {error.message}
      </Typography>
    );
  }

  if (isNotTruthy(data?.result.length)) {
    return (
      <Typography variant="h6" align="center">
        No records found in this date range.
      </Typography>
    );
  }

  return <HistoryPage invoice={data} />;
};

export async function getServerSideProps({ query }) {
  const { customer, currency, startDate, endDate } = query;

  return {
    props: {
      customer,
      currency,
      startDate,
      endDate,
    },
  };
}

export default HistoryList;
