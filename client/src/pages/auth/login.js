import { useEffect, useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
import {
  Box,
  Button,
  Link,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Layout as AuthLayout } from "src/layouts/auth/layout";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useLogInMutation } from "src/store/services/authService";
import { useDispatch } from "react-redux";
import { setToken } from "src/store/reducers/authSlice";
import router from "next/router";
import toast from "react-hot-toast";

const Page = () => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [logIn, { isSuccess, isLoading, error, data }] = useLogInMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await logIn(formValues);
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(setToken(data));
      router.push("/");
    }
    if (error) {
      const errorMessage = Array.isArray(error?.data?.message)
        ? error?.data?.message[0]
        : error?.data?.message;
      toast.error(errorMessage);
    }
  }, [isSuccess, data, error, dispatch]);

  const handleShow = () => setShow(!show);

  return (
    <>
      <Head>
        <title>Login | User </title>
      </Head>
      <Box
        sx={{
          backgroundColor: "background.paper",
          flex: "1 1 auto",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box sx={{ maxWidth: 550, px: 3, py: "100px", width: "100%" }}>
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4"> Login </Typography>
              <Typography color="text.secondary" variant="body2">
                Don&apos;t have an account? &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/signup"
                  underline="hover"
                  variant="subtitle2"
                >
                  SignUp
                </Link>
              </Typography>
            </Stack>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formValues.email}
                  onChange={handleInputChange}
                />
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
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
                  value={formValues.password}
                  onChange={handleInputChange}
                />
              </Stack>
              <Button fullWidth size="large" sx={{ mt: 3 }} type="submit" variant="contained">
                {isLoading ? "Please wait..." : "Login"}
              </Button>
              <Link component={NextLink} href="/auth/forget" underline="none">
                <Button fullWidth size="large" sx={{ mt: 3 }}>
                  Forget Password
                </Button>
              </Link>
            </form>
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
