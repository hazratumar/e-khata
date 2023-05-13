import { Autocomplete, Grid, TextField, Typography } from "@mui/material";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useGetOneTransactionQuery } from "src/store/services/transactionService";
import { useUpdateTransactionMutation } from "src/store/services/transactionService";
import { useAllCustomersQuery } from "src/store/services/customerService";
import { useAllCurrenciesQuery } from "src/store/services/currencyService";
import toast from "react-hot-toast";

export const UpdateTransaction = forwardRef((props, ref) => {
  const { transactionId } = props;

  const [state, setState] = useState({
    creditCustomerId: "",
    creditCustomer: "",
    debitCustomerId: "",
    debitCustomer: "",
    transactionId: "",
    currency: "",
    amount: "",
    exCurrency: "",
    exRate: "",
    description: "",
  });

  const { data: customerOptions } = useAllCustomersQuery();
  const { data: currencyOptions } = useAllCurrenciesQuery();

  const { data } = useGetOneTransactionQuery({ transactionId });

  const [updateTransaction, { isSuccess, error }] = useUpdateTransactionMutation();

  const creditRecords = data?.wallets?.filter((record) => record.type === "Credit");
  const debitRecords = data?.wallets?.filter((record) => record.type === "Debit");

  useEffect(() => {
    if (data) {
      setState((prevState) => ({
        ...prevState,
        creditCustomerId: creditRecords[0]?.id,
        creditCustomer: creditRecords[0]?.customer?.id,
        debitCustomerId: debitRecords[0]?.id,
        debitCustomer: debitRecords[0]?.customer?.id,
        transactionId: prevState.transactionId || data?.id,
        currency: data?.currency?.id,
        amount: data?.amount,
        exCurrency: data?.exCurrency?.id,
        exRate: data?.exRate,
        description: data?.description,
      }));
    }
  }, [data]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const saveTransaction = async () => {
    return updateTransaction({
      credit: {
        id: state.creditCustomerId,
        customer: state.creditCustomer,
        type: "Credit",
      },
      debit: {
        id: state.debitCustomerId,
        customer: state.debitCustomer,
        type: "Debit",
      },
      transaction: {
        id: state.transactionId,
        currency: state.currency,
        amount: state.amount,
        exCurrency: state.exCurrency,
        exRate: state.exRate,
        description: state.description,
      },
    });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Transaction updated successfully");
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

  useImperativeHandle(ref, () => ({
    saveTransaction,
  }));

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
