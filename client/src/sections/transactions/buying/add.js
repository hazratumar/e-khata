import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import {
  Autocomplete,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  SvgIcon,
  TextField,
  Typography,
} from "@mui/material";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useAddTransactionMutation } from "src/store/services/transactionService";
import { useAllCustomersQuery } from "src/store/services/customerService";
import { useAllCurrenciesQuery } from "src/store/services/currencyService";
import { AddCredit } from "src/sections/transactions/selling/add-item";
import { CreditTable } from "src/sections/transactions/selling/table";
import toast from "react-hot-toast";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  height: "95vh",
  backgroundColor: "#fff",
  borderRadius: "10px",
  boxShadow: "0 5px 20px rgba(0, 0, 0, 0.2)",
  padding: "10px",
};

export const AddBuying = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);

  const [state, setState] = useState({
    debitFrom: "",
    debitTo: "",
    currency: "",
    amount: 0,
    rate: 0,
    profit: 0,
    status: "Pending",
    credits: [],
  });

  const { data: customerOptions } = useAllCustomersQuery();
  const { data: currencyOptions } = useAllCurrenciesQuery();
  const [addTransaction, { isSuccess, isLoading, error }] = useAddTransactionMutation();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState({
      ...state,
      [name]: parseInt(value, 10) ?? 0,
    });
  };

  const addItem = (credit) => {
    const updatedCredits = state.credits ? state.credits.concat(credit) : [credit];
    setState({ ...state, credits: updatedCredits });
    console.log(state);
  };
  const deleteItem = (index) => {
    console.log(`Deleting item at index ${index}`);
    const updatedCredits = [...state.credits];
    updatedCredits.splice(index, 1);
    setState({ ...state, credits: updatedCredits });
  };

  const handleSaveTransaction = async () => {
    await addTransaction(state);
    console.log(state);
  };

  useEffect(() => {
    if (isSuccess) {
      handleOpen();
      console.log("Add data", state);
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

  return (
    <div>
      <Button
        starticon={
          <SvgIcon fontSize="small">
            <PlusIcon />
          </SvgIcon>
        }
        variant="contained"
        onClick={handleOpen}
      >
        Buy
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleOpen}
        closeAfterTransition
      >
        <Fade in={open}>
          <Box sx={{ ...style, overflowY: "auto" }}>
            <CardHeader
              subheader="Please enter Buying information"
              title="Add Buying"
              action={
                <IconButton aria-label="close" onClick={handleOpen}>
                  <SvgIcon fontSize="small">
                    <XMarkIcon />
                  </SvgIcon>
                </IconButton>
              }
              sx={{ width: "100%" }}
            />
            <CardContent sx={{ p: 2 }}>
              <Grid container direction="row" spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h5">Debit</Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={6} md={6}>
                      <Autocomplete
                        getOptionLabel={(option) => option.name}
                        options={customerOptions ?? ""}
                        onChange={(event, value) => setState({ ...state, debitFrom: value.id })}
                        renderInput={(params) => <TextField {...params} label="From" />}
                      />
                    </Grid>
                    <Grid item xs={6} md={6}>
                      <Autocomplete
                        getOptionLabel={(option) => option.name}
                        options={customerOptions ?? ""}
                        onChange={(event, value) => setState({ ...state, debitTo: value.id })}
                        renderInput={(params) => <TextField {...params} label="To" />}
                      />
                    </Grid>
                    <Grid item xs={6} md={6}>
                      <Autocomplete
                        getOptionLabel={(option) => option.name}
                        options={currencyOptions ?? ""}
                        onChange={(event, value) => setState({ ...state, currency: value.id })}
                        renderInput={(params) => <TextField {...params} label="Currency" />}
                      />
                    </Grid>
                    <Grid item xs={6} md={6}>
                      <TextField
                        type="number"
                        fullWidth
                        label="Amount"
                        name="amount"
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <TextField
                        type="number"
                        fullWidth
                        label="Rate"
                        name="rate"
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <TextField
                        type="number"
                        fullWidth
                        label="Profit"
                        name="profit"
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <Autocomplete
                        value={state.status}
                        options={["Pending", "Cash"]}
                        onChange={(event, value) => setState({ ...state, status: value })}
                        renderInput={(params) => <TextField {...params} label="Status" />}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h5">Credit</Typography>
                  <Grid container spacing={1}>
                    <AddCredit addItem={addItem} />
                    <CreditTable items={state.credits} deleteItem={deleteItem} />
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
            <CardActions style={{ justifyContent: "space-between", alignItems: "center" }}>
              <Button>Cancel</Button>
              <Button variant="contained" color="primary" onClick={handleSaveTransaction}>
                {isLoading ? "Loading..." : "Save Transaction"}
              </Button>
            </CardActions>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};
