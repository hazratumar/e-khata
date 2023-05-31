import { Autocomplete, Grid, TextField, Typography } from "@mui/material";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useGetOneTransactionQuery } from "src/store/services/transactionService";
import { useUpdateTransactionMutation } from "src/store/services/transactionService";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

export const UpdateTransaction = forwardRef((props, ref) => {
  const { transactionId } = props;

  const [state, setState] = useState({
    creditWalletId: "",
    creditCustomer: "",
    debitWalletId: "",
    debitCustomer: "",
    transactionId: "",
    currency: "",
    amount: "",
    exCurrency: "",
    exRate: "",
    description: "",
  });
  const { customers, currencies } = useSelector((state) => state.option);

  const { data } = useGetOneTransactionQuery({ transactionId });

  const [updateTransaction, { isSuccess, error }] = useUpdateTransactionMutation();

  const creditRecords = data?.wallets?.filter((record) => record.type === "Credit");
  const debitRecords = data?.wallets?.filter((record) => record.type === "Debit");

  useEffect(() => {
    if (data) {
      setState((prevState) => ({
        ...prevState,
        creditWalletId: creditRecords[0]?.id,
        creditCustomer: {
          id: creditRecords[0]?.customer?.id,
          name: creditRecords[0]?.customer?.name,
        },
        debitWalletId: debitRecords[0]?.id,
        debitCustomer: {
          id: debitRecords[0]?.customer?.id,
          name: debitRecords[0]?.customer?.name,
        },
        transactionId: prevState.transactionId || data?.id,
        currency: { id: data?.currency?.id, abbreviation: data?.currency?.abbreviation },
        amount: data?.amount,
        exCurrency: { id: data?.exCurrency?.id, abbreviation: data?.exCurrency?.abbreviation },
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
        id: state.creditWalletId,
        customer: state.creditCustomer.id,
        type: "Credit",
      },
      debit: {
        id: state.debitWalletId,
        customer: state.debitCustomer.id,
        type: "Debit",
      },
      transaction: {
        id: state.transactionId,
        currency: state.currency.id,
        amount: parseInt(state.amount, 10),
        exCurrency: state.exCurrency.id,
        exRate: parseInt(state.exRate, 10),
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
  const getOptionLabel = (option) => option?.name || option?.abbreviation || "";

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Autocomplete
            value={state.creditCustomer}
            getOptionLabel={getOptionLabel}
            options={customers}
            onChange={(event, value) => setState({ ...state, creditCustomer: value })}
            renderInput={(params) => <TextField {...params} label="Credit Customer" />}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete
            value={state.debitCustomer}
            getOptionLabel={getOptionLabel}
            options={customers}
            onChange={(event, value) => setState({ ...state, debitCustomer: value })}
            renderInput={(params) => <TextField {...params} label="Debit Customer" />}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete
            value={state.currency}
            getOptionLabel={getOptionLabel}
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
            value={state.exCurrency}
            getOptionLabel={getOptionLabel}
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
