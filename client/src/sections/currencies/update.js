import React, { useState, useEffect } from "react";
import {
  Button,
  IconButton,
  SvgIcon,
  TextField,
  Modal,
  Fade,
  CardHeader,
  CardContent,
  CardActions,
  Grid,
} from "@mui/material";
import { Close, Edit } from "@mui/icons-material";
import { useUpdateCurrencyMutation } from "src/store/services/currencyService";
import { toast } from "react-hot-toast";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "350px",
  height: "430px",
  backgroundColor: "#fff",
  borderRadius: "10px",
  boxShadow: "0 5px 20px rgba(0, 0, 0, 0.2)",
  padding: "20px",
};

export const UpdateCurrency = ({ currency }) => {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState(currency);
  const [UpdateCurrency, { isLoading, isSuccess, error }] = useUpdateCurrencyMutation();

  const handleOpen = () => {
    setOpen(!open);
    setState(currency);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await UpdateCurrency(state);
  };

  useEffect(() => {
    if (isSuccess) {
      handleOpen();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      const errorMessage = Array.isArray(error.data?.message)
        ? error.data.message[0]
        : error.data?.message;
      toast.error(errorMessage);
    }
  }, [error]);

  return (
    <div>
      <Button onClick={handleOpen}>
        <Edit />
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleOpen}
        closeAfterTransition
      >
        <Fade in={open}>
          <div style={style}>
            <CardHeader
              subheader="Please update currency information"
              title="Update Currency"
              action={
                <IconButton aria-label="close" onClick={handleOpen}>
                  <Close />
                </IconButton>
              }
              sx={{ width: "100%" }}
            />
            <CardContent sx={{ pt: 0 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Name"
                    name="name"
                    value={state.name}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    disabled
                    label="Abbreviation"
                    name="abbreviation"
                    value={state.abbreviation}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Rate"
                    name="rate"
                    value={state.rate}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions style={{ justifyContent: "space-between", alignItems: "center" }}>
              <Button onClick={handleOpen}>Cancel</Button>
              <Button onClick={handleSubmit} variant="contained" color="primary">
                {isLoading ? "Loading..." : "Update Currency"}
              </Button>
            </CardActions>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};
