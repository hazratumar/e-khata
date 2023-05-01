import React from "react";
import {
  Grid,
  IconButton,
  Paper,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { TrashIcon } from "@heroicons/react/24/solid";
import { useGetTransactionItemsQuery } from "src/store/services/transactionItemService";

export const DebitTable = ({ transactionId }) => {
  // const { data } = useGetTransactionItemsQuery({ transactionId });
  return (
    <Grid item xs={12} md={12} lg={12}>
      <TableContainer component={Paper} sx={{ height: "35vh" }}>
        <Table>
          <TableHead sx={{ position: "sticky", top: 0 }}>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.from}</TableCell>
                <TableCell>{item.to}</TableCell>
                <TableCell>{item.currency}</TableCell>
                <TableCell>{item.amount}</TableCell>
                <TableCell>
                  <IconButton color="error">
                    <SvgIcon>
                      <TrashIcon />
                    </SvgIcon>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))} */}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
};
