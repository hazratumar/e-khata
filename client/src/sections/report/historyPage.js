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
import { dateFormat } from "../../utils/generic-functions";

const HistoryPage = ({ invoice }) => {
  const { name, currency, abbreviation, startDate, endDate, result } = invoice;

  return (
    <Box padding={4}>
      <Typography variant="h4" gutterBottom>
        Customers History
      </Typography>

      <Box marginBottom={2} display="flex" justifyContent="space-between">
        <Box>
          <Typography variant="subtitle1">{`Customer: ${name}`}</Typography>
          <Typography variant="body2">{`Currency: ${currency} (${abbreviation})`}</Typography>
        </Box>
        <Box>
          <Typography variant="body2">{`Period from: ${dateFormat(startDate)} to ${dateFormat(
            endDate
          )}`}</Typography>
        </Box>
      </Box>

      <TableContainer marginTop={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Exchange</TableCell>
              <TableCell>Rate</TableCell>
              <TableCell>Calculated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {result.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{dateFormat(item.date)}</TableCell>
                <TableCell>
                  {item.type === "Credit"
                    ? `${item.customer} to ${item.from}`
                    : `${item.from} to ${item.customer}`}
                </TableCell>
                <TableCell>{item.currency}</TableCell>
                <TableCell>{item.amount}</TableCell>
                <TableCell>{item.excurrency}</TableCell>
                <TableCell>{item.exrate}</TableCell>
                <TableCell>{item.calculatedamount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default HistoryPage;