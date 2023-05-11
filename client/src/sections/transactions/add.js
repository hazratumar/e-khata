import { Autocomplete, Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import { useAddTransactionMutation } from "src/store/services/transactionService";
import { useAllCustomersQuery } from "src/store/services/customerService";
import { useAllCurrenciesQuery } from "src/store/services/currencyService";
import toast from "react-hot-toast";

export const AddTransaction = forwardRef((props, ref) => {
  const [state, setState] = useState({
    creditCustomer: "",
    debitCustomer: "",
    currency: "",
    amount: "",
    exCurrency: "",
    exRate: "",
    description: "",
  });

  const { data: customerOptions } = useAllCustomersQuery();
  const { data: currencyOptions } = useAllCurrenciesQuery();
  const [addTransaction, { isSuccess, isLoading, error, data }] = useAddTransactionMutation();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState((prevFormData) => ({ ...prevFormData, [name]: value }));
  }

  const saveTransaction = async () => {
    await addTransaction(state);
  };
  useImperativeHandle(ref, () => ({
    saveTransaction,
  }));
  useEffect(() => {
    if (isSuccess) {
      toast.success("Transaction added successfully");
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
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Autocomplete
            getOptionLabel={(option) => option.name}
            options={customerOptions ?? ""}
            onChange={(event, value) => setState({ ...state, creditCustomer: value.id })}
            renderInput={(params) => <TextField {...params} label="Credit Customer" />}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete
            getOptionLabel={(option) => option.name}
            options={customerOptions ?? ""}
            onChange={(event, value) => setState({ ...state, debitCustomer: value.id })}
            renderInput={(params) => <TextField {...params} label="Debit Customer" />}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete
            getOptionLabel={(option) => option.name}
            options={currencyOptions ?? ""}
            onChange={(event, value) => setState({ ...state, currency: value.id })}
            renderInput={(params) => <TextField {...params} label="Currency" />}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            type="number"
            value={state.amount}
            fullWidth
            label="Amount"
            name="amount"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete
            getOptionLabel={(option) => option.name}
            options={currencyOptions ?? ""}
            onChange={(event, value) => setState({ ...state, exCurrency: value.id })}
            renderInput={(params) => <TextField {...params} label="Exchange Currency" />}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            type="number"
            value={state.exRate}
            fullWidth
            label="Exchange Rate"
            name="exRate"
            onChange={handleChange}
          />
        </Grid> <Grid item xs={12} md={12}>
          <TextField
            type="number"
            value={state.description}
            fullWidth
            multiline
            rows={2}
            label="Description"
            name="description"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Typography>{`${state.exCurrency}: ${state.amount * state.exRate}`}</Typography>
        </Grid>
      </Grid>
    </>
  );
});

