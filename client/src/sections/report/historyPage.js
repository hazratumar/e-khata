import React from "react";
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { dateFormat, formatTwoDecimals, isTruthy } from "../../utils/generic-functions";

const HistoryPage = ({ invoice }) => {
  const { name, currency, abbreviation, startDate, endDate, result } = invoice;

  return (
    <Box padding={4}>
      <Typography variant="h4" gutterBottom>
        Customers History
      </Typography>

      <Box marginBottom={2} display="flex" justifyContent="space-between">
        <Box>
          <Typography variant="subtitle1">
            {`Customer: ${isTruthy(name) ? name : "All Customers"}`}
          </Typography>

          <Typography variant="body2">
            {`Currency: ${isTruthy(currency) ? `${currency} (${abbreviation})` : "All Currencies"}`}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2">{`Timeframe from ${dateFormat(startDate)} to ${dateFormat(
            endDate
          )}`}</Typography>
        </Box>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: 12 }}>Date</TableCell>
              <TableCell sx={{ fontSize: 12 }}>Description</TableCell>
              <TableCell sx={{ fontSize: 12 }}>Currency</TableCell>
              <TableCell sx={{ fontSize: 12 }}>Amount</TableCell>
              <TableCell sx={{ fontSize: 12 }}>Rate</TableCell>
              <TableCell sx={{ fontSize: 12 }}>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {result.map((item, index) => (
              <TableRow key={index}>
                <TableCell sx={{ fontSize: 12 }}>{dateFormat(item.date)}</TableCell>
                <TableCell sx={{ fontSize: 12 }}>{`${item.customer} to ${item.from}`}</TableCell>
                <TableCell sx={{ fontSize: 12 }}>{item.currency}</TableCell>
                <TableCell sx={{ fontSize: 12 }}>{formatTwoDecimals(item.amount)}</TableCell>
                <TableCell sx={{ fontSize: 12 }}>{`${formatTwoDecimals(item.exrate)} ${
                  item.excurrency
                }`}</TableCell>
                <TableCell sx={{ fontSize: 12 }}>
                  {formatTwoDecimals(item.calculatedamount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default HistoryPage;
