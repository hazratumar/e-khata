import {
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const HomePage = () => {
  const customerData = [
    { date: "2/5/2023", name: "John", debit: "$100", credit: "$100", balance: "$100" },
    { date: "2/10/2023", name: "Jane", debit: "$100", credit: "$100", balance: "$100" },
    { date: "2/15/2023", name: "Bob", debit: "$100", credit: "$100", balance: "$100" },
  ];
  return (
    <Box
      sx={{
        textAlign: "center",
        marginTop: "50px",
        // background: `url(/favicon-16x16.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Box>
        <Typography variant="h4" gutterBottom>
          Rahat Shinwari Enterprises
        </Typography>
        <Typography variant="h6" gutterBottom>
          Customer Report
        </Typography>
        <Box display="flex" flexDirection="row" justifyContent="space-around" marginY={3}>
          <Typography>Customer Name: Saeed Khan</Typography>
          <Typography>Contact: 03444342348</Typography>
          <Typography>Address: Dubai</Typography>
          <Typography>Currencies: PKR, DHR, USD, AFG, RMB</Typography>
        </Box>

        <Divider />
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Debit</TableCell>
            <TableCell>Credit</TableCell>
            <TableCell>Balance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customerData.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.date}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.debit}</TableCell>
              <TableCell>{item.credit}</TableCell>
              <TableCell>{item.balance}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default HomePage;
