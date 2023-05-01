import React from "react";
import { Box, Button, Container, Paper, Stack, Typography } from "@mui/material";

export const Done = ({ resetFrom, handleOpen }) => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Your transaction has been added successfully
          </Typography>
          <Stack spacing={2} sx={{ mt: 4 }}>
            <Button variant="contained" color="primary" onClick={resetFrom} fullWidth>
              Add Another Transaction
            </Button>
            <Button variant="outlined" color="primary" onClick={handleOpen} fullWidth>
              View All Transactions
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
};
