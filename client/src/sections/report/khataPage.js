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
          <Typography variant="body2">{`Timeframe from: ${dateFormat(startDate)} to ${dateFormat(
            endDate
          )}`}</Typography>
        </Box>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: 12 }}>Date</TableCell>
              <TableCell sx={{ fontSize: 12 }}>Customer</TableCell>
              <TableCell sx={{ fontSize: 12 }}>Currency</TableCell>
              <TableCell sx={{ fontSize: 12 }}>Amount</TableCell>
              <TableCell sx={{ fontSize: 12 }}>Rate</TableCell>
              <TableCell sx={{ fontSize: 12 }}>Debit</TableCell>
              <TableCell sx={{ fontSize: 12 }}>Credit</TableCell>
              <TableCell sx={{ fontSize: 12 }}>Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {result.map((item, index) => {
              const balance = calculateBalance(result.slice(0, index + 1)); // Calculate balance up to the current row
              return (
                <TableRow key={index}>
                  <TableCell sx={{ fontSize: 12 }}>{dateFormat(item.date)}</TableCell>
                  <TableCell sx={{ fontSize: 12 }}>
                    {item.type === "Credit"
                      ? item.customer + " to " + item.from
                      : item.from + " to " + item.customer}
                  </TableCell>
                  <TableCell sx={{ fontSize: 12 }}>{item.currency}</TableCell>
                  <TableCell sx={{ fontSize: 12 }}>{item.amount}</TableCell>
                  <TableCell sx={{ fontSize: 12 }}>{item.exrate}</TableCell>
                  <TableCell sx={{ fontSize: 12 }}>
                    {item.type === "Debit" ? item.calculatedamount : 0}
                  </TableCell>
                  <TableCell sx={{ fontSize: 12 }}>
                    {item.type === "Credit" ? item.calculatedamount : 0}
                  </TableCell>
                  <TableCell sx={{ fontSize: 12 }}>{balance}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell sx={{ fontSize: 12 }} align="right">
                Total Debits:
              </TableCell>
              <TableCell sx={{ fontSize: 12 }}>
                {`${abbreviation} ${result.reduce((sum, item) => {
                  if (item.type === "Debit") {
                    return sum + item.calculatedamount;
                  }
                  return sum;
                }, 0)}`}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontSize: 12 }} align="right">
                Total Credits:
              </TableCell>
              <TableCell sx={{ fontSize: 12 }}>
                {`${abbreviation} ${result.reduce((sum, item) => {
                  if (item.type === "Credit") {
                    return sum + item.calculatedamount;
                  }
                  return sum;
                }, 0)}`}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontSize: 12 }} align="right">
                Closing Balance:
              </TableCell>
              <TableCell sx={{ fontSize: 12 }}>{`${abbreviation} ${calculateBalance(
                result
              )}`}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default KhataPage;
