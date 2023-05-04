import Head from "next/head";
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { AccountProfile } from "src/sections/account/account-profile";
import { AccountProfileDetails } from "src/sections/account/account-profile-details";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const Page = () => {
  const { user } = useSelector((state) => state.authReducer);
  const [state, setState] = useState({
    name: user?.name,
    email: user?.email,
    image: user?.image,
  });

  useEffect(() => {
    setState({
      ...state,
      name: user?.name,
      email: user?.email,
      image: user?.image,
    });
  }, [state, user]);

  return (
    <>
      <Head>
        <title>Account | e-khata</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <div>
              <Typography variant="h4">Account</Typography>
            </div>
            <div>
              <Grid container spacing={3}>
                <Grid xs={12} md={6} lg={4}>
                  <AccountProfile user={state} />
                </Grid>
                <Grid xs={12} md={6} lg={8}>
                  <AccountProfileDetails user={state} />
                </Grid>
              </Grid>
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
