import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import InvoicePage from "src/sections/report/invoicePage";
import { useCustomerReportQuery } from "src/store/services/printerService";

const InvoiceList = ({ customer, currency, startDate, endDate }) => {
  const [invoices, setInvoices] = useState([]);
  const { data, isLoading } = useCustomerReportQuery({ customer, currency, startDate, endDate });

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const dummyData = [
          {
            id: 1,
            customerName: "Ali Khan",
            address: "Peshawar",
            currency: "Dollar",
            state: "State",
            zip: "12345",
            customerNumber: "1",
            date: "2023/05/20",
            items: [
              { description: "Item 1", quantity: 2, unitPrice: "$10.00", total: "$20.00" },
              { description: "Item 2", quantity: 3, unitPrice: "$15.00", total: "$45.00" },
            ],
            subtotal: "$65.00",
            tax: "$6.50",
            total: "$71.50",
            dueDate: "2023-06-01",
          },
        ];

        setInvoices(dummyData);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchInvoices();
  }, [endDate]);

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

  return (
    <>
      {invoices.map((invoice) => (
        <InvoicePage key={invoice.id} invoice={invoice} />
      ))}
    </>
  );
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

export default InvoiceList;
