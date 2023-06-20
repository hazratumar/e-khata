import Head from "next/head";
import { Box, Container, Stack, Typography, Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { ProfileImage } from "src/sections/account/profileImage";
import { ProfileDetails } from "src/sections/account/profileDetails";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { ChangePassword } from "../sections/account/changePassword";

const Page = () => {
  const { user } = useSelector((state) => state.auth);
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
        <title>Account | Rahat Shinwari Enterprises</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <Typography variant="h4">Account</Typography>
            <Grid item xs={12} md={6} lg={6}>
              <ProfileImage user={state} />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <ProfileDetails user={state} />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <ChangePassword />
            </Grid>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
