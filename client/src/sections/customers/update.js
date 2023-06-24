import React, { useEffect, useState } from "react";
import { useUpdateCustomerMutation } from "src/store/services/customerService";
import toast from "react-hot-toast";
import {
  Box,
  Button,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Fade,
  Grid,
  IconButton,
  Modal,
  TextField,
} from "@mui/material";
import { Edit, Close } from "@mui/icons-material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "500px",
  height: "500px",
  backgroundColor: "#fff",
  borderRadius: "10px",
  boxShadow: "0 5px 20px rgba(0, 0, 0, 0.2)",
  padding: "20px",
};

export const UpdateCustomer = ({ customer }) => {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState({
    id: customer.id,
    name: customer.name,
    nickname: customer.nickname,
    phone: customer.phone,
    address: customer.address,
    other: customer.other,
    isSelf: customer.isSelf,
  });
  const [updateCustomer, { isSuccess, isLoading, error }] = useUpdateCustomerMutation();

  const handleOpen = () => {
    setOpen(!open);
    setState({
      ...customer,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleChangeCheckbox = (e) => {
    const { checked } = e.target;
    setState((prevState) => ({ ...prevState, isSelf: checked }));
  };

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
      toast.success("Customer updated successfully!");
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
          <Box sx={{ ...style, overflowY: "auto" }}>
            <CardHeader
              subheader="Please update customer information"
              title="Update Customer"
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
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      required
                      label="Full name"
                      name="name"
                      value={state.name}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nickname"
                      name="nickname"
                      value={state.nickname}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Phone number"
                      name="phone"
                      value={state.phone}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      value={state.address}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Other information"
                      multiline
                      rows={2}
                      name="other"
                      value={state.other}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Checkbox
                      checked={state.isSelf}
                      onChange={handleChangeCheckbox}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                    <span>Self-customer</span>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
            <CardActions style={{ justifyContent: "space-between", alignItems: "center" }}>
              <Button onClick={handleOpen}>Cancel</Button>
              <Button onClick={() => updateCustomer(state)} variant="contained" color="primary">
                {isLoading ? "Loading..." : "Update Customer"}
              </Button>
            </CardActions>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};
