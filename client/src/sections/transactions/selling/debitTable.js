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
import { useSelector } from "react-redux";

export const DebitTable = () => {
  const store = useSelector((state) => state.transaction);

  const { data } = useGetTransactionItemsQuery({ transactionId: store?.id });

  const handleDelete = (id) => {
    // TODO: Implement delete logic
    console.log("Deleting item with id", id);
  };

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
            {data?.map((item) => (
              <TableRow key={item?.id}>
                <TableCell>{item?.id}</TableCell>
                <TableCell>{item?.from?.id}</TableCell>
                <TableCell>{item?.to?.id}</TableCell>
                <TableCell>{item?.currency?.id}</TableCell>
                <TableCell>{item.amount}</TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => handleDelete(item?.id)}>
                    <SvgIcon>
                      <TrashIcon />
                    </SvgIcon>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
};
