import React, { useCallback, useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  TextField,
} from "@mui/material";

export const SettingsPassword = () => {
  const [values, setValues] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      // Add your logic for password update here
      // For example, you can perform validation or make an API request
      console.log(values); // Outputs the form values to the console
    },
    [values]
  );

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="Update password" title="Password" />
        <Divider />
        <CardContent>
          <Stack spacing={3} sx={{ maxWidth: 400 }}>
            <TextField
              fullWidth
              label="Old Password"
              name="oldPassword"
              onChange={handleChange}
              type="password"
              value={values.oldPassword}
            />
            <TextField
              fullWidth
              label="New Password"
              name="newPassword"
              onChange={handleChange}
              type="password"
              value={values.newPassword}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              onChange={handleChange}
              type="password"
              value={values.confirmPassword}
            />
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button type="submit" variant="contained">
            Update
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
