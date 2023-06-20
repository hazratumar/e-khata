import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Stack,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { setToken } from "src/store/reducers/authSlice";
import { useUpdateUserMutation } from "src/store/services/userService";
import { toast } from "react-hot-toast";

export const ProfileDetails = ({ user }) => {
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
    }
    if (error) {
      const errorMessage = Array.isArray(error.data.message)
        ? error.data.message[0]
        : error.data.message;
      toast.error(errorMessage);
    }
  }, [isSuccess, error, data, dispatch]);

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="The information can be edited" title="Profile" />
        <CardContent sx={{ pt: 0 }}>
          <Stack spacing={3} sx={{ maxWidth: 400 }}>
            <TextField
              fullWidth
              helperText="Please specify the full name"
              label="Full name"
              name="name"
              onChange={handleChange}
              required
              value={formValues.name}
            />
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              onChange={handleChange}
              required
              value={formValues.email}
            />
          </Stack>
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
