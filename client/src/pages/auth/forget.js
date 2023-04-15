import Head from "next/head";
import NextLink from "next/link";
import { Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { Layout as AuthLayout } from "src/layouts/auth/layout";
import { useState } from "react";

const Page = () => {
  const [send, setSend] = useState(true);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    console.log(email);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    console.log(otp);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSend(!send);
    console.log(send);
  };
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
                {send ? (
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    onChange={handleEmailChange}
                    value={email}
                  />
                ) : (
                  <TextField
                    fullWidth
                    label="One Time Password"
                    name="otp"
                    type="text"
                    onChange={handleOtpChange}
                    value={otp}
                  />
                )}
              </Stack>
              <Button fullWidth size="large" sx={{ mt: 3 }} type="submit" variant="contained">
                {send ? "Send OTP" : "Verify OTP"}
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
