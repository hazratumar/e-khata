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
    type: "",
    balanceId: "",
    currency: "",
    amount: "",
    description: "",
  });
  const { customers, currencies } = useSelector((state) => state.option);

  const { data } = useGetOneBalanceQuery({ balanceId });

  const [updateBalance, { isSuccess, error }] = useUpdateBalanceMutation();

  useEffect(() => {
    if (data) {
      setState((prevState) => ({
        ...prevState,
        walletId: data?.id,
        customer: {
          id: data?.customer?.id,
          name: data?.customer?.name,
        },
        type: data?.type,
        balanceId: data?.transaction?.id,
        currency: {
          id: data?.transaction?.currency?.id,
          abbreviation: data?.transaction?.currency?.abbreviation,
        },
        amount: data?.transaction?.amount,
        description: data?.transaction?.description,
      }));
    }
  }, [data]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const saveBalance = async () => {
    return updateBalance({
      wallet: {
        id: state.walletId,
        customerId: state.customer.id,
        type: state.type,
      },
      balance: {
        id: state.balanceId,
        currency: state.currency.id,
        amount: parseInt(state.amount, 10),
        description: state.description,
      },
    });
  };
  useImperativeHandle(ref, () => ({
    saveBalance,
  }));
  useEffect(() => {
    if (isSuccess) {
      toast.success("Balance updated successfully!");
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
    saveBalance,
  }));

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Autocomplete
            value={state.customer}
            getOptionLabel={(option) => option.name}
            options={customers}
            onChange={(event, value) => setState({ ...state, customer: value })}
            renderInput={(params) => <TextField {...params} label="Customer" />}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete
            value={state.type}
            options={["Deposit", "Withdraw"]}
            onChange={(event, value) => setState({ ...state, type: value })}
            renderInput={(params) => <TextField {...params} label="Transaction Type" />}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete
            value={state.currency}
            getOptionLabel={(option) => option.abbreviation}
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
