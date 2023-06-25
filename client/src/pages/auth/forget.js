import Head from "next/head";
import NextLink from "next/link";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Layout as AuthLayout } from "src/layouts/auth/layout";
import { useEffect, useState } from "react";
import {
  useForgetPasswordMutation as useSendOtp,
  useSubmitOtpMutation as useSubmitOtp,
  useNewPasswordMutation as useSubmitNewPassword,
} from "src/store/services/authService";
import { setToken } from "src/store/reducers/authSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import router from "next/router";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Page = () => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [form, setForm] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [sendOtp, { isSuccess: isSend, isLoading: isSending, error: sendError, data: sendData }] =
    useSendOtp();

  const [
    submitOtp,
    {
      isSuccess: isSubmitOtp,
      isLoading: isSubmittingOtp,
      error: submitOtpError,
      data: submitOtpData,
    },
  ] = useSubmitOtp();

  const [
    submitNewPassword,
    {
      isSuccess: isNewPwdSubmitted,
      isLoading: isSubmittingNewPwd,
      error: submitNewPwdError,
      data: submitNewPwdData,
    },
  ] = useSubmitNewPassword();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form === 1) {
        await sendOtp(formData);
      } else if (form === 2) {
        await submitOtp(formData);
      } else {
        await submitNewPassword(formData);
      }
    } catch (error) {
      toast.error("An error occurred while submitting the form.");
    }
  };
  const handleShow = () => setShow(!show);

  useEffect(() => {
    if (isSend) {
      toast.success(sendData?.message);
      setForm(2);
    }
    if (sendError) {
      const errorMessage = Array.isArray(sendError?.data?.message)
        ? sendError?.data?.message[0]
        : sendError?.data?.message;
      toast.error(errorMessage);
    }
  }, [isSend, sendData, sendError]);

  useEffect(() => {
    if (isSubmitOtp) {
      toast.success(submitOtpData?.message);
      setForm(3);
    }
    if (submitOtpError) {
      const errorMessage = Array.isArray(submitOtpError?.data?.message)
        ? submitOtpError?.data?.message[0]
        : submitOtpError?.data?.message;
      toast.error(errorMessage);
    }
  }, [isSubmitOtp, submitOtpData, submitOtpError]);

  useEffect(() => {
    if (isNewPwdSubmitted) {
      toast.success("Password created successfully.");
      dispatch(setToken(submitNewPwdData));
      router.push("/");
    }
    if (submitNewPwdError) {
      const errorMessage = Array.isArray(submitNewPwdError?.data?.message)
        ? submitNewPwdError?.data?.message[0]
        : submitNewPwdError?.data?.message;
      toast.error(errorMessage);
    }
  }, [isNewPwdSubmitted, submitNewPwdData, submitNewPwdError]);

  return (
    <>
      <Head>
        <title>Forget Password | User</title>
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
              <Typography variant="h4">Forget Password</Typography>
              <Typography color="text.secondary" variant="body2">
                No problem, you can reset it using our password recovery feature. If you don&apos;t
                have an account yet, you can easily create one by registering with us.&nbsp;
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
                {form === 1 ? (
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    onChange={handleInputChange}
                    value={formData.email}
                  />
                ) : form === 2 ? (
                  <TextField
                    fullWidth
                    label="One Time Password"
                    name="otp"
                    type="text"
                    onChange={handleInputChange}
                    value={formData.otp}
                  />
                ) : (
                  <>
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
                      onChange={handleInputChange}
                      value={formData.newPassword}
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
                      onChange={handleInputChange}
                      value={formData.confirmPassword}
                    />
                  </>
                )}
              </Stack>
              <Button fullWidth size="large" sx={{ mt: 3 }} type="submit" variant="contained">
                {form === 1
                  ? isSending
                    ? "Sending..."
                    : "Send OTP"
                  : form === 2
                  ? isSubmittingOtp
                    ? "Verifying..."
                    : "Verify OTP"
                  : isSubmittingNewPwd
                  ? "Loading..."
                  : "Submit Password"}
              </Button>
              <Link component={NextLink} href="/auth/login" underline="none">
                <Button fullWidth size="large" sx={{ mt: 3 }}>
                  Login
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
