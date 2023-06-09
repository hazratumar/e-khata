import { Autocomplete, Grid, TextField } from "@mui/material";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useAddBalanceMutation } from "src/store/services/balanceService";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export const AddBalance = forwardRef((props, ref) => {
  const [state, setState] = useState({
    customer: "",
    currency: "",
    type: "",
    amount: "",
    description: "",
  });

  const { customers, currencies } = useSelector((state) => state.option);
  const [addBalance, { isSuccess, error }] = useAddBalanceMutation();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const saveBalance = async () => {
    const { customer, currency, type, amount, description } = state;

    return addBalance({
      wallet: { customer: customer.id, type },
      balance: { currency: currency.id, amount, description },
    });
  };

  useImperativeHandle(ref, () => ({ saveBalance }));

  useEffect(() => {
    if (isSuccess) {
      toast.success("Balance added successfully!");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      const errorMessage = Array.isArray(error?.data?.message)
        ? error.data.message[0]
        : error.data.message;
      toast.error(errorMessage);
    }
  }, [error]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Autocomplete
          getOptionLabel={(option) => option.name || ""}
          options={customers}
          onChange={(event, value) => setState({ ...state, customer: value })}
          renderInput={(params) => <TextField {...params} label="Customer" />}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Autocomplete
          options={["Deposit", "Withdraw"]}
          onChange={(event, value) => setState({ ...state, type: value })}
          renderInput={(params) => <TextField {...params} label="Transaction Type" />}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Autocomplete
          getOptionLabel={(option) => option.abbreviation || ""}
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
  );
});
