import PropTypes from "prop-types";
import { Box, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { AuthGuard } from "src/guards/auth-guard";

// TODO: Change subtitle text

export const AuthLayout = (props) => {
  const { children } = props;

  return (
    <AuthGuard>
      <Box
        component="main"
        sx={{
          display: "flex",
          flex: "1 1 auto",
        }}
      >
        <Grid container sx={{ flex: "1 1 auto" }}>
          <Grid
            xs={12}
            lg={6}
            sx={{
              backgroundColor: "background.paper",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            {children}
          </Grid>
          <Grid
            xs={12}
            lg={6}
            sx={{
              alignItems: "center",
              background: "radial-gradient(50% 50% at 50% 50%, #122647 0%, #090E23 100%)",
              color: "white",
              display: "flex",
              justifyContent: "center",
              "& img": {
                maxWidth: "100%",
              },
            }}
          >
            <Box sx={{ p: 3 }}>
              <Typography
                align="center"
                color="inherit"
                sx={{
                  fontSize: "24px",
                  lineHeight: "32px",
                  mb: 1,
                }}
                variant="h1"
              >
                Welcome to{" "}
                <Box component="a" sx={{ color: "#15B79E" }} target="_blank">
                  Shinwari Enterprises
                </Box>
              </Typography>
              <Typography align="center" sx={{ mb: 3 }} variant="subtitle1"></Typography>
              <img alt="" src="/assets/login.png" />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </AuthGuard>
  );
};

AuthLayout.prototypes = {
  children: PropTypes.node,
};
