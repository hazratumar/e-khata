import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableFooter,
} from "@mui/material";
import Image from "next/image";

const InvoicePage = ({ invoice }) => {
  const {
    customerName,
    address,
    Currency,
    state,
    zip,
    customerNumber,
    date,
    items,
    subtotal,
    tax,
    total,
    dueDate,
  } = invoice;

  return (
    <Box py={4}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Rahat Shinwari Enterprises</Typography>
        <Image src="/assets/logos/logo.png" alt="Logo" width={85} height={80} />
      </Box>

      <Box display="flex" justifyContent="space-between" mb={2}>
        <Box>
          <Typography variant="subtitle1">{`Customer : ${customerName}`}</Typography>
          <Typography variant="body2">{`Address: ${address}`}</Typography>
          <Typography variant="body2">{`Currency :${Currency}`}</Typography>
        </Box>
        <Box>
          <Typography variant="subtitle1">{`Customer ID: ${customerNumber}`}</Typography>
          <Typography variant="body2">{`Date: ${date} to ${date}`}</Typography>
        </Box>
      </Box>

      <TableContainer component={Paper} mb={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell>Credit Amount</TableCell>
              <TableCell>Debit Amount</TableCell>
              <TableCell>Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{date}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.unitPrice}</TableCell>
                <TableCell>{item.total}</TableCell>
                <TableCell>{item.total}</TableCell>
                <TableCell>{item.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3} align="right">
              Subtotal:
            </TableCell>
            <TableCell>{subtotal}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3} align="right">
              Tax (10%):
            </TableCell>
            <TableCell>{tax}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3} align="right">
              Total:
            </TableCell>
            <TableCell>{total}</TableCell>
          </TableRow>
        </TableFooter>
      </TableContainer>

      <Box textAlign="right">
        <Typography variant="body2">{`Payment due by: ${dueDate}`}</Typography>
      </Box>
    </Box>
  );
};

export default InvoicePage;
