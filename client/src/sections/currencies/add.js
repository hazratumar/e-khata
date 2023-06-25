import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Modal,
  TextField,
  Fade,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import { useAddCurrencyMutation } from "src/store/services/currencyService";
import toast from "react-hot-toast";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "350px",
  height: "410px",
  backgroundColor: "#fff",
  borderRadius: "10px",
  boxShadow: "0 5px 20px rgba(0, 0, 0, 0.2)",
  padding: "20px",
};

export const AddCurrency = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
    setFormValues({
      name: "",
      abbreviation: "",
      rate: 0,
    });
  };

  const [formValues, setFormValues] = useState({
    name: "",
    abbreviation: "",
    rate: 0,
  });

  const [addCurrency, { isLoading, error }] = useAddCurrencyMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value.trim() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addCurrency(formValues);
    handleOpen();
  };

  useEffect(() => {
    if (error) {
      const errorMessage = Array.isArray(error.data?.message)
        ? error.data.message[0]
        : error.data?.message;
      toast.error(errorMessage);
    }
  }, [error]);

  const { name, abbreviation, rate } = formValues;

  return (
    <div>
      <Button startIcon={<Add />} variant="contained" onClick={handleOpen}>
        Add Currency
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
              subheader="Please enter currency information"
              title="Add Currency"
              action={
                <IconButton aria-label="close" onClick={handleOpen}>
                  <Close />
                </IconButton>
              }
              sx={{ width: "100%" }}
            />
            <CardContent sx={{ pt: 0 }}>
              <Box sx={{ m: -1.5 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Name"
                      name="name"
                      value={name}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Abbreviation"
                      name="abbreviation"
                      value={abbreviation}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      type="number"
                      fullWidth
                      required
                      label="Rate"
                      name="rate"
                      value={rate}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
            <CardActions style={{ justifyContent: "space-between", alignItems: "center" }}>
              <Button onClick={handleOpen}>Cancel</Button>
              <Button onClick={handleSubmit} variant="contained" color="primary">
                {isLoading ? "Loading..." : "Add Currency"}
              </Button>
            </CardActions>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};
