import { useCallback, useEffect, useState } from "react";
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
} from "@mui/material";
import { useDispatch } from "react-redux";
import { setToken } from "../../store/reducers/authSlice";
import { useUpdateUserMutation } from "../../store/services/userService";
import { toast } from "react-hot-toast";

export const AccountProfileDetails = ({ user }) => {
  const dispatch = useDispatch();

  const [formValues, setFormValues] = useState({
    name: user?.name,
    email: user?.email,
  });

  const [updateUser, { isSuccess, isLoading, error, data }] = useUpdateUserMutation();

  const handleChange = useCallback(
    (e) => {
      setFormValues((prevValues) => ({
        ...prevValues,
        [e.target.name]: e.target.value,
      }));
    },
    [setFormValues]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      await updateUser(formValues);
    },
    [formValues, updateUser]
  );

  useEffect(() => {
    if (isSuccess) {
      dispatch(setToken(data));
      toast.success("Your data successfully updated");
      console.log("Update User", data);
    }
    if (error) {
      const errorMessage = Array.isArray(error.data.message)
        ? error.data.message[0]
        : error.data.message;
      toast.error(errorMessage);
      console.log("Error Message", error.data);
    }
  }, [isSuccess, error, data, dispatch]);

  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="The information can be edited" title="Profile" />
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
                  required
                  value={formValues.name}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  onChange={handleChange}
                  required
                  value={formValues.email}
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
  );
};
