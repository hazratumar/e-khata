import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import toast from "react-hot-toast";
import { setToken } from "src/store/reducers/authSlice";
import { useResetPasswordMutation } from "src/store/services/authService";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export const ChangePassword = () => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [state, setState] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [resetPassword, { isSuccess, isLoading, error, data }] = useResetPasswordMutation();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await resetPassword(state);
  };

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setToken(data));
      toast.success("Your password was successfully reset.");
      setState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
    if (error) {
      const errorMessage = Array.isArray(error.data.message)
        ? error.data.message[0]
        : error.data.message;
      toast.error(errorMessage);
    }
  }, [isSuccess, error, data, dispatch]);

  const handleShow = () => setShow(!show);

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="Update password" title="Password" />
        <Divider />
        <CardContent>
          <Stack spacing={3} sx={{ maxWidth: 400 }}>
            <TextField
              label="Old Password"
              name="oldPassword"
              onChange={handleChange}
              value={state.oldPassword}
              type={show ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShow}>
                      {show ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="New Password"
              name="newPassword"
              onChange={handleChange}
              value={state.newPassword}
              type={show ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShow}>
                      {show ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              onChange={handleChange}
              value={state.confirmPassword}
              type={show ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShow}>
                      {show ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button type="submit" variant="contained">
            {isLoading ? "Loading..." : "Change Password"}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
