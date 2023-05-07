import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import {
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Grid,
  IconButton,
  MenuItem,
  SvgIcon,
  TextField,
} from "@mui/material";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useUpdateCustomerMutation } from "src/store/services/customerService";
import toast from "react-hot-toast";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  backgroundColor: "#fff",
  borderRadius: "10px",
  boxShadow: "0 5px 20px rgba(0, 0, 0, 0.2)",
  padding: "10px",
};

export const UpdateCustomer = (props) => {
  const { customer } = props;
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
    setState((prevValues) => ({
      ...prevValues,
      id: customer.id,
      name: customer.name,
      nickname: customer.nickname,
      phone: customer.phone,
      address: customer.address,
      other: customer.other,
      isSelf: customer.isSelf,
    }));
  };

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevValues) => ({ ...prevValues, [name]: value }));
  };
  const handleChangeCheckbox = (event) => {
    setState((prevValues) => ({ ...prevValues, isSelf: event.target.checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateCustomer(state);
  };

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
      console.log("Update data", state);
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
      <MenuItem
        starticon={
          <SvgIcon fontSize="small">
            <PlusIcon />
          </SvgIcon>
        }
        variant="contained"
        onClick={handleOpen}
      >
        Update
      </MenuItem>
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
                  <SvgIcon fontSize="small">
                    <XMarkIcon />
                  </SvgIcon>
                </IconButton>
              }
              sx={{ width: "100%" }}
            />
            <CardContent sx={{ pt: 0 }}>
              <Box sx={{ m: -1.5 }}>
                <Grid container spacing={3}>
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
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                    <span>Self-customer</span>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
            <CardActions style={{ justifyContent: "space-between", alignItems: "center" }}>
              <Button onClick={handleOpen}>Cancel</Button>
              <Button onClick={handleSubmit} variant="contained" color="primary">
                {isLoading ? "Loading..." : "Update Customer"}
              </Button>
            </CardActions>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};
