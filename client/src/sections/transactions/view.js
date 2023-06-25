import {
  Box,
  Modal,
  Fade,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  MenuItem,
  Typography,
  Divider,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import { useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  height: "90vh",
  backgroundColor: "#fff",
  borderRadius: "10px",
  boxShadow: "0 5px 20px rgba(0, 0, 0, 0.2)",
  padding: "10px",
};

export const ViewTransaction = (props) => {
  const { transaction } = props;
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  const singleItem = transaction.transactionItem.find((item) => {
    return item.type === (transaction.type === "Sale" ? "Credit" : "Debit");
  });

  const multiItems = transaction.transactionItem.filter((item) => {
    return item.type === (transaction.type === "Sale" ? "Debit" : "Credit");
  });

  return (
    <div>
      <MenuItem starticon={<Add />} variant="contained" onClick={handleOpen}>
        View
      </MenuItem>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleOpen}
        closeAfterTransition
      >
        <Fade in={open}>
          <Box sx={{ ...style, overflowY: "auto" }}>
            <CardHeader
              subheader="Complete Transaction"
              title={transaction.type}
              action={
                <IconButton aria-label="close" onClick={handleOpen}>
                  <Close />
                </IconButton>
              }
              sx={{ width: "100%" }}
            />
            <CardContent sx={{ pt: 0 }}>
              <Box>
                <Divider />
                <Typography>Type: {singleItem.type}</Typography>
                <Typography>
                  Description:
                  {singleItem.type + " from " + singleItem.from.name + " to " + singleItem.to.name}
                </Typography>
                <Typography>Amount: {singleItem.amount}</Typography>
                <Typography>Exchange Rate: {singleItem.rate}</Typography>
                <Typography>Profit: {singleItem.profit}</Typography>
                <Typography>Status: {transaction.status}</Typography>
              </Box>
              <Divider />
              <Grid item xs={12} md={12} lg={12}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead sx={{ position: "sticky", top: 0 }}>
                      <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell>From</TableCell>
                        <TableCell>To</TableCell>
                        <TableCell>Currency</TableCell>
                        <TableCell>Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {multiItems.map((item) => {
                        return (
                          <TableRow>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.from.name}</TableCell>
                            <TableCell>{item.to.name}</TableCell>
                            <TableCell>{item.currency.name}</TableCell>
                            <TableCell>{item.amount}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </CardContent>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};
