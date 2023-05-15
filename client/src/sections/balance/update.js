import { Autocomplete, Grid, TextField } from "@mui/material";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useGetOneBalanceQuery } from "src/store/services/balanceService";
import { useUpdateBalanceMutation } from "src/store/services/balanceService";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

export const UpdateBalance = forwardRef((props, ref) => {
  const { balanceId } = props;

  const [state, setState] = useState({
    walletId: "",
    customer: "",
    transactionId: "",
    currency: "",
    amount: "",
    exCurrency: "",
    exRate: "",
    description: "",
  });
  const { customers, currencies } = useSelector((state) => state.option);

  const { data } = useGetOneBalanceQuery({ balanceId });

  const [updateBalance, { isSuccess, error }] = useUpdateBalanceMutation();

  const creditRecords = data?.wallets?.filter((record) => record.type === "Withdraw");
  const depositRecords = data?.wallets?.filter((record) => record.type === "Deposit");

  useEffect(() => {
    if (data) {
      setState((prevState) => ({
        ...prevState,
        debitWalletId: debitRecords[0]?.id,
        customer: {
          id: debitRecords[0]?.customer?.id,
          name: debitRecords[0]?.customer?.name,
        },
        transactionId: prevState.transactionId || data?.id,
        currency: { id: data?.currency?.id, name: data?.currency?.name },
        amount: data?.amount,
        exCurrency: { id: data?.exCurrency?.id, name: data?.exCurrency?.name },
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
    return updateBalance({
      credit: {
        id: state.creditWalletId,
        customer: state.creditCustomer.id,
      },
      transaction: {
        id: state.transactionId,
        currency: state.currency.id,
        amount: state.amount,
        description: state.description,
      },
    });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Balance updated successfully");
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
        <Grid item xs={12} md={12}>
          <Autocomplete
            value={state.customer}
            getOptionLabel={(option) => option.name}
            options={customers}
            onChange={(event, value) => setState({ ...state, customer: value })}
            renderInput={(params) => <TextField {...params} label="Customer" />}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Autocomplete
            value={state.currency}
            getOptionLabel={(option) => option.name}
            options={currencies}
            onChange={(event, value) => setState({ ...state, currency: value })}
            renderInput={(params) => <TextField {...params} label="Currency" />}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            type="number"
            value={state.amount}
            fullWidth
            label="Amount"
            name="amount"
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
      </Grid>
    </>
  );
});
