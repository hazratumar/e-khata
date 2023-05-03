import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const HomePage = () => {
  const data = [
    { date: "2/5/2023", name: "John", debit: "$100", credit: "$100", balance: "$100" },
    { date: "2/10/2023", name: "Jane", debit: "$100", credit: "$100", balance: "$100" },
    { date: "2/15/2023", name: "Bob", debit: "$100", credit: "$100", balance: "$100" },
  ];

  return (
    <Box sx={{ textAlign: "center", marginTop: "50px" }}>
      <Typography variant="h5" gutterBottom>
        Saeed Khan
      </Typography>
      <Button variant="contained" sx={{ marginTop: "20px" }}>
        Click Me Now!
      </Button>
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
          {data.map((item, index) => (
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
