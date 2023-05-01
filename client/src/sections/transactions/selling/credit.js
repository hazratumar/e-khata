import { Autocomplete, Grid, Stack, TextField } from "@mui/material";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useAddTransactionMutation } from "src/store/services/transactionService";
import { useAllCustomersQuery } from "src/store/services/customerService";
import { useAllCurrenciesQuery } from "src/store/services/currencyService";
import { useDispatch, useSelector } from "react-redux";
import { storeTransaction } from "src/store/reducers/transactionSlice";
import { useGetTransactionItemsQuery } from "src/store/services/transactionItemService";
import toast from "react-hot-toast";

export const AddCredit = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state.transaction);
  const [transaction, setTransaction] = useState({ type: "Sale", status: store?.status });
  const [item, setItem] = useState({
    type: "Credit",
    from: "",
    to: "",
    currency: "",
    amount: "",
    rate: "",
    profit: "",
  });
  const { data: customerOptions } = useAllCustomersQuery();
  const { data: currencyOptions } = useAllCurrenciesQuery();
  const [addTransaction, { isSuccess, error, data }] = useAddTransactionMutation();
  const { data: getItem, refetch } = useGetTransactionItemsQuery({ transactionId: store?.id });
  const creditItem = getItem?.find((item) => item.type === "Credit");

  useEffect(() => {
    if (creditItem) {
      setItem({
        ...item,
        id: creditItem.id,
        from: creditItem.from.id,
        to: creditItem.to.id,
        currency: creditItem.currency.id,
        amount: creditItem.amount,
        rate: creditItem.rate,
        profit: creditItem.profit,
      });
    }
  }, [creditItem]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setItem((prevItem) => ({ ...prevItem, [name]: value }));
  };

  const saveCredit = async () => {
    const { data } = await addTransaction({ isCreated: store?.isCreated, transaction, item });
    if (data) {
      return true;
    }
  };

  useImperativeHandle(ref, () => ({
    saveCredit,
  }));

  useEffect(() => {
    if (isSuccess) {
      toast.success(`Credit ${store?.isCreated ? "updated" : "added"} successfully`);
      dispatch(
        storeTransaction({ isCreated: true, id: data?.id, type: data?.type, status: data?.status })
      );
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

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <Stack sx={{ height: "50vh" }}>
      <Grid container spacing={1}>
        <Grid item xs={6} md={6}>
          <Autocomplete
            getOptionLabel={(option) => option.name}
            options={customerOptions ?? ""}
            onChange={(event, value) => setItem({ ...item, from: value.id })}
            renderInput={(params) => <TextField {...params} label="From" />}
          />
        </Grid>
        <Grid item xs={6} md={6}>
          <Autocomplete
            getOptionLabel={(option) => option.name}
            options={customerOptions ?? ""}
            onChange={(event, value) => setItem({ ...item, to: value.id })}
            renderInput={(params) => <TextField {...params} label="To" />}
          />
        </Grid>
        <Grid item xs={6} md={6}>
          <Autocomplete
            getOptionLabel={(option) => option.name}
            options={currencyOptions ?? ""}
            onChange={(event, value) => setItem({ ...item, currency: value.id })}
            renderInput={(params) => <TextField {...params} label="Currency" />}
          />
        </Grid>
        <Grid item xs={6} md={6}>
          <TextField
            type="number"
            value={item.amount}
            fullWidth
            label="Amount"
            name="amount"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6} md={4}>
          <TextField
            type="number"
            value={item.rate}
            fullWidth
            label="Rate"
            name="rate"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6} md={4}>
          <TextField
            type="number"
            value={item.profit}
            fullWidth
            label="Profit"
            name="profit"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6} md={4}>
          <Autocomplete
            value={transaction.status}
            options={["Pending", "Cash"]}
            onChange={(event, value) => setTransaction({ ...transaction, status: value })}
            renderInput={(params) => <TextField {...params} label="Status" />}
          />
        </Grid>
      </Grid>
    </Stack>
  );
});
