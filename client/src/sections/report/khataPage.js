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
import { dateFormat } from "../../utils/generic-functions";

const KhataPage = ({ invoice }) => {
  const { name, address, currency, abbreviation, openingBalance, startDate, endDate, result } =
    invoice;

  const calculateBalance = (rows) => {
    let balance = openingBalance;

    for (let i = 0; i < rows.length; i++) {
      const currentItem = rows[i];
      const creditAmount = currentItem.type === "Credit" ? currentItem.calculatedamount : 0;
      const debitAmount = currentItem.type === "Debit" ? currentItem.calculatedamount : 0;

      balance += creditAmount - debitAmount;
    }

    return balance;
  };
  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Customers Khata
      </Typography>

      <Box marginBottom={2} display="flex" justifyContent="space-between">
        <Box>
          <Typography variant="subtitle1">{`Customer: ${name}`}</Typography>
          <Typography variant="body2">{`Address: ${address}`}</Typography>
          <Typography variant="body2">{`Currency: ${currency} (${abbreviation})`}</Typography>
        </Box>
        <Box>
          <Typography variant="subtitle1">{`Opening Balance: ${abbreviation} ${openingBalance}`}</Typography>
          <Typography variant="body2">{`Period from: ${dateFormat(startDate)} to ${dateFormat(
            endDate
          )}`}</Typography>
        </Box>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Rate</TableCell>
              <TableCell>Debit</TableCell>
              <TableCell>Credit</TableCell>
              <TableCell>Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {result.map((item, index) => {
              const balance = calculateBalance(result.slice(0, index + 1)); // Calculate balance up to the current row
              return (
                <TableRow key={index}>
                  <TableCell>{dateFormat(item.date)}</TableCell>
                  <TableCell>
                    {item.type === "Credit"
                      ? item.customer + " to " + item.from
                      : item.from + " to " + item.customer}
                  </TableCell>
                  <TableCell>{item.currency}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                  <TableCell>{item.exrate}</TableCell>
                  <TableCell>{item.type === "Debit" ? item.calculatedamount : 0}</TableCell>
                  <TableCell>{item.type === "Credit" ? item.calculatedamount : 0}</TableCell>
                  <TableCell>{balance}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell align="right">Total Debits:</TableCell>
              <TableCell>
                {`${abbreviation} ${result.reduce((sum, item) => {
                  if (item.type === "Debit") {
                    return sum + item.calculatedamount;
                  }
                  return sum;
                }, 0)}`}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="right">Total Credits:</TableCell>
              <TableCell>
                {`${abbreviation} ${result.reduce((sum, item) => {
                  if (item.type === "Credit") {
                    return sum + item.calculatedamount;
                  }
                  return sum;
                }, 0)}`}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="right">Closing Balance:</TableCell>
              <TableCell>{`${abbreviation} ${calculateBalance(result)}`}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default KhataPage;
