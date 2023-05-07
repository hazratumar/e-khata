import { Autocomplete, Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useAddTransactionMutation } from "src/store/services/transactionService";
import { useAllCustomersQuery } from "src/store/services/customerService";
import { useAllCurrenciesQuery } from "src/store/services/currencyService";
import toast from "react-hot-toast";

export const AddTransaction = () => {
  const [state, setState] = useState({
    creditFrom: "",
    debitTo: "",
    currency: "",
    amount: "",
    exCurrency: "",
    exRate: "",
  });

  const { data: customerOptions } = useAllCustomersQuery();
  const { data: currencyOptions } = useAllCurrenciesQuery();
  const [addTransaction, { isSuccess, error, data }] = useAddTransactionMutation();

  const handleChange = useCallback(
    (event) => {
      const { name, value } = event.target;
      setState((prevFormData) => ({ ...prevFormData, [name]: value }));
    },
    []
  );
  const onSubmit = () => {
    console.log(state);
  }

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
    <Stack>
      <Grid container spacing={2}>
        <Grid xs={12} md={6}>
          <Autocomplete
            getOptionLabel={(option) => option.name}
            options={customerOptions ?? ""}
            onChange={(event, value) => setState({ ...state, creditFrom: value.id })}
            renderInput={(params) => <TextField {...params} label="Credit From" />}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <Autocomplete
            getOptionLabel={(option) => option.name}
            options={customerOptions ?? ""}
            onChange={(event, value) => setState({ ...state, debitTo: value.id })}
            renderInput={(params) => <TextField {...params} label="Debit To" />}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <Autocomplete
            getOptionLabel={(option) => option.name}
            options={currencyOptions ?? ""}
            onChange={(event, value) => setState({ ...state, currency: value.id })}
            renderInput={(params) => <TextField {...params} label="Currency" />}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <TextField
            type="number"
            value={state.amount}
            fullWidth
            label="Amount"
            name="amount"
            onChange={handleChange}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <Autocomplete
            getOptionLabel={(option) => option.name}
            options={currencyOptions ?? ""}
            onChange={(event, value) => setState({ ...state, exCurrency: value.id })}
            renderInput={(params) => <TextField {...params} label="Exchange Currency" />}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <TextField
            type="number"
            value={state.exRate}
            fullWidth
            label="Exchange Rate"
            name="exRate"
            onChange={handleChange}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <Typography>lkf</Typography>
        </Grid>
        <Grid xs={12} md={6}>
          <Button fullWidth onClick={onSubmit}>Submit</Button>
        </Grid>
      </Grid>
    </Stack>
  );
};

