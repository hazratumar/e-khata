import { useEffect, useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
import {
  Box,
  Button,
  Link,
  Stack,
  TextField,
  InputAdornment,
  Typography,
  IconButton,
} from "@mui/material";
import { Layout as AuthLayout } from "src/layouts/auth/layout";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useSignUpMutation } from "src/store/services/authService";
import { useDispatch } from "react-redux";
import { setToken } from "src/store/reducers/authSlice";
import toast from "react-hot-toast";
import router from "next/router";

const Page = () => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [signUp, { isSuccess, isLoading, error, data }] = useSignUpMutation();

  const handleShow = () => setShow(!show);

  const handleChange = (e) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signUp(formValues);
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(setToken(data));
      router.push("/");
    }
    if (error) {
      const errorMessage = Array.isArray(error?.data?.message)
        ? error.data.message[0]
        : error.data.message;
      toast.error(errorMessage);
    }
  }, [isSuccess, data, error, dispatch]);

  return (
    <>
      <Head>
        <title>SignUp | User</title>
      </Head>
      <Box
        sx={{
          flex: "1 1 auto",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: "100px",
            width: "100%",
          }}
        >
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4">SignUp</Typography>
              <Typography color="text.secondary" variant="body2">
                Already have an account? &nbsp;
                <Link component={NextLink} href="/auth/login" underline="hover" variant="subtitle2">
                  Login
                </Link>
              </Typography>
            </Stack>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formValues.name}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formValues.email}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  label="New Password"
                  name="newPassword"
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
                  value={formValues.newPassword}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
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
                  value={formValues.confirmPassword}
                  onChange={handleChange}
                />
              </Stack>
              <Button fullWidth size="large" sx={{ mt: 3 }} type="submit" variant="contained">
                {isLoading ? "Please wait..." : "SignUp"}
              </Button>
            </form>
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
