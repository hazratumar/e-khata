import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { Autocomplete, Stack, Grid, TextField } from "@mui/material";
import { useAddTransactionItemMutation } from "src/store/services/transactionItemService";
import { useAllCustomersQuery } from "src/store/services/customerService";
import { useAllCurrenciesQuery } from "src/store/services/currencyService";
import { CreditTable } from "./creditTable";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

export const AddCredit = () => {
  const store = useSelector((state) => state.transaction);
  const [item, setItem] = useState({
    transaction: store?.id,
    type: "Credit",
    from: "",
    to: "",
    currency: "",
    amount: "",
    rate: "",
    profit: "",
  });

  const { data: customerOptions } = useAllCustomersQuery();
  const { data: currencyOptions } = useAllCurrenciesQuery();
  const [addTransactionItem, { isSuccess, error }] = useAddTransactionItemMutation();

  const saveCredit = async () => await addTransactionItem(item);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Credit added successfully");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      const errorMessage = Array.isArray(error.data?.message)
        ? error.data.message[0]
        : error.data?.message;
      toast.error(errorMessage);
      console.log("Error Message", error);
    }
  }, [error]);
  return (
    <Stack sx={{ height: "50vh" }}>
      <form onSubmit={saveCredit}>
        <Grid container spacing={1}>
          <Grid item xs={6} md={6}>
            <Autocomplete
              getOptionLabel={(option) => option.name}
              options={customerOptions ?? []}
              onChange={(event, value) => setItem({ ...item, from: value.id })}
              renderInput={(params) => <TextField {...params} label="From" />}
            />
          </Grid>
          <Grid item xs={6} md={6}>
            <Autocomplete
              getOptionLabel={(option) => option.name}
              options={customerOptions ?? []}
              onChange={(event, value) => setItem({ ...item, to: value.id })}
              renderInput={(params) => <TextField {...params} label="To" />}
            />
          </Grid>
          <Grid item xs={6} md={5}>
            <Autocomplete
              getOptionLabel={(option) => option.name}
              options={currencyOptions ?? []}
              onChange={(event, value) => setItem({ ...item, currency: value.id })}
              renderInput={(params) => <TextField {...params} label="Currency" />}
            />
          </Grid>
          <Grid item xs={6} md={5}>
            <TextField
              type="number"
              fullWidth
              label="Amount"
              onChange={(event) => setItem({ ...item, amount: event.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button variant="contained" fullWidth onClick={saveCredit}>
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
      <CreditTable />
    </Stack>
  );
};
