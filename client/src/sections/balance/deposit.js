import { Autocomplete, Grid, TextField } from "@mui/material";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useAddBalanceMutation } from "src/store/services/balanceService";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export const DepositBalance = forwardRef((props, ref) => {
  const [state, setState] = useState({
    customer: "",
    currency: "",
    amount: "",
    description: "",
  });
  const { customers, currencies } = useSelector((state) => state.option);

  const [addBalance, { isSuccess, error }] = useAddBalanceMutation();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const saveBalance = async () => {
    return addBalance({
      wallet: {
        customer: state.customer.id,
        type: "Deposit",
      },
      balance: {
        currency: state.currency.id,
        amount: state.amount,
        description: state.description,
      },
    });
  };

  useImperativeHandle(ref, () => ({
    saveBalance,
  }));

  useEffect(() => {
    if (isSuccess) {
      toast.success("Balance deposit successfully");
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
        <Grid item xs={12} md={12}>
          <Autocomplete
            getOptionLabel={(option) => option.name}
            options={customers}
            onChange={(event, value) => setState({ ...state, customer: value })}
            renderInput={(params) => <TextField {...params} label="Customer" />}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Autocomplete
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
