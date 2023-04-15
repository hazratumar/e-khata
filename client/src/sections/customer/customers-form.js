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
  Container,
  Stack,
} from "@mui/material";
import { AccountProfileDetails } from "src/sections/account/account-profile-details";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export const CustomersForm = () => {
  return (
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
            <Grid container spacing={3}>
              <Grid sx={{ width: "100%" }}>
                <form autoComplete="off" noValidate>
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
                              required
                            />
                          </Grid>
                          <Grid xs={12} md={6}>
                            <TextField fullWidth label="Nikename" name="nikename" required />
                          </Grid>
                          <Grid xs={12} md={6}>
                            <TextField fullWidth label="Email Address" name="email" required />
                          </Grid>
                          <Grid xs={12} md={6}>
                            <TextField fullWidth label="Phone Number" name="phone" required />
                          </Grid>
                          <Grid xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Address"
                              multiline
                              rows={2}
                              name="address"
                              required
                            />
                          </Grid>
                          <Grid xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Other"
                              multiline
                              rows={2}
                              name="other"
                              required
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </CardContent>
                    <Divider />
                    <CardActions sx={{ justifyContent: "flex-end" }}>
                      <Button variant="contained" type="submit">
                        Save details
                      </Button>
                    </CardActions>
                  </Card>
                </form>
              </Grid>
            </Grid>
          </div>
        </Stack>
      </Container>
    </Box>
  );
};
