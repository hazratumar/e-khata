import React, { useState } from "react";
import Button from "@mui/material/Button";
import { Autocomplete, Grid, TextField } from "@mui/material";
import { useAllCustomersQuery } from "src/store/services/customerService";
import { useAllCurrenciesQuery } from "src/store/services/currencyService";
import toast from "react-hot-toast";
import Joi from "joi";

const schema = Joi.object({
  creditFrom: Joi.number().required().label("From"),
  creditTo: Joi.number().required().label("To"),
  currency: Joi.number().required().label("Currency"),
  amount: Joi.number().min(1).required().label("Amount"),
});

export const AddCredit = ({ addItem }) => {
  const [credit, setCredit] = useState({
    creditFrom: "",
    creditTo: "",
    currency: "",
    amount: 0,
  });
  const [errors, setErrors] = useState({});

  const { data: customerOptions } = useAllCustomersQuery();
  const { data: currencyOptions } = useAllCurrenciesQuery();

  const handleSaveCredit = () => {
    const validationErrors = schema
      .validate(credit, { abortEarly: false })
      .error?.details.reduce((acc, cur) => {
        return { ...acc, [cur.path[0]]: cur.message };
      }, {});
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }
    addItem(credit);
    setCredit({
      creditFrom: "",
      creditTo: "",
      currency: "",
      amount: 0,
    });
    toast.success("Credit saved successfully!");
  };

  return (
    <>
      <Grid item xs={6} md={6}>
        <Autocomplete
          getOptionLabel={(option) => option.name}
          options={customerOptions ?? ""}
          value={customerOptions.find((option) => option.id === credit.creditFrom) || null}
          onChange={(event, value) => setCredit({ ...credit, creditFrom: value?.id || "" })}
          renderInput={(params) => (
            <TextField
              {...params}
              label="From"
              error={!!errors.creditFrom}
              helperText={errors.creditFrom}
            />
          )}
        />
      </Grid>
      <Grid item xs={6} md={6}>
        <Autocomplete
          getOptionLabel={(option) => option.name}
          options={customerOptions ?? ""}
          value={customerOptions.find((option) => option.id === credit.creditTo) || null}
          onChange={(event, value) => setCredit({ ...credit, creditTo: value?.id || "" })}
          renderInput={(params) => (
            <TextField
              {...params}
              label="To"
              error={!!errors.creditTo}
              helperText={errors.creditTo}
            />
          )}
        />
      </Grid>
      <Grid item xs={6} md={5}>
        <Autocomplete
          getOptionLabel={(option) => option.name}
          options={currencyOptions ?? ""}
          value={currencyOptions?.find((option) => option.id === credit.currency) || null}
          onChange={(event, value) => setCredit({ ...credit, currency: value?.id || "" })}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Currency"
              error={!!errors.currency}
              helperText={errors.currency}
            />
          )}
        />
      </Grid>
      <Grid item xs={6} md={5}>
        <TextField
          type="number"
          fullWidth
          label="Amount"
          onChange={(event) => setCredit({ ...credit, amount: parseInt(event.target.value, 10) })}
          error={!!errors.amount}
          helperText={errors.amount}
        />
      </Grid>
      <Grid item xs={12} md={2}>
        <Button variant="contained" fullWidth onClick={handleSaveCredit}>
          Add
        </Button>
      </Grid>
    </>
  );
};
