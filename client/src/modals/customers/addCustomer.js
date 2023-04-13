import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid,
  Container,
  Stack,
  SvgIcon,
  Modal,
  IconButton,
} from "@mui/material";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useAddCustomerMutation } from "../../store/services/customerService";
import toast from "react-hot-toast";

export const AddCustomer = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };
  const [formValues, setFormValues] = useState({
    name: "",
    nickname: "",
    email: "",
    phone: "",
    address: "",
    other: "",
  });
  const [AddCustomer, { isSuccess, isLoading, error, data }] = useAddCustomerMutation();
  const handleChange = (e) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await AddCustomer(formValues);
  };

  useEffect(() => {
    if (isSuccess) {
      console.log("Add data", data);
    }
    if (error) {
      const errorMessage = Array.isArray(error.data.message)
        ? error.data.message[0]
        : error.data.message;
      toast.error(errorMessage);
      console.log("Error Message", error);
    }
  }, [data, error, isLoading, isSuccess]);
  return (
    <div>
      <Button
        startIcon={
          <SvgIcon fontSize="small">
            <PlusIcon />
          </SvgIcon>
        }
        variant="contained"
        onClick={handleOpen}
      >
        Add
      </Button>
      <Modal
        keepMounted
        open={open}
        onClose={handleOpen}
        closeAfterTransition
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
          <Container maxWidth="lg">
            <Stack spacing={3}>
              <div>
                <Grid container spacing={3} sx={{ display: "flex", justifyContent: "center" }}>
                  <Grid lg={8}>
                    <form onSubmit={handleSubmit}>
                      <Card sx={{ p: 2 }}>
                        <CardHeader
                          subheader="The information can be edited"
                          title="Add Customer"
                          action={
                            <IconButton aria-label="close" onClick={handleOpen}>
                              <SvgIcon fontSize="small">
                                <XMarkIcon />
                              </SvgIcon>
                            </IconButton>
                          }
                        />
                        <CardContent sx={{ pt: 0 }}>
                          <Box sx={{ m: -1.5 }}>
                            <Grid container spacing={3}>
                              <Grid xs={12} md={6}>
                                <TextField
                                  fullWidth
                                  helperText="Please specify the full name"
                                  label="Full name"
                                  name="name"
                                  onChange={handleChange}
                                />
                              </Grid>
                              <Grid xs={12} md={6}>
                                <TextField
                                  fullWidth
                                  label="Nickname"
                                  name="nickname"
                                  onChange={handleChange}
                                />
                              </Grid>
                              <Grid xs={12} md={6}>
                                <TextField
                                  fullWidth
                                  label="Email Address"
                                  name="email"
                                  onChange={handleChange}
                                />
                              </Grid>
                              <Grid xs={12} md={6}>
                                <TextField
                                  fullWidth
                                  label="Phone Number"
                                  name="phone"
                                  onChange={handleChange}
                                />
                              </Grid>
                              <Grid xs={12} md={6}>
                                <TextField
                                  fullWidth
                                  label="Address"
                                  multiline
                                  rows={2}
                                  name="address"
                                  onChange={handleChange}
                                />
                              </Grid>
                              <Grid xs={12} md={6}>
                                <TextField
                                  fullWidth
                                  label="Other"
                                  multiline
                                  rows={2}
                                  name="other"
                                  onChange={handleChange}
                                />
                              </Grid>
                            </Grid>
                          </Box>
                        </CardContent>
                        <Divider />
                        <CardActions sx={{ justifyContent: "flex-end" }}>
                          <Button variant="contained" type="submit">
                            {isLoading ? "Loading..." : "Save details"}
                          </Button>
                        </CardActions>
                      </Card>
                    </form>
                  </Grid>
                </Grid>
              </div>
            </Stack>
          </Container>
        </Box>
      </Modal>
    </div>
  );
};
