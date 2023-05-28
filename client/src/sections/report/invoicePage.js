import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
} from "@mui/material";
import Image from "next/image";

const InvoicePage = ({ invoice }) => {
  const {
    customerName,
    address,
    currency,
    customerNumber,
    date,
    items,
    subtotal,
    tax,
    total,
    dueDate,
  } = invoice;

  return (
    <Box p={4}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Rahat Shinwari Enterprises</Typography>
        <Image src="/assets/logos/logo.png" alt="Logo" width={85} height={80} />
      </Box>

      <Box display="flex" justifyContent="space-between" mb={2}>
        <Box>
          <Typography variant="subtitle1">{`Customer: ${customerName}`}</Typography>
          <Typography variant="body2">{`Address: ${address}`}</Typography>
          <Typography variant="body2">{`Currency: ${currency}`}</Typography>
        </Box>
        <Box>
          <Typography variant="subtitle1">{`Customer ID: ${customerNumber}`}</Typography>
          <Typography variant="body2">{`Date: ${date} to ${date}`}</Typography>
        </Box>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell>Credit</TableCell>
              <TableCell>Debit</TableCell>
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
          <TableFooter>
            <TableRow>
              <TableCell align="right">Subtotal:</TableCell>
              <TableCell>{subtotal}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="right">Tax (10%):</TableCell>
              <TableCell>{tax}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="right">Total:</TableCell>
              <TableCell>{total}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      <Box textAlign="right">
        <Typography variant="body2">{`Payment due by: ${dueDate}`}</Typography>
      </Box>
    </Box>
  );
};

export default InvoicePage;
