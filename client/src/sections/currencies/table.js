import React from "react";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { formatTwoDecimals } from "src/utils/generic-functions";
import moment from "moment";
import { UpdateCurrency } from "src/sections/currencies/update";
import { options } from "src/utils/constant";

export const CurrenciesTable = (props) => {
  const { count, items = [], onPageChange, onRowsPerPageChange, page, rowsPerPage } = props;
  const rowsPerPageOptions = options.filter((option) => option <= count);

  return (
    <Card>
      <Box sx={{ minWidth: 800 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell>Abbreviation</TableCell>
              <TableCell>Rate</TableCell>
              <TableCell>Recent Updates</TableCell>
              <TableCell>Update</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(({ id, name, abbreviation, rate, updatedAt }) => (
              <TableRow hover key={id}>
                <TableCell>{id}</TableCell>
                <TableCell>{name}</TableCell>
                <TableCell>{abbreviation}</TableCell>
                <TableCell>{formatTwoDecimals(rate)}</TableCell>
                <TableCell>{moment(updatedAt).fromNow()}</TableCell>
                <TableCell>
                  <UpdateCurrency currency={{ id, name, abbreviation, rate }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
      />
    </Card>
  );
};
