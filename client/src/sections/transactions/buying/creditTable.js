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
import { useDeleteTransactionItemMutation } from "src/store/services/transactionItemService";
import { useSelector } from "react-redux";

export const CreditTable = () => {
  const store = useSelector((state) => state.transaction);

  const { data, isLoading } = useGetTransactionItemsQuery({ transactionId: store?.id });
  const [deleteItem] = useDeleteTransactionItemMutation();
  const handleDelete = async (transactionId) => {
    await deleteItem({ transactionId });
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6}>Loading...</TableCell>
              </TableRow>
            ) : (
              data
                ?.filter((item) => item.type === "Credit")
                ?.map((item) => (
                  <TableRow key={item?.id}>
                    <TableCell>{item?.id}</TableCell>
                    <TableCell>{item?.from?.name}</TableCell>
                    <TableCell>{item?.to?.name}</TableCell>
                    <TableCell>{item?.currency?.name}</TableCell>
                    <TableCell>{item.amount}</TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(item?.id)}
                        disabled={deleteItem.isLoading}
                      >
                        <SvgIcon>
                          <TrashIcon />
                        </SvgIcon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
};
