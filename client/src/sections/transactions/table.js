import {
  Badge,
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import { Scrollbar } from "src/components/scrollbar";
import { TransactionModal } from "./modal";
import moment from "moment";
import { options } from "../../utils/constant";
import { getNewUpdate } from "../../utils/generic-functions";

export const TransactionsTable = (props) => {
  const { count, items = [], onPageChange, onRowsPerPageChange, page, rowsPerPage } = props;
  const rowsPerPageOptions = options.filter((option) => option <= count);

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Currency</TableCell>
                <TableCell>Credit Amount</TableCell>
                <TableCell>Debit Amount</TableCell>
                <TableCell>Recent Updates</TableCell>
                <TableCell>Update</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow hover key={item.id}>
                  <TableCell>{item?.id}</TableCell>
                  <TableCell>{item?.customer?.name}</TableCell>
                  <TableCell>
                    <Badge
                      badgeContent={item?.type}
                      color={item?.type === "Credit" ? "error" : "primary"}
                    />
                  </TableCell>
                  <TableCell>{item?.transaction?.currency?.abbreviation}</TableCell>
                  <TableCell>{item?.type === "Credit" ? item?.transaction?.amount : "0"}</TableCell>
                  <TableCell>{item?.type === "Debit" ? item?.transaction?.amount : "0"}</TableCell>
                  <TableCell>
                    {moment(getNewUpdate(item?.updatedAt, item?.transaction?.updatedAt)).fromNow()}
                  </TableCell>
                  <TableCell>
                    <TransactionModal transactionId={item?.transaction?.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
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
