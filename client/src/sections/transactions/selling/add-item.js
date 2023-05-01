import React, { useState } from "react";
import Button from "@mui/material/Button";
import { Autocomplete, Grid, TextField } from "@mui/material";
import { useAllCustomersQuery } from "src/store/services/customerService";
import { useAllCurrenciesQuery } from "src/store/services/currencyService";

export const AddDebit = ({ addItem }) => {
  const [item, setItem] = useState({
    type: "Debit",
    from: "",
    to: "",
    currency: "",
    amount: "",
    rate: "",
    profit: "",
  });

  const { data: customerOptions } = useAllCustomersQuery();
  const { data: currencyOptions } = useAllCurrenciesQuery();

  const handleSaveCredit = () => addItem(item);

  return (
    <>
      <Grid item xs={6} md={6}>
        <Autocomplete
          getOptionLabel={(option) => option.name}
          options={customerOptions ?? []}
          onChange={(event, value) => setItem({ ...item, from: value.id })}
          renderInput={(params) => <TextField {...params} label="From" />}
        />
      </Grid>
      <Grid item xs={6} md={6}>
        <Autocomplete
          getOptionLabel={(option) => option.name}
          options={customerOptions ?? []}
          onChange={(event, value) => setItem({ ...item, to: value.id })}
          renderInput={(params) => <TextField {...params} label="To" />}
        />
      </Grid>
      <Grid item xs={6} md={5}>
        <Autocomplete
          getOptionLabel={(option) => option.name}
          options={currencyOptions ?? []}
          onChange={(event, value) => setItem({ ...item, currency: value.id })}
          renderInput={(params) => <TextField {...params} label="Currency" />}
        />
      </Grid>
      <Grid item xs={6} md={5}>
        <TextField
          type="number"
          fullWidth
          label="Amount"
          onChange={(event) => setItem({ ...item, amount: event.target.value })}
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
