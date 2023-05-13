import { Autocomplete, Grid, TextField, Typography } from "@mui/material";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useAddTransactionMutation } from "src/store/services/transactionService";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export const AddTransaction = forwardRef((props, ref) => {
  const [state, setState] = useState({
    creditCustomer: 1,
    debitCustomer: "",
    currency: "",
    amount: "",
    exCurrency: "",
    exRate: "",
    description: "",
  });
  const { customers, currencies } = useSelector((state) => state.option);

  const [addTransaction, { isSuccess, error }] = useAddTransactionMutation();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const saveTransaction = async () => {
    return addTransaction({
      credit: {
        customer: state.creditCustomer.id,
        type: "Credit",
      },
      debit: {
        customer: state.debitCustomer.id,
        type: "Debit",
      },
      transaction: {
        currency: state.currency.id,
        amount: state.amount,
        exCurrency: state.exCurrency.id,
        exRate: state.exRate,
        description: state.description,
      },
    });
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
      const errorMessage = Array.isArray(error?.data?.message)
        ? error.data.message[0]
        : error.data.message;
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
            options={customers}
            onChange={(event, value) => setState({ ...state, creditCustomer: value })}
            renderInput={(params) => <TextField {...params} label="Credit Customer" />}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete
            getOptionLabel={(option) => option.name}
            options={customers}
            onChange={(event, value) => setState({ ...state, debitCustomer: value })}
            renderInput={(params) => <TextField {...params} label="Debit Customer" />}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete
            getOptionLabel={(option) => option.name}
            options={currencies}
            onChange={(event, value) => setState({ ...state, currency: value })}
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
            options={currencies}
            onChange={(event, value) => setState({ ...state, exCurrency: value })}
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
        </Grid>
        <Grid item xs={12} md={12}>
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
          <Typography>
            {state.exCurrency && "Calculated Amount: " + state.amount * state.exRate}
          </Typography>
        </Grid>
      </Grid>
    </>
  );
});
